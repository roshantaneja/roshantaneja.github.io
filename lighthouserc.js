module.exports = {
  ci: {
    collect: {
      numberOfRuns: 1,
      url: ['http://localhost:3000/', 'http://localhost:3000/blog', 'http://localhost:3000/about'],
      startServerCommand: 'npm run start',
    },
    assert: {
      assertions: {
        'categories:performance': ['warn', { minScore: 0.85 }],
        'categories:accessibility': ['error', { minScore: 0.90 }],
        'categories:seo': ['warn', { minScore: 0.90 }],
        'categories:best-practices': ['warn', { minScore: 0.85 }],
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
}
