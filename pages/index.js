import Head from 'next/head'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Analytics } from "@vercel/analytics/react"

export default function Home() {
  const [userQuery, setUserQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [searchResults, setSearchResults] = useState(null)
  const [userContext, setUserContext] = useState({
    isFirstVisit: true,
    interests: [],
    previousInteractions: []
  })

  // AI-powered search
  const handleSearch = async (query) => {
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/ai-response', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userInput: query }),
      })

      if (!response.ok) {
        throw new Error('Failed to get AI response')
      }

      const data = await response.json()
      
      setSearchResults({
        query: query,
        summary: data.response,
        relevantCards: data.suggestedCards || []
      })
      
    } catch (error) {
      console.error('Error getting AI response:', error)
      setSearchResults({
        query: query,
        summary: 'Sorry, I encountered an error. Please try again.',
        relevantCards: []
      })
    }
    
    setIsLoading(false)
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (userQuery.trim()) {
      handleSearch(userQuery)
      setUserContext(prev => ({
        ...prev,
        previousInteractions: [...prev.previousInteractions, userQuery],
        isFirstVisit: false
      }))
    }
  }

  const exampleQueries = [
    'What is your favourite ice cream flavour?',
    'Tell me about your water projects',
    'Show me your publications',
    'What school do you attend?',
    'What are your hobbies?'
  ]

  return (
    <div className={styles.container}>
      <Head>
        <title>Roshan Taneja - Personal Search</title>
        <meta name="description" content="Search and learn about Roshan Taneja" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        {/* Google-like Search Interface */}
        <div className={styles.searchContainer}>
          <div className={styles.searchHeader}>
            <div className={styles.nameContainer}>
              <h1 className={styles.searchTitle}>
                Hi, I'm{' '}
                <a 
                  href="/resume/Roshan Taneja Resume.pdf" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={styles.resumeLink}
                >
                  Roshan Taneja
                  <div className={styles.tooltip}>Click my name to see my resume!</div>
                </a>
              </h1>
            </div>
            <p className={styles.searchSubtitle}>Ask me anything about my work, education, projects, or interests</p>
          </div>

          <form onSubmit={handleSearchSubmit} className={styles.searchForm}>
            <div className={styles.searchBox}>
              <input
                type="text"
                value={userQuery}
                onChange={(e) => setUserQuery(e.target.value)}
                placeholder="What would you like to know about me?"
                className={styles.searchInput}
                disabled={isLoading}
                onFocus={e => e.target.select()}
              />
              <button type="submit" className={styles.searchButton} disabled={isLoading}>
                {isLoading ? 'Searching...' : 'Search'}
              </button>
            </div>
          </form>

          {/* Example Queries */}
          {!searchResults && (
            <div className={styles.exampleQueries}>
              <p>Try asking:</p>
              <div className={styles.queryChips}>
                {exampleQueries.map((query, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setUserQuery(query)
                      handleSearch(query)
                    }}
                    className={styles.queryChip}
                  >
                    {query}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Search Results */}
        {searchResults && (
          <div className={styles.searchResults}>
            {/* AI Summary */}
            <div className={styles.aiSummary}>
              <div className={styles.summaryHeader}>
                <h2>Summary</h2>
                <span className={styles.queryDisplay}>"{searchResults.query}"</span>
              </div>
              <p className={styles.summaryText}>{searchResults.summary}</p>
            </div>

            {/* Relevant Cards */}
            {searchResults.relevantCards && searchResults.relevantCards.length > 0 && (
              <div className={styles.relevantCards}>
                <h3>Relevant Links</h3>
                {searchResults.relevantCards.map((cardGroup, groupIndex) => (
                  <div key={groupIndex} className={styles.cardGroup}>
                    <h4 className={styles.cardGroupCaption}>{cardGroup.caption}</h4>
                    <div className={styles.cardGrid}>
                      {cardGroup.cards.slice(0, 5).map((card, index) => (
                        <a 
                          key={index}
                          href={card.href} 
                          className={styles.relevantCard}
                          target={card.external ? "_blank" : undefined}
                          rel={card.external ? "noopener noreferrer" : undefined}
                        >
                          <h5>{card.title}</h5>
                          <p>{card.description}</p>
                        </a>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* New Search */}
            <div className={styles.newSearch}>
              <button 
                onClick={() => {
                  setSearchResults(null)
                  setUserQuery('')
                }}
                className={styles.newSearchButton}
              >
                New Search
              </button>
            </div>
          </div>
        )}

        <SpeedInsights/>
        <Analytics/>
      </main>

      <footer className={styles.footer}>
        Roshan Taneja &copy; all rights reserved. &nbsp; &nbsp;
        <a href="https://www.github.com/roshantaneja/roshantaneja.github.io" target="_blank" rel="noopener noreferrer" style={{alignSelf: 'right'}}>
          Wanna see how I built this site? Click me to check out the code on GitHub!
        </a>
      </footer>
    </div>
  )
}
