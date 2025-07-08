# AI Integration Setup Guide

## Overview
This website now includes AI-powered responses using OpenAI's GPT model. The AI is trained on Roshan's personal information and can handle queries like "GPA", "School Attending", "Hobbies", etc.

## Setup Instructions

### 1. Get OpenAI API Key
1. Go to [OpenAI Platform](https://platform.openai.com/api-keys)
2. Create an account or sign in
3. Generate a new API key
4. Copy the API key

### 2. Set Environment Variable
Create a `.env.local` file in the root directory with:
```
OPENAI_API_KEY=your_actual_api_key_here
```

### 3. Personalize the AI
Edit `pages/api/ai-response.js` and update the `PERSONAL_CONTEXT` variable with:
- Your actual GPA
- Your hobbies and interests (from your college essays)
- Any additional personal information you want the AI to know

### 4. Deploy to Vercel
1. Add the environment variable in your Vercel dashboard
2. Deploy the development branch
3. The AI will be available at your deployment URL

## Features

### What the AI Can Handle:
- **Academic Questions**: "What's your GPA?", "What school do you attend?"
- **Personal Questions**: "What are your hobbies?", "What do you like to do?"
- **Professional Questions**: "Tell me about your projects", "Show me your resume"
- **Contact Information**: "How can I reach you?", "What's your email?"

### How It Works:
1. User types a question
2. Question is sent to OpenAI API with your personal context
3. AI generates a personalized response
4. Response is displayed with appropriate styling

## Customization

### Adding More Personal Information:
1. Edit the `PERSONAL_CONTEXT` in `pages/api/ai-response.js`
2. Add your college essays, personal stories, achievements
3. Include specific details about your interests, goals, experiences

### Adding New Response Types:
1. Update the intent detection in the API
2. Add new content types in the frontend
3. Add corresponding CSS styles

## Cost Considerations
- OpenAI API charges per token used
- GPT-3.5-turbo is cost-effective (~$0.002 per 1K tokens)
- Monitor usage in OpenAI dashboard
- Consider rate limiting for production use

## Troubleshooting
- Check browser console for API errors
- Verify environment variable is set correctly
- Ensure API key has sufficient credits
- Check Vercel function logs for server-side errors 