import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Personal context about Roshan - you can expand this with your essays and more details
const PERSONAL_CONTEXT = `
You are Roshan Taneja, a UC Berkeley EECS student and researcher passionate about solving global issues—especially water scarcity—through machine learning, satellite imagery, and environmental systems.

EDUCATION:
- UC Berkeley, B.S. in Electrical Engineering & Computer Science, Class of 2029
- ACT: 36
- Sacred Heart Preparatory, Atherton (GPA: 3.97, 2022–25)
- Key Courses: Calc BC (5), Phys C: Mech (5), E&M (2), CompSci A (5), Phys 1 (5), Macro (4), Micro (4), Eng Lit (4), Eng Lang (3), Spanish (3), Post-AP Math, ML, Climate Sci (Berkeley), Remote Sensing (MIT), Data Science (UCLA), Spatial GIS (Harvard)

PROJECTS & RESEARCH:
- *Rainwater Harvesting Lead* (Maji Wells): Raised $100K+, deployed 100+ units reducing water collection time from 9 to 2 hrs/day for 10K+ Maasai in Monduli, Tanzania
- *Satellite AI Research*: Object detection for boma mapping across 500 sq mi using TensorFlow; improved accuracy from 30% to 93%
- *Harvard Spatial Data Lab Intern* (Prof. Siqin Wang): Hydrological modeling + topographic analysis to plan reservoir placement (2024–25)
- *Presentations*: NeurIPS '24 Winner (1 of 4/330), ML4EO @ Exeter, MDCON23 Lions Conf. (600+ audience)

PUBLICATIONS & IP:
- 2 NHSJS Papers: (1) Rainwater Impact, (2) Object Detection Model
- US Patent Pending: Dwelling detection using satellite imagery (#63/703,232)
- Short Story "Pomegranates" published in 3 journals; used in school curriculum

LEADERSHIP:
- Youth President, Maji Wells Water Programs (2021–)
- Class Officer, Sacred Heart (2023–25): 25+ events, created 3 lasting school traditions
- Founder & President, Improv Club (2022–25): 35+ members, campus showcases
- Hardware Lead, Robotics (2022–25): Built 3 state-qualifying bots; created CAD library; crash courses to support new members

AWARDS:
- NeurIPS '24 Winner: ML for Social Impact
- Presidential Volunteer Service Gold Medal (300+ hours)
- Melvin Jones Humanitarian Award
- UN SDG Youth Voices Winner (#6 – Water)
- AP Scholar w/ Distinction; Academic Honors in CS, Physics C, English, Spanish, Fundamentalism

OTHER EXPERIENCE:
- Engineering Intern, Fluxon Apps: Built Typescript billing tool; saved 2000+ hours
- Sales & Mechanic, Calabazas Cyclery: Sold $15K bikes, fixed inventory, ran media
- Intern, Harvard Spatial Data Lab: Hydrological modeling + topographic analysis to plan reservoir placement (2024–25)
- Featured: Harvard Spatial Blog, Sacred Heart Magazine, Lions MDCON, East Africa Lions '24

SKILLS & TOOLS:
- Python, JavaScript (React), TensorFlow, Google Earth Engine, ArcGIS, LaTeX
- CAD: Fusion360, SolidWorks; ML/AI, GIS, Remote Sensing, Creative Fabrication

HOBBIES:
- Custom trophy making: Designed whimsical, meaningful awards like the "Dumpster Fire Award"
- Improv comedy: Founder & president of your school's improv club, organizing shows and workshops
- Thrifting and upcycling: Refurbish furniture, decorate spaces with flair
- Reading: Frequently juggling multiple books—literature, history, tech, poetry
- Spontaneous projects: AI games, hardware hacks, maps and cartography tools

CONTACT:
- Email: rtaneja@berkeley.edu
- GitHub: github.com/roshantaneja
- LinkedIn: linkedin.com/in/roshantaneja
- Site: roshan.codes | Blog: roshantaneja.stck.me

COMMUNICATION INSTRUCTIONS:
Speak as Roshan. Use "I" statements. Be personal, curious, and specific. If asked about something outside this profile, guide the conversation toward your research, leadership, or contact info. Keep the response short and concise but dont leave out any details. Do not ask response questions or go off topic.
`

// Define all possible card sections with relevance keywords
const CARD_SECTIONS = {
  publications: {
    caption: 'Research & Publications',
    keywords: ['publication', 'research', 'writing', 'paper', 'journal', 'neurips', 'nhsjs', 'patent', 'academic', 'study'],
    cards: [
      {
        href: "/blog",
        title: "My Blog",
        description: "I write fiction, publish stories, and share reflections on tech, life, and everything in between."
      },
      {
        href: "https://nhsjs.com/wp-content/uploads/2024/12/Image-Classification-on-Satellite-Imagery-for-Sustainable-Water-Harvesting-Placement-in-Indigenous-Communities-of-Northern-Tanzania.pdf",
        title: "Remote Sensing and Machine Learning for Water Accessibility in Maasai Regions",
        description: "Winner NeurIPS 2024 [Machine Learning for Social Impact High School Track] • Presented at NeurIPS Convention 2024 in Vancouver • US Patent Pending Number 63/703,232 • Presented at ML4EO 2024 Conference at Univ. of Exeter UK • Published in National High School Journal of Science [Dec 2024]"
      },
      {
        href: "https://nhsjs.com/wp-content/uploads/2024/10/Evaluating-the-Impact-of-Water-Harvesting.pdf",
        title: "Impact of Rainwater Harvesting Units On Maasai Regions in Northern Tanzania",
        description: "Published in National High School Journal of Science [Oct 2024] • Presidential Volunteer Service Award - Gold Medal [300+ Hours] • Presented at MDCON23 [Multi-District East-Africa Convention] Audience of 600+ delegates • Melvin Jones Humanitarian Service Award"
      }
    ]
  },
  water_projects: {
    caption: 'Water & Humanitarian Projects',
    keywords: ['tanzania', 'water', 'harvesting', 'maasai', 'losimingori', 'monduli', 'rainwater', 'maji wells', 'humanitarian', 'development', 'africa'],
    cards: [
      {
        href: "/blog/3_faces-of-rainwater-harvesting",
        title: "Faces of Rainwater Harvesting",
        description: "Using machine learning to identify indigenous dwellings and improve water accessibility in underserved regions."
      },
      {
        href: "/tanzania",
        title: "Bringing Water to the Maasai",
        description: "Led the deployment of 100+ rainwater harvesting units, reducing water collection time for 4500+ Maasai people."
      },
      {
        href: "https://map.roshan.codes",
        title: "Map of Deployed Units",
        description: "Interactive map of the deployed rainwater harvesting units in Northern Tanzania.",
        external: true
      }
    ]
  },
  programming: {
    caption: 'Programming & Technical Projects',
    keywords: ['programming', 'coding', 'projects', 'competitive', 'github', 'algorithm', 'space invaders', 'reinforcement learning', 'technical', 'software', 'code'],
    cards: [
      {
        href: "https://github.com/roshantaneja",
        title: "My Github",
        description: "Come check out some of the projects I'm working on!",
        external: true
      },
      {
        href: "https://github.com/roshantaneja/competitive-programming",
        title: "Competitive Programming",
        description: "Daily puzzle advent calendar and my solutions repository—join me in cracking algorithmic challenges!",
        external: true
      },
      {
        href: "https://github.com/roshantaneja/spaceinvaders-reinforcementlearning",
        title: "Space Invaders",
        description: "Using reinforcement learning to beat the classic game—exploring AI for fun and learning.",
        external: true
      },
      {
        href: "https://github.com/roshantaneja/roshantaneja.github.io",
        title: "This Website",
        description: "The Code for this website—built with Next.js, React, and Tailwind CSS.",
        external: true
      }
    ]
  },
  education: {
    caption: 'Education & Academic',
    keywords: ['school', 'university', 'college', 'berkeley', 'uc berkeley', 'sacred heart', 'gpa', 'act', 'academic', 'education', 'student'],
    cards: [
      {
        href: "/resume/Roshan Taneja Resume.pdf",
        title: "My Resume",
        description: "Download my complete resume with all academic achievements, projects, and experience.",
        external: true
      },
      {
        href: "/about",
        title: "About Me",
        description: "Learn more about my background, education, and journey."
      }
    ]
  },
  contact: {
    caption: 'Contact & Connect',
    keywords: ['contact', 'email', 'reach', 'connect', 'linkedin', 'github', 'social', 'communication'],
    cards: [
      {
        href: "mailto:rtaneja@berkeley.edu",
        title: "Email Me",
        description: "rtaneja@berkeley.edu - I'd love to hear from you!",
        external: true
      },
      {
        href: "https://linkedin.com/in/roshantaneja",
        title: "LinkedIn",
        description: "Connect with me professionally on LinkedIn.",
        external: true
      },
      {
        href: "https://github.com/roshantaneja",
        title: "GitHub",
        description: "Check out my code and projects on GitHub.",
        external: true
      }
    ]
  },
  hobbies: {
    caption: 'Hobbies & Interests',
    keywords: ['hobby', 'interest', 'like to do', 'trophy', 'improv', 'comedy', 'thrifting', 'reading', 'creative', 'fun'],
    cards: [
      {
        href: "/blog",
        title: "My Writing",
        description: "I write fiction, poetry, and creative pieces - check out my blog for some of my work."
      },
      {
        href: "/about",
        title: "More About Me",
        description: "Learn about my hobbies, interests, and what makes me tick."
      }
    ]
  }
}

// Function to calculate relevance score for a section based on query and response
function calculateRelevanceScore(section, userQuery, aiResponse) {
  const query = userQuery.toLowerCase()
  const response = aiResponse.toLowerCase()
  const sectionKeywords = section.keywords
  
  let score = 0
  
  // Check query keywords
  sectionKeywords.forEach(keyword => {
    if (query.includes(keyword)) {
      score += 3 // High weight for query matches
    }
  })
  
  // Check response keywords
  sectionKeywords.forEach(keyword => {
    if (response.includes(keyword)) {
      score += 2 // Medium weight for response matches
    }
  })
  
  // Special handling for specific query types
  if (query.includes('resume') || query.includes('cv')) {
    if (section.caption.includes('Education')) score += 5
  }
  
  if (query.includes('publication') || query.includes('research')) {
    if (section.caption.includes('Research')) score += 5
  }
  
  if (query.includes('water') || query.includes('tanzania')) {
    if (section.caption.includes('Water')) score += 5
  }
  
  if (query.includes('hobby') || query.includes('interest')) {
    if (section.caption.includes('Hobbies')) score += 5
  }
  
  if (query.includes('contact') || query.includes('email')) {
    if (section.caption.includes('Contact')) score += 5
  }
  
  return score
}

// Function to select most relevant cards (3-5 max)
function selectRelevantCards(cards, userQuery, aiResponse) {
  const query = userQuery.toLowerCase()
  const response = aiResponse.toLowerCase()
  
  // Score each card based on relevance
  const scoredCards = cards.map(card => {
    let score = 0
    const cardText = (card.title + ' ' + card.description).toLowerCase()
    
    // Check if query keywords appear in card
    const queryWords = query.split(' ').filter(word => word.length > 2)
    queryWords.forEach(word => {
      if (cardText.includes(word)) score += 2
    })
    
    // Check if response keywords appear in card
    const responseWords = response.split(' ').filter(word => word.length > 3)
    responseWords.forEach(word => {
      if (cardText.includes(word)) score += 1
    })
    
    // Bonus for exact matches
    if (query.includes('resume') && card.title.toLowerCase().includes('resume')) score += 5
    if (query.includes('github') && card.title.toLowerCase().includes('github')) score += 5
    if (query.includes('blog') && card.title.toLowerCase().includes('blog')) score += 5
    
    return { ...card, score }
  })
  
  // Sort by score and take top 3-5
  scoredCards.sort((a, b) => b.score - a.score)
  return scoredCards.slice(0, Math.min(5, Math.max(3, scoredCards.length)))
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const { userInput } = req.body

    if (!userInput) {
      return res.status(400).json({ message: 'User input is required' })
    }

    const prompt = `${PERSONAL_CONTEXT}

User Question: "${userInput}"

Please respond as Roshan Taneja, naturally and conversationally. If the user is asking about specific information like GPA, school, hobbies, etc., provide the relevant details. If the information isn't available in the context above, politely mention that and redirect them to ask about your projects, research, or contact information.

Response:`

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are Roshan Taneja, a student and researcher passionate about using technology to solve global problems. Respond naturally and conversationally, using 'I' statements. Be helpful and provide specific details when relevant."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 300,
      temperature: 0.7,
    })

    const response = completion.choices[0].message.content

    // Calculate relevance scores for all sections
    const scoredSections = Object.entries(CARD_SECTIONS).map(([key, section]) => {
      const score = calculateRelevanceScore(section, userInput, response)
      return { key, section, score }
    })
    
    // Sort sections by relevance score and filter out low-scoring ones
    scoredSections.sort((a, b) => b.score - a.score)
    const relevantSections = scoredSections.filter(item => item.score > 0)
    
    // Select the most relevant sections (max 3) and their most relevant cards
    const suggestedCards = relevantSections.slice(0, 3).map(({ section }) => {
      const relevantCards = selectRelevantCards(section.cards, userInput, response)
      
      return {
        category: section.caption.toLowerCase().replace(/[^a-z0-9]/g, '_'),
        caption: section.caption,
        cards: relevantCards
      }
    })

    res.status(200).json({
      response,
      originalQuery: userInput,
      suggestedCards
    })

  } catch (error) {
    console.error('OpenAI API error:', error)
    res.status(500).json({ 
      message: 'Error processing request',
      error: error.message 
    })
  }
} 