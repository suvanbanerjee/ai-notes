# AI Notes

A smart note-taking application powered by AI that helps you create, manage, and summarize your notes using Google's Gemini AI.

## Features

- **AI-powered Summaries**: Automatically generate concise summaries of your notes using Google's Gemini AI
- **Authentication**: Secure user authentication powered by Supabase
- **Responsive Design**: Modern UI built with Next.js, Tailwind CSS, and shadcn/ui components
- **Markdown Support**: Write and view notes in Markdown format

## Technologies Used

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **Authentication**: Supabase Auth
- **Database**: Supabase 
- **AI Integration**: Google Generative AI (Gemini 2.0)
- **State Management**: Zustand, React Query
- **Form Handling**: React Hook Form, Zod

## Prerequisites

Before you begin, ensure you have:

- Node.js (v18 or newer)
- npm or yarn or pnpm or bun
- Supabase account
- Google AI Studio API key (for Gemini)

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Google Generative AI
NEXT_PUBLIC_GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key
```

## Database Setup

Set up the following tables in your Supabase dashboard:

1. **notes** table with columns:
   - id (uuid, primary key)
   - user_id (uuid, foreign key to auth.users)
   - title (text)
   - content (text)
   - summary (text, nullable)
   - created_at (timestamp with timezone)
   - updated_at (timestamp with timezone)

2. Set up appropriate RLS (Row Level Security) policies to ensure users can only access their own notes.

## Getting Started

First, install the dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Project Structure

```
app/                  # Next.js App Router
  auth/               # Authentication routes
  dashboard/          # User dashboard 
  login/              # Login page
  signup/             # Signup page
components/           # Reusable UI components
lib/                  # Shared utilities
  gemini.ts           # Google Generative AI integration
  supabase.ts         # Supabase client
  note-queries.ts     # React Query hooks for notes
```

## Deployment

You can deploy this application to Vercel or any other hosting platform that supports Next.js.

```bash
npm run build
npm start
```

## License

[MIT](https://choosealicense.com/licenses/mit/)
