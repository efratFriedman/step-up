import { IQuote } from '@/interfaces/IQuote';

export async function fetchRandomQuote(): Promise<IQuote> {
    const res = await fetch("/api/quote");
    if (!res.ok) {
      throw new Error("Failed to fetch quote");
    }
    const data = await res.json();
    return {
      content: data.content,
      author: data.author,
    };
  }