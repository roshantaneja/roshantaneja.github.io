import { useState, useEffect, useRef } from 'react'
import styles from '../styles/DynamicExperience.module.css'

export default function DynamicExperience() {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [conversation, setConversation] = useState([])
  const [userProfile, setUserProfile] = useState({
    interests: [],
    visitCount: 0,
    lastVisit: null,
    preferredMode: 'text'
  })

  const recognitionRef = useRef(null)

  useEffect(() => {
    // Initialize speech recognition if available
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      recognitionRef.current = new window.webkitSpeechRecognition()
      recognitionRef.current.continuous = false
      recognitionRef.current.interimResults = false
      recognitionRef.current.lang = 'en-US'

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript
        setTranscript(transcript)
        handleVoiceInput(transcript)
      }

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error)
        setIsListening(false)
      }

      recognitionRef.current.onend = () => {
        setIsListening(false)
      }
    }

    // Load user profile from localStorage
    const savedProfile = localStorage.getItem('userProfile')
    if (savedProfile) {
      setUserProfile(JSON.parse(savedProfile))
    }
  }, [])

  const startListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.start()
      setIsListening(true)
    }
  }

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      setIsListening(false)
    }
  }

  const handleVoiceInput = async (input) => {
    setIsProcessing(true)
    
    // Simulate AI processing with more sophisticated understanding
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    const response = await processIntent(input)
    
    setConversation(prev => [...prev, 
      { type: 'user', content: input },
      { type: 'ai', content: response }
    ])
    
    setIsProcessing(false)
  }

  const processIntent = async (input) => {
    const intent = input.toLowerCase()
    
    // More sophisticated intent understanding
    if (intent.includes('resume') || intent.includes('cv') || intent.includes('experience') || intent.includes('background')) {
      return {
        type: 'resume',
        title: "Here's my professional background",
        content: {
          education: "Stanford University - Computer Science",
          experience: "ML Research, Water Projects, Competitive Programming",
          skills: "Python, React, ML/AI, Satellite Imagery Analysis",
          action: "Download my full resume"
        },
        message: "I'd be happy to share my professional background! I'm currently studying Computer Science at Stanford University, with experience in machine learning research, humanitarian water projects, and competitive programming. Would you like me to show you my detailed resume?"
      }
    }
    
    if (intent.includes('project') || intent.includes('work') || intent.includes('research') || intent.includes('what do you do')) {
      return {
        type: 'projects',
        title: "My key projects and research",
        content: {
          waterProject: "Rainwater harvesting for Maasai communities",
          mlResearch: "Satellite imagery analysis for water accessibility",
          competitiveProgramming: "Algorithmic problem solving",
          spaceInvaders: "Reinforcement learning game AI"
        },
        message: "I work on several exciting projects! My main focus is using machine learning to solve water accessibility challenges in Tanzania. I've also worked on competitive programming and AI game development. Which area interests you most?"
      }
    }
    
    if (intent.includes('contact') || intent.includes('email') || intent.includes('reach') || intent.includes('get in touch')) {
      return {
        type: 'contact',
        title: "Let's connect!",
        content: {
          email: "roshan@stanford.edu",
          github: "github.com/roshantaneja",
          linkedin: "linkedin.com/in/roshantaneja"
        },
        message: "I'd love to connect! You can reach me at roshan@stanford.edu, or find me on GitHub and LinkedIn. What's the best way for you to get in touch?"
      }
    }
    
    if (intent.includes('publication') || intent.includes('paper') || intent.includes('research') || intent.includes('published')) {
      return {
        type: 'publications',
        title: "My research publications",
        content: {
          neurips: "NeurIPS 2024 - ML for Social Impact",
          nhsjs: "National High School Journal of Science",
          patent: "US Patent Pending - Dwelling Detection"
        },
        message: "I've published research on using machine learning for water accessibility in Tanzania. My work won the NeurIPS 2024 ML for Social Impact award and is published in the National High School Journal of Science. Would you like to learn more about any specific publication?"
      }
    }
    
    if (intent.includes('hello') || intent.includes('hi') || intent.includes('hey')) {
      return {
        type: 'greeting',
        title: "Hello! I'm Roshan Taneja",
        content: {
          intro: "I'm a student, programmer, researcher, and writer focused on using technology to solve global water challenges.",
          ask: "What would you like to know about me? Try asking about my resume, projects, research, or just say hello!"
        },
        message: "Hello! I'm Roshan, a student and researcher passionate about using technology to solve global challenges. I'm particularly focused on water accessibility and machine learning. What would you like to know about me?"
      }
    }
    
    // Default response for unrecognized intent
    return {
      type: 'unknown',
      title: "I'm not sure I understood that",
      content: {
        suggestions: ["Try asking about my resume", "Ask about my projects", "Learn about my research", "Get my contact info"]
      },
      message: "I'm not quite sure what you're looking for. You can ask me about my resume, projects, research publications, or how to get in touch. What interests you most?"
    }
  }

  const handleTextInput = async (input) => {
    setIsProcessing(true)
    const response = await processIntent(input)
    
    setConversation(prev => [...prev, 
      { type: 'user', content: input },
      { type: 'ai', content: response }
    ])
    
    setIsProcessing(false)
  }

  return (
    <div className={styles.dynamicExperience}>
      {/* Voice Input Section */}
      <div className={styles.voiceSection}>
        <button
          onClick={isListening ? stopListening : startListening}
          className={`${styles.voiceButton} ${isListening ? styles.listening : ''}`}
          disabled={!recognitionRef.current}
        >
          {isListening ? '🎤 Listening...' : '🎤 Voice Input'}
        </button>
        {transcript && (
          <div className={styles.transcript}>
            "You said: {transcript}"
          </div>
        )}
      </div>

      {/* Conversation Display */}
      <div className={styles.conversation}>
        {conversation.map((message, index) => (
          <div key={index} className={`${styles.message} ${styles[message.type]}`}>
            <div className={styles.messageContent}>
              {message.type === 'ai' ? (
                <div>
                  <p>{message.content.message}</p>
                  {message.content.type === 'resume' && (
                    <div className={styles.quickActions}>
                      <button onClick={() => window.open('./resume/Roshan Taneja Resume.pdf')}>
                        Download Resume
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <p>{message.content}</p>
              )}
            </div>
          </div>
        ))}
        
        {isProcessing && (
          <div className={`${styles.message} ${styles.ai}`}>
            <div className={styles.thinking}>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
      </div>

      {/* Text Input */}
      <div className={styles.textInput}>
        <input
          type="text"
          placeholder="Type your question here..."
          onKeyPress={(e) => {
            if (e.key === 'Enter' && e.target.value.trim()) {
              handleTextInput(e.target.value)
              e.target.value = ''
            }
          }}
          className={styles.input}
        />
      </div>
    </div>
  )
} 