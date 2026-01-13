import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

// Server Setup
const app = express();
const PORT = 3000;

// Body Parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes
app.get('/', (req: Request, res: Response) => {
  return res
    .status(200)
    .sendFile(path.resolve(import.meta.dirname, '../index.html'));
});

// OpenRouter Route

app.post('/api/suggestion', async (req: Request, res: Response) => {
  const { title, text } = req.body;

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "model": "meta-llama/llama-3.2-3b-instruct:free",
        "messages": [
          {
            "role": "system",
            "content": `You are a professional literary editor. You must follow this output format strictly:

          Improved text
          [Provide the reworked text. You MUST add EXACTLY 3 new sentences beyond what the user provided to expand the story.]

          Reasoning:
          [Provide a concise explanation of your changes.]

          Do not include any greetings, intros, outros, or conversational niceties. Provide only these two sections.`
            },
            {
              "role": "user",
              "content": `Title: ${title}\nText: ${text}`
            }
          ]
        })
    })  

    const data: any = await response.json();

    if (data.error) {
      console.log("--OPENROUTER ERROR DETAILS---");
      console.log(data.error);
      return res.status(500).json({ err: data.error.message || "AI ERROR"})
    }

    // Check
    if (data.choices && data.choices[0]) {
      const suggestion = data.choices[0].message.content;
      return res.status(200).json({ suggestion });
    } else {
      throw new Error('Invalid response from AI provider');
    }

  } catch (error) {
    console.error("AI Route Error:", error);
    return res.status(500).json({ err: "Please try again later."})
  }
})

// 404 error handler
app.use((req: Request, res: Response) => {
  return res.status(404).send('Page not found.');
});

// global error handler 500
interface Error {
  log: string;
  status: number;
  message: { err: string };
}

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  const defaultErr = {
    log: 'Express error handler caught unknown middleware error',
    status: 500,
    message: { err: 'An error occurred' },
  };
  const errorObj = Object.assign({}, defaultErr, err);
  console.error(errorObj.log);
  return res.status(errorObj.status).json(errorObj.message);
});

// Initialization
app.listen(PORT, () => {
  console.log(`Project server, listening on: http://localhost:${PORT}`);
});
