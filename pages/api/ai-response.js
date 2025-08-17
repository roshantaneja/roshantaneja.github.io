import OpenAI from 'openai'
import searchCards from '../../data/searchCards.json'

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
- AP Courses: Calc BC (5), Phys C: Mech (5), E&M (2), CompSci A (5), Phys 1 (5), Macro (4), Micro (4), Eng Lit (4), Eng Lang (3), Spanish (3)
- Other Courses: Post-AP Math, Multivariable, Linear Algebra, Advanced CS, ML
- Summer Courses: Climate Sci (Berkeley), Remote Sensing (MIT), Data Science (UCLA), Spatial GIS (Harvard)

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

PERSONAL INFORMATION:
- One younger brother, just under 2 years younger than me.
- I dont answer any personal questions about my relationships or my family for safety sake.
- I'm a big fan of the show "Voltron" and "Beyblade: Metal Fusion"
- I love to read and write poetry, fiction, and SWE guides in my blog.
- Im a sucker for Hazelnut Ice Cream
- I love to play Strategy games (Balatro, GPRO, Super Auto Pets)
- I love the beach and swimming

DEEP STUFF:
- I hate heights and snakes

CONTACT:
- Email: rtaneja@berkeley.edu
- GitHub: github.com/roshantaneja
- LinkedIn: linkedin.com/in/roshan-taneja
- Site: roshan.codes | Blog: roshantaneja.stck.me

COMMUNICATION INSTRUCTIONS:
Speak as Roshan. Use "I" statements. Be personal, curious, and specific. If asked about something outside this profile, guide the conversation toward your research, leadership, or contact info. Keep the response short and concise but dont leave out any details. Do not ask response questions or go off topic.
`

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

// Function to add score for matching keywords in the query and card title
function addKeywordScore(query, cardTitle, keywords, score) {
  let total = 0;
  keywords.forEach(keyword => {
    if (query.includes(keyword) && cardTitle.includes(keyword)) {
      total += score;
    }
  });
  return total;
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

    // Use helper for other keywords
    score += addKeywordScore(query, card.title.toLowerCase(), [
      'water', 'tanzania', 'hobby', 'interest', 'contact', 'email', 'linkedin',
      'instagram', 'twitter', 'youtube', 'tiktok', 'reddit',
      'improv', 'comedy', 'thrifting', 'reading', 'creative', 'fun', 'poem', 'sonnet', 'villanelle', 'haiku', 'limerick', 'ballad', 'ode', 'college', 'application', 'timeline', 'tutorial', 'covid', 'pandemic', 'lockdown', 'friendship', 'classroom', 'future', 'self', 'mold', 'america', 'love', 'breakup', 'dissolution', 'senior', 'honors', 'study', 'satellite', 'detection'
    ], 5)
    
    return { ...card, score }
  })
  
  // Sort by score and take top 2
  scoredCards.sort((a, b) => b.score - a.score)
  return scoredCards.slice(0, 2)
}

// Function to select most relevant cards across all sections
function selectAllRelevantCards(searchCards, userQuery, aiResponse) {
  const query = userQuery.toLowerCase()
  const response = aiResponse.toLowerCase()
  
  // Collect all cards from all sections
  let allCards = []
  searchCards.forEach(section => {
    section.cards.forEach(card => {
      allCards.push({ ...card, section: section.caption })
    })
  })
  
  // Score each card based on relevance
  const scoredCards = allCards.map(card => {
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

    // Use helper for other keywords
    score += addKeywordScore(query, card.title.toLowerCase(), [
      'water', 'tanzania', 'hobby', 'interest', 'contact', 'email', 'linkedin',
      'instagram', 'twitter', 'youtube', 'tiktok', 'reddit',
      'improv', 'comedy', 'thrifting', 'reading', 'creative', 'fun', 'poem', 'sonnet', 'villanelle', 'haiku', 'limerick', 'ballad', 'ode', 'college', 'application', 'timeline', 'tutorial', 'covid', 'pandemic', 'lockdown', 'friendship', 'classroom', 'future', 'self', 'mold', 'america', 'love', 'breakup', 'dissolution', 'senior', 'honors', 'study', 'satellite', 'detection'
    ], 5)
    
    // Bonus for cards with images when query mentions visual content
    if (card.image && (query.includes('photo') || query.includes('image') || query.includes('picture') || query.includes('visual') || query.includes('see') || query.includes('look'))) {
      score += 3
    }
    
    // Small bonus for any card with an image (makes results more visually appealing)
    if (card.image) {
      score += 1
    }
    
    return { ...card, score }
  })
  
  // Sort by score and take top 4
  scoredCards.sort((a, b) => b.score - a.score)
  return scoredCards.slice(0, 4)
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
      temperature: 0.8,
    })

    const response = completion.choices[0].message.content

    // Select the most relevant cards across all sections (max 4)
    const relevantCards = selectAllRelevantCards(searchCards, userInput, response)

    res.status(200).json({
      response,
      originalQuery: userInput,
      suggestedCards: relevantCards
    })

  } catch (error) {
    console.error('OpenAI API error:', error)
    res.status(500).json({ 
      message: 'Error processing request',
      error: error.message 
    })
  }
} 