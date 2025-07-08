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
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <Head>
        <title>AI Test Page</title>
      </Head>

      <h1>AI Response Test</h1>
      <p>Test the AI responses here. Make sure you have set up your OPENAI_API_KEY in .env.local</p>

      <div style={{ marginBottom: '2rem' }}>
        <h3>Quick Test Queries:</h3>
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
                cursor: 'pointer'
              }}
            >
              {query}
            </button>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <h3>Custom Query:</h3>
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
              borderRadius: '4px'
            }}
          />
          <button
            onClick={() => handleTest(input)}
            disabled={loading || !input.trim()}
            style={{
              padding: '0.5rem 1rem',
              background: loading ? '#ccc' : '#b200f3',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer'
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
          marginBottom: '1rem'
        }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {response && (
        <div style={{ 
          padding: '1rem', 
          background: '#f5f5f5', 
          borderRadius: '4px',
          border: '1px solid #ddd'
        }}>
          <h4>AI Response:</h4>
          <p style={{ whiteSpace: 'pre-wrap' }}>{response}</p>
        </div>
      )}

      <div style={{ marginTop: '2rem', padding: '1rem', background: '#e8f5e8', borderRadius: '4px' }}>
        <h3>Setup Instructions:</h3>
        <ol>
          <li>Create a <code>.env.local</code> file in the root directory</li>
          <li>Add your OpenAI API key: <code>OPENAI_API_KEY=your_key_here</code></li>
          <li>Restart the development server</li>
          <li>Try the test queries above</li>
        </ol>
      </div>
    </div>
  )
} 