import {Html, Head, Main, NextScript} from "next/document";
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/react"

export default function Document() {
    return(
        <Html lang="en">
            <Head />
            <body>
            <Main />
            <NextScript />
            {/* Custom JS files */}
            <script
                async
                src='https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js'
            ></script>

            {/* theme js */}
            <script async src='/js/scripts.js'></script>

            {/* startbootstrap forms */}
            <script
                async
                src='https://cdn.startbootstrap.com/sb-forms-latest.js'
            ></script>
            <SpeedInsights/>
            <Analytics/>
            </body>
        </Html>
    )
}