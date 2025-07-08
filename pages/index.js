import Head from 'next/head'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Analytics } from "@vercel/analytics/react"
import DynamicExperience from '../components/DynamicExperience'

export default function Home() {
  const [userIntent, setUserIntent] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [dynamicContent, setDynamicContent] = useState(null)
  const [interactionMode, setInteractionMode] = useState('text') // text, voice, visual
  const [showAdvancedAI, setShowAdvancedAI] = useState(false)
  const [userContext, setUserContext] = useState({
    isFirstVisit: true,
    interests: [],
    previousInteractions: []
  })

  // AI-powered intent understanding
  const understandIntent = async (input) => {
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/ai-response', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userInput: input }),
      })

      if (!response.ok) {
        throw new Error('Failed to get AI response')
      }

      const data = await response.json()
      
      // Create dynamic content based on AI response type
      let dynamicResponse = null
      
      switch (data.type) {
        case 'academic':
          dynamicResponse = {
            type: 'academic',
            title: "Academic Information",
            content: {
              response: data.response,
              originalQuery: data.originalQuery
            }
          }
          break
          
        case 'education':
          dynamicResponse = {
            type: 'education',
            title: "Educational Background",
            content: {
              response: data.response,
              originalQuery: data.originalQuery
            }
          }
          break
          
        case 'personal':
          dynamicResponse = {
            type: 'personal',
            title: "Personal Interests",
            content: {
              response: data.response,
              originalQuery: data.originalQuery
            }
          }
          break
          
        case 'resume':
          dynamicResponse = {
            type: 'resume',
            title: "Professional Background",
            content: {
              response: data.response,
              education: "UC Berkeley - Electrical Engineering & Computer Science",
              experience: "ML Research, Water Projects, Competitive Programming",
              skills: "Python, React, ML/AI, Satellite Imagery Analysis",
              action: "Download my full resume"
            }
          }
          break
          
        case 'projects':
          dynamicResponse = {
            type: 'projects',
            title: "My Projects & Research",
            content: {
              response: data.response,
              waterProject: "Rainwater harvesting for Maasai communities",
              mlResearch: "Satellite imagery analysis for water accessibility",
              competitiveProgramming: "Algorithmic problem solving",
              spaceInvaders: "Reinforcement learning game AI"
            }
          }
          break
          
        case 'contact':
          dynamicResponse = {
            type: 'contact',
            title: "Get in Touch",
            content: {
              response: data.response,
              email: "roshan@stanford.edu",
              github: "github.com/roshantaneja",
              linkedin: "linkedin.com/in/roshantaneja"
            }
          }
          break
          
        default:
          dynamicResponse = {
            type: 'general',
            title: "Response",
            content: {
              response: data.response,
              originalQuery: data.originalQuery
            }
          }
      }

      setDynamicContent(dynamicResponse)
      
    } catch (error) {
      console.error('Error getting AI response:', error)
      // Fallback to original hardcoded responses
      const intent = input.toLowerCase()
      let response = null

      if (intent.includes('resume') || intent.includes('cv') || intent.includes('experience')) {
        response = {
          type: 'resume',
          title: "Here's my professional background",
          content: {
            education: "UC Berkeley - Electrical Engineering & Computer Science",
            experience: "ML Research, Water Projects, Competitive Programming",
            skills: "Python, React, ML/AI, Satellite Imagery Analysis",
            action: "Download my full resume"
          }
        }
      } else if (intent.includes('project') || intent.includes('work') || intent.includes('research')) {
        response = {
          type: 'projects',
          title: "My key projects and research",
          content: {
            waterProject: "Rainwater harvesting for Maasai communities",
            mlResearch: "Satellite imagery analysis for water accessibility",
            competitiveProgramming: "Algorithmic problem solving",
            spaceInvaders: "Reinforcement learning game AI"
          }
        }
      } else if (intent.includes('contact') || intent.includes('email') || intent.includes('reach')) {
        response = {
          type: 'contact',
          title: "Let's connect!",
          content: {
            email: "roshan@stanford.edu",
            github: "github.com/roshantaneja",
            linkedin: "linkedin.com/in/roshantaneja"
          }
        }
      } else {
        response = {
          type: 'welcome',
          title: "Hello! I'm Roshan Taneja",
          content: {
            intro: "I'm a student, programmer, researcher, and writer focused on using technology to solve global water challenges.",
            ask: "What would you like to know about me? Try asking about my resume, projects, research, or just say hello!"
          }
        }
      }
      
      setDynamicContent(response)
    }
    
    setIsLoading(false)
  }

  const handleIntentSubmit = (e) => {
    e.preventDefault()
    if (userIntent.trim()) {
      understandIntent(userIntent)
      setUserContext(prev => ({
        ...prev,
        previousInteractions: [...prev.previousInteractions, userIntent],
        isFirstVisit: false
      }))
    }
  }

  const quickActions = [
    { label: "Show my resume", intent: "I want to see your resume and experience" },
    { label: "Tell me about your projects", intent: "What projects and research have you worked on?" },
    { label: "Your publications", intent: "Show me your research publications and papers" },
    { label: "Contact info", intent: "How can I get in touch with you?" }
  ]

  // If advanced AI mode is enabled, show the DynamicExperience component
  if (showAdvancedAI) {
    return (
      <div className={styles.container}>
        <Head>
          <title>Roshan Taneja - AI Experience</title>
          <meta name="description" content="Advanced AI-powered dynamic personal website experience" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main className={styles.main}>
          <div className={styles.aiHeader}>
            <h1 className={styles.title}>AI-Powered Experience</h1>
            <p className={styles.description}>
              Experience the future of web interaction with voice input and intelligent responses
            </p>
          </div>

          <DynamicExperience />

          <div className={styles.modeSwitch}>
            <button 
              onClick={() => setShowAdvancedAI(false)}
              className={styles.switchButton}
            >
              ← Back to Simple Mode
            </button>
          </div>

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

  return (
    <div className={styles.container}>
      <Head>
        <title>Roshan Taneja - Dynamic Experience</title>
        <meta name="description" content="AI-powered dynamic personal website experience" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        {/* Dynamic Header */}
        <div className={styles.dynamicHeader}>
          <h1 className={styles.title}>
            {dynamicContent ? dynamicContent.title : "Hello, I'm Roshan!"}
          </h1>
          
          {!dynamicContent && (
            <p className={styles.description}>
              Welcome to my dynamic website experience. Instead of static pages, 
              tell me what you're looking for and I'll adapt the experience just for you.
            </p>
          )}
        </div>

        {/* Intent Input */}
        <div className={styles.intentSection}>
          <form onSubmit={handleIntentSubmit} className={styles.intentForm}>
            <input
              type="text"
              value={userIntent}
              onChange={(e) => setUserIntent(e.target.value)}
              placeholder="What would you like to know about me? (e.g., 'Show me your resume', 'Tell me about your projects')"
              className={styles.intentInput}
              disabled={isLoading}
            />
            <button type="submit" className={styles.intentButton} disabled={isLoading}>
              {isLoading ? 'Thinking...' : 'Ask'}
            </button>
          </form>
        </div>

        {/* Quick Actions */}
        {!dynamicContent && (
          <div className={styles.quickActions}>
            <p>Or try one of these:</p>
            <div className={styles.actionButtons}>
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setUserIntent(action.intent)
                    understandIntent(action.intent)
                  }}
                  className={styles.actionButton}
                >
                  {action.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Dynamic Content Display */}
        {dynamicContent && (
          <div className={styles.dynamicContent}>
            {dynamicContent.type === 'resume' && (
              <div className={styles.resumeSection}>
                <h2>Professional Background</h2>
                <div className={styles.resumeGrid}>
                  <div className={styles.resumeCard}>
                    <h3>Education</h3>
                    <p>{dynamicContent.content.education}</p>
                  </div>
                  <div className={styles.resumeCard}>
                    <h3>Experience</h3>
                    <p>{dynamicContent.content.experience}</p>
                  </div>
                  <div className={styles.resumeCard}>
                    <h3>Skills</h3>
                    <p>{dynamicContent.content.skills}</p>
                  </div>
                </div>
                <a href="./resume/Roshan Taneja Resume.pdf" className={styles.downloadButton}>
                  Download Full Resume
                </a>
              </div>
            )}

            {dynamicContent.type === 'projects' && (
              <div className={styles.projectsSection}>
                <h2>Featured Projects</h2>
                <div className={styles.grid}>
                  <a href="/tanzania" className={styles.card}>
                    <h2>Water for Maasai &rarr;</h2>
                    <p>{dynamicContent.content.waterProject}</p>
                  </a>
                  <a href="/blog/3_faces-of-rainwater-harvesting" className={styles.card}>
                    <h2>ML Research &rarr;</h2>
                    <p>{dynamicContent.content.mlResearch}</p>
                  </a>
                  <a href="https://github.com/roshantaneja/competitive-programming" className={styles.card}>
                    <h2>Competitive Programming &rarr;</h2>
                    <p>{dynamicContent.content.competitiveProgramming}</p>
                  </a>
                  <a href="https://github.com/roshantaneja/spaceinvaders-reinforcementlearning" className={styles.card}>
                    <h2>Space Invaders AI &rarr;</h2>
                    <p>{dynamicContent.content.spaceInvaders}</p>
                  </a>
                </div>
              </div>
            )}

            {dynamicContent.type === 'contact' && (
              <div className={styles.contactSection}>
                <h2>Get in Touch</h2>
                <div className={styles.contactGrid}>
                  <div className={styles.contactCard}>
                    <h3>Email</h3>
                    <a href={`mailto:${dynamicContent.content.email}`}>{dynamicContent.content.email}</a>
                  </div>
                  <div className={styles.contactCard}>
                    <h3>GitHub</h3>
                    <a href={`https://${dynamicContent.content.github}`} target="_blank" rel="noopener noreferrer">
                      {dynamicContent.content.github}
                    </a>
                  </div>
                  <div className={styles.contactCard}>
                    <h3>LinkedIn</h3>
                    <a href={`https://${dynamicContent.content.linkedin}`} target="_blank" rel="noopener noreferrer">
                      {dynamicContent.content.linkedin}
                    </a>
                  </div>
                </div>
              </div>
            )}

            {dynamicContent.type === 'academic' && (
              <div className={styles.aiResponseSection}>
                <h2>Academic Information</h2>
                <div className={styles.aiResponseCard}>
                  <p className={styles.aiResponse}>{dynamicContent.content.response}</p>
                  <div className={styles.originalQuery}>
                    <small>You asked: "{dynamicContent.content.originalQuery}"</small>
                  </div>
                </div>
              </div>
            )}

            {dynamicContent.type === 'education' && (
              <div className={styles.aiResponseSection}>
                <h2>Educational Background</h2>
                <div className={styles.aiResponseCard}>
                  <p className={styles.aiResponse}>{dynamicContent.content.response}</p>
                  <div className={styles.originalQuery}>
                    <small>You asked: "{dynamicContent.content.originalQuery}"</small>
                  </div>
                </div>
              </div>
            )}

            {dynamicContent.type === 'personal' && (
              <div className={styles.aiResponseSection}>
                <h2>Personal Interests</h2>
                <div className={styles.aiResponseCard}>
                  <p className={styles.aiResponse}>{dynamicContent.content.response}</p>
                  <div className={styles.originalQuery}>
                    <small>You asked: "{dynamicContent.content.originalQuery}"</small>
                  </div>
                </div>
              </div>
            )}

            {dynamicContent.type === 'general' && (
              <div className={styles.aiResponseSection}>
                <h2>Response</h2>
                <div className={styles.aiResponseCard}>
                  <p className={styles.aiResponse}>{dynamicContent.content.response}</p>
                  <div className={styles.originalQuery}>
                    <small>You asked: "{dynamicContent.content.originalQuery}"</small>
                  </div>
                </div>
              </div>
            )}

            {dynamicContent.type === 'publications' && (
              <div className={styles.publicationsSection}>
                <h2>Research Publications</h2>
                <div className={styles.grid}>
                  <a href="https://nhsjs.com/wp-content/uploads/2024/12/Image-Classification-on-Satellite-Imagery-for-Sustainable-Water-Harvesting-Placement-in-Indigenous-Communities-of-Northern-Tanzania.pdf" className={styles.card}>
                    <h2>NeurIPS 2024 &rarr;</h2>
                    <p>{dynamicContent.content.neurips}</p>
                  </a>
                  <a href="https://nhsjs.com/wp-content/uploads/2024/10/Evaluating-the-Impact-of-Water-Harvesting.pdf" className={styles.card}>
                    <h2>NHSJS Publication &rarr;</h2>
                    <p>{dynamicContent.content.nhsjs}</p>
                  </a>
                  <div className={styles.card}>
                    <h2>US Patent Pending &rarr;</h2>
                    <p>{dynamicContent.content.patent}</p>
                  </div>
                </div>
              </div>
            )}

            {dynamicContent.type === 'welcome' && (
              <div className={styles.welcomeSection}>
                <p className={styles.description}>{dynamicContent.content.intro}</p>
                <p className={styles.description}>{dynamicContent.content.ask}</p>
              </div>
            )}
          </div>
        )}

        {/* Mode Selection */}
        <div className={styles.modeSelection}>
          <button 
            onClick={() => setShowAdvancedAI(true)}
            className={styles.advancedButton}
          >
            🚀 Try Advanced AI Experience
          </button>
          
          <button 
            onClick={() => setDynamicContent(null)}
            className={styles.legacyButton}
          >
            Switch to Traditional View
          </button>
        </div>

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
