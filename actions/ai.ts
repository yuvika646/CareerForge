'use server'

import Groq from 'groq-sdk'

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY!,
})

// Retry helper with exponential backoff
async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 2000
): Promise<T> {
  let lastError: Error | null = null
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error: any) {
      lastError = error
      
      // Check if it's a rate limit error (429)
      if (error?.status === 429 && attempt < maxRetries - 1) {
        const delay = baseDelay * Math.pow(2, attempt) // Exponential backoff
        console.log(`Rate limited. Retrying in ${delay}ms... (attempt ${attempt + 1}/${maxRetries})`)
        await new Promise(resolve => setTimeout(resolve, delay))
        continue
      }
      
      throw error
    }
  }
  
  throw lastError
}

export async function enhanceDescription(text: string, type: 'experience' | 'summary' | 'project' = 'experience') {
  if (!text.trim()) {
    return { error: 'Please provide some text to enhance' }
  }

  try {
    const prompts: Record<string, string> = {
      experience: `You are an expert resume writer. Enhance the following job experience description to be more impactful, professional, and ATS-friendly. Use strong action verbs, quantify achievements where possible, and keep it concise. Only return the enhanced description without any explanation or additional text.

Original description:
${text}

Enhanced description:`,
      summary: `You are an expert resume writer. Rewrite the following professional summary to be compelling, concise (2-3 sentences), and highlight key strengths. Make it ATS-friendly. Only return the enhanced summary without any explanation or additional text.

Original summary:
${text}

Enhanced summary:`,
      project: `You are an expert resume writer. Enhance the following project description to highlight technical skills, impact, and achievements. Keep it concise and professional. Only return the enhanced description without any explanation or additional text.

Original description:
${text}

Enhanced description:`,
    }

    const completion = await withRetry(() => 
      groq.chat.completions.create({
        messages: [{ role: 'user', content: prompts[type] }],
        model: 'llama-3.3-70b-versatile',
        temperature: 0.7,
        max_tokens: 1024,
      })
    )
    
    const enhancedText = completion.choices[0]?.message?.content?.trim() || ''

    return { data: enhancedText }
  } catch (error: any) {
    console.error('Groq API error:', error)
    if (error?.status === 429) {
      return { error: 'AI service is currently busy. Please wait a moment and try again.' }
    }
    return { error: 'Failed to enhance text. Please try again.' }
  }
}

export async function generateSkillSuggestions(jobTitle: string, currentSkills: string[]) {
  if (!jobTitle.trim()) {
    return { error: 'Please provide a job title' }
  }

  try {
    const prompt = `Based on the job title "${jobTitle}", suggest 10 relevant technical and soft skills that would be valuable for this role. The person already has these skills: ${currentSkills.join(', ') || 'none listed'}. 

Return ONLY a JSON array of skill strings, no explanation. Example format:
["Skill 1", "Skill 2", "Skill 3"]`

    const completion = await withRetry(() =>
      groq.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: 'llama-3.3-70b-versatile',
        temperature: 0.7,
        max_tokens: 1024,
      })
    )
    
    const text = completion.choices[0]?.message?.content?.trim() || ''
    
    // Parse JSON response
    const jsonMatch = text.match(/\[[\s\S]*\]/)
    if (jsonMatch) {
      const suggestions = JSON.parse(jsonMatch[0]) as string[]
      // Filter out skills the user already has
      const newSuggestions = suggestions.filter(
        skill => !currentSkills.some(s => s.toLowerCase() === skill.toLowerCase())
      )
      return { data: newSuggestions }
    }

    return { error: 'Failed to parse skill suggestions' }
  } catch (error: any) {
    console.error('Groq API error:', error)
    if (error?.status === 429) {
      return { error: 'AI service is currently busy. Please wait a moment and try again.' }
    }
    return { error: 'Failed to generate skill suggestions. Please try again.' }
  }
}

export async function analyzeJobMatch(userSkills: string[], jobDescription: string, jobTitle: string) {
  if (!jobDescription.trim()) {
    return { error: 'Please provide a job description' }
  }

  try {
    const prompt = `Analyze how well a candidate matches this job:

Job Title: ${jobTitle}
Job Description: ${jobDescription}

Candidate's Skills: ${userSkills.join(', ') || 'None listed'}

Provide a brief analysis in JSON format:
{
  "matchScore": <number 0-100>,
  "matchedSkills": ["skill1", "skill2"],
  "missingSkills": ["skill1", "skill2"],
  "recommendation": "brief 1-2 sentence recommendation"
}

Return ONLY the JSON, no explanation.`

    const completion = await withRetry(() =>
      groq.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: 'llama-3.3-70b-versatile',
        temperature: 0.7,
        max_tokens: 1024,
      })
    )
    
    const text = completion.choices[0]?.message?.content?.trim() || ''
    
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      const analysis = JSON.parse(jsonMatch[0])
      return { data: analysis }
    }

    return { error: 'Failed to analyze job match' }
  } catch (error: any) {
    console.error('Groq API error:', error)
    if (error?.status === 429) {
      return { error: 'AI service is currently busy. Please wait a moment and try again.' }
    }
    return { error: 'Failed to analyze job match. Please try again.' }
  }
}
