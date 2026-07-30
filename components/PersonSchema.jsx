/**
 * Emits a schema.org Person block as JSON-LD.
 *
 * Name and site URL come from data/site.json; every descriptive field —
 * including sameAs — comes from data/person.json. Rendered on the identity
 * pages (/ and /about) so crawlers and retrieval agents get structured facts
 * alongside the prose summary at /llms.txt.
 */
import siteData from '../data/site.json'
import personData from '../data/person.json'

export default function PersonSchema() {
  const { _comment, image, ...person } = personData
  const site = siteData.urls.site

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: siteData.owner.name,
    url: site,
    image: `${site}${image}`,
    ...person,
  }

  return (
    <script
      type="application/ld+json"
      // Content is build-time JSON from our own data/ files, not user input.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
