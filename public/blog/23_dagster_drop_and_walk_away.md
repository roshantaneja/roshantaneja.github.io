---
title: Using Sensors to implement "drop and walk away" on Dagster Pipelines
date: 04-24-2026
description: Drop a File. Walk Away. Let the Pipeline Figure It Out.
category: Tech
tags:
  - tech
  - data-engineering
  - nature
---

## The Problem

Here's the setup. You have a folder. Files show up in it. You want something to happen every time a new file appears — automatically, reliably, and without you having to do anything after the initial setup.

Simple enough, right? The naive solution is a cron job that runs a script every few minutes. And that works, until it doesn't: the script runs twice on the same file, or it crashes and you have no idea which files got processed, or it runs while a file is still being written and explodes.

What you actually want is something that:

- Detects new files and runs exactly once per file
- Never double-processes if a file hasn't changed
- Re-processes if a file is updated
- Keeps a full history of what ran and when
- Handles failures gracefully and lets you retry

That's a lot of requirements for a cron job. It's a normal day for a proper orchestration system.

This is where **Dagster** comes in.

---

## The Tools

Before we get into the architecture, quick intros for the uninitiated.

**Dagster** is a data orchestration framework. Think of it as the traffic controller for your data pipelines. It knows what needs to run, in what order, with what dependencies, and it keeps a complete record of everything that ever happened. It has a nice UI, good logging, and a solid mental model around "assets" — pieces of data your code produces.

**dbt** (data build tool) is a SQL transformation layer. You write `SELECT` statements, dbt runs them and materializes the results as tables in your database. It handles dependencies between models, documents your data, and gives you a clean way to separate "raw data" from "transformed data."

**DuckDB** is an embedded analytical database — think SQLite but for analytics. No server to run, no config, just a file. Perfect for local development.

Together they make a clean stack: Dagster orchestrates the pipeline, Python handles file I/O and artifact generation, dbt handles the SQL transformations, and DuckDB stores everything locally.

---

## The Architecture

The pipeline has three layers. Every file-ingestion pipeline I'd build with this stack follows this same shape:

```
LAYER 1 — INGEST
  File arrives on disk
  → Dagster detects it, triggers a run
  → Python reads the file, writes a raw row to the database

LAYER 2 — TRANSFORM (dbt)
  dbt reads the raw table
  → SQL model cleans and enriches it
  → Writes the result back to the database as a new table

LAYER 3 — OUTPUT
  Python reads the cleaned dbt table
  → Produces the final artifact (PDF, export, API call, whatever)
```

Here's what that looks like in the Dagster asset graph:

```
ingested_text → documents_cleaned → text_to_pdf
      ↑               (dbt)              ↑
   sensor                         reads from DB
   fires here
```

Each box is a Dagster **asset** — a unit of data your code produces. Dagster knows the dependencies between them and runs them in order. Let's build it from the bottom up.

---

## Step 1: The Sensor (the Magic Bit)

The sensor is what makes this "drop and walk away." It's a function that runs on a loop — every 10 seconds in our case — and decides whether to trigger a new pipeline run.

```python
from dagster import RunRequest, SensorEvaluationContext, SkipReason, sensor

@sensor(job=text_to_pdf_job, minimum_interval_seconds=10)
def text_file_sensor(context: SensorEvaluationContext):
    data_folder = os.getenv("DATA_FOLDER", "data")

    run_requests = []
    for file_path in sorted(Path(data_folder).glob("*.txt")):
        mtime = file_path.stat().st_mtime
        run_key = f"{file_path.name}_{mtime}"  # ← the deduplication key
        run_requests.append(
            RunRequest(
                run_key=run_key,
                run_config={
                    "ops": {
                        "ingested_text": {
                            "config": {"file_path": str(file_path.resolve())}
                        }
                    }
                },
            )
        )

    return run_requests or SkipReason("No .txt files found")
```

The critical piece is `run_key`. Dagster remembers every `run_key` it has ever seen for a sensor. If you return a `RunRequest` with a key Dagster has already seen, it ignores it — no duplicate run.

Our key is `"{filename}_{mtime}"`. The mtime (last-modified timestamp) is what makes this smart:

- File appears for the first time → new key → run fires
- File is untouched on next sensor tick → same key → nothing happens
- File is updated → mtime changes → new key → run fires again

That's all the deduplication logic. It's beautiful in its simplicity.

The sensor also passes the file path to the pipeline via `run_config`. That's how the downstream asset knows which file to process — it's baked into the run at trigger time.

---

## Step 2: The Ingestion Asset

Assets are the core abstraction in Dagster. An asset is a function that produces a piece of data. Dagster tracks when each asset was last materialized, what its dependencies are, and what it output.

```python
from dagster import AssetExecutionContext, Config, asset
from dagster_testing.resources import DocumentDatabase

class TextFileConfig(Config):
    file_path: str  # passed in from the sensor's run_config

@asset(group_name="text_pipeline")
def ingested_text(
    context: AssetExecutionContext,
    config: TextFileConfig,
    db: DocumentDatabase,       # ← injected resource
) -> str:
    file_path = Path(config.file_path)
    content = file_path.read_text(encoding="utf-8")

    db.ensure_schema()           # create table if it doesn't exist
    db.upsert_document(file_path.stem, str(file_path), content)

    return file_path.stem        # return the identifier for downstream assets
```

A few things to notice:

**`Config`** is how per-run parameters work. Every run triggered by the sensor carries a `file_path` in its config. Dagster injects it here automatically.

**`DocumentDatabase`** is a resource — a shared, injectable object (more on this in a moment). The asset declares it needs one, Dagster provides it.

**The return value.** The asset returns just the `filename_stem` — the filename without its extension. This travels downstream to the `text_to_pdf` asset as a parameter. The actual content doesn't travel in memory anymore; it lives in the database. This keeps the pipeline's data flow clean: Python handles I/O, the database handles storage, dbt handles transformation.

**`upsert_document`** inserts a new row or updates an existing one if the file has been processed before. One row per file, always current.

---

## Step 3: The Resource (DuckDB + Postgres)

A resource is something assets share — a database connection, an API client, a file system handle. You configure it once, and Dagster injects it wherever it's needed.

Here's the database resource, which supports both DuckDB and Postgres via a `db_type` flag:

```python
from dagster import ConfigurableResource

class DocumentDatabase(ConfigurableResource):
    db_type: str = "duckdb"
    duckdb_path: str = "data/dagster_testing.duckdb"
    postgres_host: str = "localhost"
    postgres_port: int = 5432
    postgres_user: str = ""
    postgres_password: str = ""
    postgres_dbname: str = "dagster_testing"

    def ensure_schema(self) -> None:
        # CREATE TABLE IF NOT EXISTS documents (...)
        ...

    def upsert_document(self, filename_stem, source_path, content) -> None:
        # INSERT ... ON CONFLICT DO UPDATE
        ...

    def fetch_cleaned_document(self, filename_stem) -> dict | None:
        # SELECT * FROM documents_cleaned WHERE filename_stem = ?
        ...
```

The resource exposes **domain-level methods** — `upsert_document`, `fetch_cleaned_document` — not raw SQL. Assets don't know whether they're talking to DuckDB or Postgres. The resource handles the differences internally (placeholder syntax, cursor handling, etc.).

Switching between the two is just an environment variable:

```env
# Local dev — use DuckDB
DB_TYPE=duckdb
DUCKDB_PATH=/absolute/path/to/data/project.duckdb

# Production — use Postgres
DB_TYPE=postgres
POSTGRES_HOST=my-db.example.com
POSTGRES_USER=myuser
POSTGRES_PASSWORD=mypassword
POSTGRES_DB=myproject
```

One subtle gotcha with DuckDB: `CURRENT_TIMESTAMP` inside a `DO UPDATE SET` clause gets parsed as a column name, not a function. Use `now()` instead:

```sql
-- wrong
ingested_at = CURRENT_TIMESTAMP

-- right  
ingested_at = now()
```

Postgres handles both fine. DuckDB only likes `now()` in that position. This one cost me a run.

---

## Step 4: dbt (The Transformation Layer)

dbt sits between the raw ingestion table and the final output. Its job: take the messy raw data and produce a clean, enriched table.

The dbt project lives in `dbt_project/` at the repo root:

```
dbt_project/
├── dbt_project.yml      # project config
├── profiles.yml         # database connections (dev=DuckDB, prod=Postgres)
└── models/
    ├── sources.yml      # tells dbt which tables are "inputs"
    └── documents_cleaned.sql
```

The `profiles.yml` handles the DuckDB/Postgres switch on dbt's side:

```yaml
dagster_testing:
  target: "{{ env_var('DBT_TARGET', 'dev') }}"
  outputs:
    dev:
      type: duckdb
      path: "{{ env_var('DUCKDB_PATH', '../data/dagster_testing.duckdb') }}"
      schema: main
    prod:
      type: postgres
      host: "{{ env_var('POSTGRES_HOST', 'localhost') }}"
      # ... etc
```

Note the `../` in the DuckDB path. dbt runs from inside `dbt_project/`, so paths are relative to that directory, not the repo root. If you put `data/dagster_testing.duckdb` it'll look for `dbt_project/data/` which doesn't exist. Always use absolute paths for `DUCKDB_PATH` when you override it via env var.

The `sources.yml` declares which database tables dbt reads from — and crucially, links them back to Dagster assets:

```yaml
sources:
  - name: raw
    schema: "{{ 'main' if target.type == 'duckdb' else 'public' }}"
    tables:
      - name: documents
        meta:
          dagster:
            asset_key: ["ingested_text"]    # ← this is the magic line
```

That `asset_key` annotation tells `dagster-dbt` that the `documents` source table is produced by the `ingested_text` Dagster asset. This wires up the dependency in the Dagster UI automatically — you get lineage for free.

The transformation model is straightforward SQL:

```sql
-- models/documents_cleaned.sql
{{ config(materialized='table') }}

SELECT
    filename_stem,
    source_path,
    TRIM(content)         AS content,
    LENGTH(TRIM(content)) AS char_count,
    ingested_at
FROM {{ source('raw', 'documents') }}
```

This trims whitespace and adds a `char_count` column. In a real pipeline this is where you'd do your actual transformation work — parsing, normalization, joins, derived columns, whatever your use case needs.

---

## Step 5: Wiring dbt into Dagster

This is where `dagster-dbt` does its thing. A single file wraps the entire dbt project as a Dagster asset:

```python
from dagster_dbt import DbtCliResource, DbtProject, dbt_assets

DBT_PROJECT_DIR = Path(__file__).parent.parent / "dbt_project"
dbt_project = DbtProject(project_dir=DBT_PROJECT_DIR)
dbt_project.prepare_if_dev()   # auto-runs `dbt parse` when dagster dev starts

@dbt_assets(manifest=dbt_project.manifest_path)
def dbt_documents(context: AssetExecutionContext, dbt: DbtCliResource):
    yield from dbt.cli(["run"], context=context).stream()
```

`@dbt_assets` reads the compiled dbt manifest and creates one Dagster asset per dbt model. Each model shows up in the Dagster UI with its own materialization history, logs, and lineage. The function body just runs `dbt run` and streams the output back to Dagster.

`prepare_if_dev()` handles a chicken-and-egg problem: `@dbt_assets` needs the manifest file (`target/manifest.json`) to exist at import time, but the manifest is generated by `dbt parse`. In dev mode, `prepare_if_dev()` runs `dbt parse` automatically before the decorator tries to read it. First time you set up a new environment, run `dbt parse` manually once just to be safe.

---

## Step 6: The Output Asset

The last asset reads from the dbt-cleaned table and produces the final artifact — in this case, a PDF.

```python
@asset(group_name="text_pipeline", deps=[AssetKey("documents_cleaned")])
def text_to_pdf(
    context: AssetExecutionContext,
    ingested_text: str,           # ← the filename_stem from Layer 1
    db: DocumentDatabase,
) -> str:
    doc_data = db.fetch_cleaned_document(ingested_text)
    if doc_data is None:
        raise ValueError(f"No cleaned document found for '{ingested_text}'")

    output_path = f"outputs/{doc_data['filename_stem']}.pdf"
    # ... PDF generation with ReportLab ...
    return output_path
```

Two dependency declarations are at play here, and they do different things:

**`ingested_text: str` as a parameter** — this is a data dependency. Dagster passes the string output of `ingested_text` directly into this function. It also enforces ordering: `ingested_text` runs first.

**`deps=[AssetKey("documents_cleaned")]`** — this is an ordering dependency without data transfer. It tells Dagster "don't run `text_to_pdf` until `documents_cleaned` (dbt) has materialized." The actual data comes from the database, not as a function argument.

Together, these two declarations give Dagster everything it needs to figure out the execution order: `ingested_text` → `documents_cleaned` → `text_to_pdf`. No ambiguity.

---

## Step 7: Tying It All Together

All of this gets registered in a single `Definitions` object:

```python
# definitions.py

defs = Definitions(
    assets=[*load_assets_from_modules([assets]), dbt_documents],
    jobs=[text_to_pdf_job],
    sensors=[text_file_sensor],
    resources={
        "db": DocumentDatabase(
            db_type=os.getenv("DB_TYPE", "duckdb"),
            duckdb_path=os.getenv("DUCKDB_PATH", "data/dagster_testing.duckdb"),
            # ... postgres params
        ),
        "dbt": DbtCliResource(
            project_dir="dbt_project",
            profiles_dir="dbt_project",   # ← look for profiles.yml here, not ~/.dbt/
        ),
    },
)
```

A few things worth calling out:

`load_assets_from_modules([assets])` scans the `assets` module for `@asset` functions. It does not pick up `@dbt_assets` — those get added manually as `dbt_documents`.

Resources are registered by string key (`"db"`, `"dbt"`). Any asset that declares a parameter with a matching name and type gets the resource injected. The name match is how Dagster knows which resource to inject.

`profiles_dir` on `DbtCliResource` is easy to forget. Without it, dbt looks for `profiles.yml` in `~/.dbt/` and ignores the project-local one you carefully wrote. Set it explicitly.

And `pyproject.toml` tells Dagster where to find the whole thing:

```toml
[tool.dagster]
module_name = "dagster_testing.definitions"
code_location_name = "dagster_testing"
```

---

## What It Looks Like Running

Once `dagster dev` is up at `http://localhost:3000`:

1. Drop a `.txt` file into the `data/` folder
2. Within 10 seconds, the sensor fires and creates a run
3. The Dagster UI shows the run progressing: `ingested_text` → `documents_cleaned` → `text_to_pdf`
4. The PDF appears in `outputs/`
5. Drop the same file again — nothing happens (same `run_key`)
6. Edit the file and save — new mtime, new `run_key`, new run fires

The Dagster UI gives you a full history of every run: what triggered it, what succeeded or failed, the compute logs for each step, and the asset lineage graph showing how everything connects.

---

## Where to Take This

The pattern generalizes to basically any file-ingestion problem. The substitutions are obvious:

- `.txt` files → `.csv`, `.shp`, `.geojson`, `.parquet`, anything
- `documents` table → whatever schema your data has
- `documents_cleaned` model → your actual SQL transformation logic
- `text_to_pdf` output → GeoJSON export, API call, downstream table load, report generation

The sensor, resource, and wiring stay almost identical. The dbt model is just SQL. The ingestion and output assets are the only parts that change meaningfully per use case.

If you're running multiple independent pipelines in one deployment, scope your jobs to asset groups so sensors don't accidentally trigger each other's assets:

```python
precinct_job = define_asset_job(
    "precinct_job",
    selection=AssetSelection.groups("precinct_pipeline")  # not AssetSelection.all()
)
```

And if you're processing files that accumulate over time and don't want dbt to reprocess the whole table every run, look into dbt's `incremental` materialization — it processes only new rows on each run.

---

## The Setup (Quick Version)

```bash
pip install dagster dagster-dbt dbt-duckdb dbt-postgres duckdb psycopg2-binary dagster-webserver

# Generate the dbt manifest (do this once on a new machine)
cd dbt_project && dbt parse && cd ..

# Start the UI
dagster dev
```

Drop a file into `data/`. That's it.

---

*The full source for this project, including the detailed architecture reference doc, is in the [dagster-testing repo](https://github.com/roshantaneja/dagster-testing). Questions, corrections, and improvements welcome.*

*— Roshan*
