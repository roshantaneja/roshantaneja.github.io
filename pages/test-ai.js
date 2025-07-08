import { useState } from 'react'
import Head from 'next/head'

export default function TestAI() {
  const [input, setInput] = useState('')
  const [response, setResponse] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const testQueries = [
    'What is your GPA?',
    'What school do you attend?',
    'What are your hobbies?',
    'Tell me about your projects',
    'How can I contact you?'
  ]

  const handleTest = async (query) => {
    setInput(query)
    setLoading(true)
    setError('')
    setResponse('')

    try {
      const res = await fetch('/api/ai-response', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userInput: query }),
      })

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`)
      }

      const data = await res.json()
      setResponse(data.response)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ 
      padding: '2rem', 
      maxWidth: '800px', 
      margin: '0 auto',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      lineHeight: '1.6'
    }}>
      <Head>
        <title>AI Test Page</title>
      </Head>

      <h1 style={{ color: '#333', marginBottom: '1rem' }}>AI Response Test</h1>
      <p style={{ color: '#666', marginBottom: '2rem' }}>
        Test the AI responses here. Make sure you have set up your OPENAI_API_KEY in .env.local
      </p>

      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{ color: '#333', marginBottom: '1rem' }}>Quick Test Queries:</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {testQueries.map((query, index) => (
            <button
              key={index}
              onClick={() => handleTest(query)}
              style={{
                padding: '0.5rem 1rem',
                background: '#b200f3',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '0.9rem',
                transition: 'background-color 0.2s ease'
              }}
              onMouseOver={(e) => e.target.style.background = '#8a00c4'}
              onMouseOut={(e) => e.target.style.background = '#b200f3'}
            >
              {query}
            </button>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{ color: '#333', marginBottom: '1rem' }}>Custom Query:</h3>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your question here..."
            style={{
              flex: 1,
              padding: '0.5rem',
              border: '1px solid #ccc',
              borderRadius: '4px',
              fontSize: '1rem'
            }}
          />
          <button
            onClick={() => handleTest(input)}
            disabled={loading || !input.trim()}
            style={{
              padding: '0.5rem 1rem',
              background: loading || !input.trim() ? '#ccc' : '#b200f3',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
              fontSize: '1rem'
            }}
          >
            {loading ? 'Testing...' : 'Test'}
          </button>
        </div>
      </div>

      {error && (
        <div style={{ 
          padding: '1rem', 
          background: '#ffebee', 
          color: '#c62828', 
          borderRadius: '4px',
          marginBottom: '1rem',
          border: '1px solid #ffcdd2'
        }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {response && (
        <div style={{ 
          padding: '1.5rem', 
          background: '#f8f9fa', 
          borderRadius: '8px',
          border: '1px solid #e0e0e0',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h4 style={{ color: '#333', marginBottom: '1rem', marginTop: '0' }}>AI Response:</h4>
          <p style={{ 
            whiteSpace: 'pre-wrap', 
            color: '#333',
            margin: '0',
            lineHeight: '1.6'
          }}>
            {response}
          </p>
        </div>
      )}

      <div style={{ 
        marginTop: '2rem', 
        padding: '1.5rem', 
        background: '#e8f5e8', 
        borderRadius: '8px',
        border: '1px solid #c8e6c9'
      }}>
        <h3 style={{ color: '#2e7d32', marginTop: '0', marginBottom: '1rem' }}>Setup Instructions:</h3>
        <ol style={{ color: '#2e7d32', margin: '0' }}>
          <li>Create a <code style={{ background: '#fff', padding: '0.2rem 0.4rem', borderRadius: '3px' }}>.env.local</code> file in the root directory</li>
          <li>Add your OpenAI API key: <code style={{ background: '#fff', padding: '0.2rem 0.4rem', borderRadius: '3px' }}>OPENAI_API_KEY=your_key_here</code></li>
          <li>Restart the development server</li>
          <li>Try the test queries above</li>
        </ol>
      </div>
    </div>
  )
} 