import { IQuote } from '@/interfaces/IQuote';

export async function fetchRandomQuote(): Promise<IQuote> {
    const res = await fetch("/api/quote");
    if (!res.ok) {
      console.error("Bad response from quotes API:", res.status, await res.text());
    throw new Error("External API error"); 
    }
    
    const data = await res.json();
    return {
      content: data.content,
      author: data.author,
    };
  }