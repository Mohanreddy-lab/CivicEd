/**
 * Google Gemini AI Service for CivicEd
 * 
 * This module integrates Google's Generative AI (Gemini) API
 * to provide real-time, AI-powered civic education responses.
 * 
 * Google Service: Google Generative AI (Gemini 2.0 Flash)
 * Documentation: https://ai.google.dev/gemini-api/docs
 */
import { GoogleGenerativeAI } from '@google/generative-ai';

// System prompt enforcing neutrality, safety, and educational focus
const SYSTEM_PROMPT = `You are CivicEd AI, a neutral civic education assistant.

PURPOSE: Help people understand election processes, voter rights, and civic information using SIMPLE ENGLISH and REAL-WORLD data.

CORE RULES:
• Educate only — never influence voting
• Use simple words (8th-grade English)
• Prefer latest available data
• Always mention date/time for current info
• Never guess or make up data
• Be respectful and unbiased

SAFETY:
• Do not promote parties or candidates
• Do not tell users how to vote
• If asked for opinions, refuse politely and explain facts instead

RESPONSE FORMAT:
• Short sentences, clear steps, bullet points
• Include one real-life example when possible
• End with a helpful follow-up suggestion

REAL-TIME DATA RULES:
• If data cannot be fetched, say so clearly
• Mention when the data was last updated
• Never invent numbers, dates, or events`;

/**
 * Initialize the Google Generative AI client.
 * Uses Gemini 2.0 Flash for fast, cost-effective responses.
 * 
 * @param {string} apiKey - Google AI API key
 * @returns {Object} - Gemini model instance
 */
export function initGemini(apiKey) {
  if (!apiKey) {
    console.warn('[CivicEd] No Gemini API key provided. Using offline mode.');
    return null;
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash',
      systemInstruction: SYSTEM_PROMPT,
      generationConfig: {
        temperature: 0.3, // Low temperature for factual, consistent responses
        topP: 0.8,
        topK: 40,
        maxOutputTokens: 512,
      },
      safetySettings: [
        { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_LOW_AND_ABOVE' },
        { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_LOW_AND_ABOVE' },
        { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_LOW_AND_ABOVE' },
      ],
    });
    console.log('[CivicEd] Google Gemini AI initialized successfully.');
    return model;
  } catch (error) {
    console.error('[CivicEd] Failed to initialize Gemini:', error.message);
    return null;
  }
}

/**
 * Send a civic education query to Google Gemini AI.
 * Falls back to offline mode if Gemini is unavailable.
 * 
 * @param {Object} model - Gemini model instance
 * @param {string} userQuery - The user's question
 * @returns {Promise<string>} - AI-generated response (HTML formatted)
 */
export async function askGemini(model, userQuery) {
  if (!model) {
    return null; // Signal to use offline fallback
  }

  try {
    const result = await model.generateContent(userQuery);
    const response = result.response;
    const text = response.text();

    // Convert markdown-style formatting to HTML for display
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br>')
      .replace(/• /g, '• ');
  } catch (error) {
    console.error('[CivicEd] Gemini API error:', error.message);
    return null; // Fall back to offline
  }
}

/**
 * Export the system prompt for UI transparency panel.
 */
export const CIVICED_SYSTEM_PROMPT = SYSTEM_PROMPT;
