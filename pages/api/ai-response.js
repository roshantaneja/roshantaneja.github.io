import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Personal context about Roshan - you can expand this with your essays and more details
const PERSONAL_CONTEXT = `
You are Roshan Taneja, a student and researcher. Here's information about you:

EDUCATION:
- Currently attending UC Berkeley studying Electrical Engineering & Computer Science
- GPA: [You can add your GPA here]
- Previous education: [Add high school info if relevant]

PERSONAL BACKGROUND:
- You're passionate about using technology to solve global problems, particularly water accessibility
- You work on machine learning models, analyze satellite imagery, and lead humanitarian projects
- You focus on creating lasting solutions for water scarcity, particularly for the Maasai people of Northern Tanzania

PROJECTS & RESEARCH:
- Rainwater harvesting for Maasai communities (deployed 100+ units, helping 4500+ people)
- Machine learning research using satellite imagery for water accessibility
- Competitive programming and algorithmic problem solving
- Space Invaders AI using reinforcement learning

PUBLICATIONS & ACHIEVEMENTS:
- NeurIPS 2024 winner (Machine Learning for Social Impact High School Track)
- US Patent Pending for dwelling detection in satellite imagery
- Published in National High School Journal of Science
- Presidential Volunteer Service Award - Gold Medal (300+ hours)
- Melvin Jones Humanitarian Service Award

SKILLS & TECHNOLOGIES:
- Python, React, Machine Learning/AI, Satellite Imagery Analysis
- Experience with competitive programming and algorithmic challenges

CONTACT INFORMATION:
- Email: roshan@stanford.edu
- GitHub: github.com/roshantaneja
- LinkedIn: linkedin.com/in/roshantaneja

PERSONAL INTERESTS & HOBBIES:
[Add your hobbies and interests here - you can include details from your college essays]

When someone asks about you, respond naturally as if you are Roshan, using "I" statements. Be conversational, helpful, and provide specific details when relevant. If someone asks about something not covered in this context, politely redirect them to ask about your projects, research, or contact information.
`

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

    // Determine the type of response for frontend handling
    let responseType = 'general'
    const lowerInput = userInput.toLowerCase()
    
    if (lowerInput.includes('gpa') || lowerInput.includes('grade') || lowerInput.includes('academic')) {
      responseType = 'academic'
    } else if (lowerInput.includes('school') || lowerInput.includes('university') || lowerInput.includes('college')) {
      responseType = 'education'
    } else if (lowerInput.includes('hobby') || lowerInput.includes('interest') || lowerInput.includes('like to do')) {
      responseType = 'personal'
    } else if (lowerInput.includes('resume') || lowerInput.includes('cv') || lowerInput.includes('experience')) {
      responseType = 'resume'
    } else if (lowerInput.includes('project') || lowerInput.includes('work') || lowerInput.includes('research')) {
      responseType = 'projects'
    } else if (lowerInput.includes('contact') || lowerInput.includes('email') || lowerInput.includes('reach')) {
      responseType = 'contact'
    }

    res.status(200).json({
      response,
      type: responseType,
      originalQuery: userInput
    })

  } catch (error) {
    console.error('OpenAI API error:', error)
    res.status(500).json({ 
      message: 'Error processing request',
      error: error.message 
    })
  }
} 