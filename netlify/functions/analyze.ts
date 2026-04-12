import { Handler } from '@netlify/functions';
import * as cheerio from 'cheerio';
import Groq from 'groq-sdk';

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { websiteUrl } = JSON.parse(event.body || '{}');

    if (!websiteUrl) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Website URL is required' }),
      };
    }

    const groqApiKey = process.env.GROQ_API_KEY;
    if (!groqApiKey) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'GROQ_API_KEY environment variable is missing' }),
      };
    }

    // 1. Scrape the website
    let html = '';
    const urlToFetch = websiteUrl.startsWith('http') ? websiteUrl : `https://${websiteUrl}`;
    
    try {
      const response = await fetch(urlToFetch, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9',
        },
      });

      if (!response.ok) {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: `Website returned status ${response.status}. It might be protected against scraping.` }),
        };
      }
      html = await response.text();
    } catch (fetchError: any) {
      console.error('Fetch error:', fetchError);
      return {
        statusCode: 400,
        body: JSON.stringify({ error: `Could not reach website: ${websiteUrl}. Make sure the URL is valid.` }),
      };
    }

    // Extract text from important tags
    const $ = cheerio.load(html);
    const h1s = $('h1').map((_, el) => $(el).text()).get().join(' ');
    const metaDesc = $('meta[name="description"]').attr('content') || '';
    const paragraphs = $('p').map((_, el) => $(el).text()).get().slice(0, 5).join(' ');

    const scrapedContent = `
      H1s: ${h1s}
      Meta Description: ${metaDesc}
      Content: ${paragraphs}
    `;

    // 2. Brutal Audit using Groq Llama
    const groq = new Groq({ apiKey: groqApiKey });
    const companyName = websiteUrl.replace(/^https?:\/\//, '').split('/')[0];
    
    const prompt = `
      You are the Lead Systems Architect and Senior Full-Stack Developer for Solarsis, an AI-first digital agency.
      Analyze the following website content for a company named "${companyName}".
      
      Find 3 specific "Revenue Bottlenecks" based on their website copy and structure.
      Also, estimate their monthly lost revenue based on their industry and size.
      
      Tone: Brutally honest, high-end, conversion-focused. Make the leaks highly specific and actionable.
      
      Website Content:
      ${scrapedContent}
      
      You MUST output your response in JSON format matching this exact schema:
      {
        "industry": "Guessed industry of the company (e.g., 'Real Estate', 'SaaS', 'Ecommerce')",
        "estimatedLostRevenue": 14000,
        "leaks": [
          {
            "title": "Short title of the leak, including the specific issue and revenue impact",
            "fix": "Description of how Solarsis fixes it"
          }
        ]
      }
      Ensure there are exactly 3 leaks.
    `;

    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.3-70b-versatile',
      response_format: { type: 'json_object' },
    });

    const auditData = JSON.parse(chatCompletion.choices[0]?.message?.content || '{}');

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ audit: auditData }),
    };

  } catch (error: any) {
    console.error('Analysis error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message || 'Failed to analyze website' }),
    };
  }
};
