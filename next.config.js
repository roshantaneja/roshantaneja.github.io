/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  output: 'export'
  /* config options here */
}

module.exports = nextConfig

// next.config.js

const isGithubActions = process.env.GITHUB_ACTIONS || false

let assetPrefix = ' '
let basePath = ''

if (isGithubActions) {
  const repo = process.env.GITHUB_REPOSITORY.replace(/.*?\//, '')

  assetPrefix = `/${repo}/`
  basePath = `/${repo}`
}

module.exports = {
  assetPrefix: assetPrefix,
  basePath: basePath,
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  // Removed custom images loader to use default for local images
}