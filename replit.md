# Promptify - AI Prompt Optimization Tool

## Overview

Promptify is a full-stack web application designed to help users optimize their AI prompts through intelligent analysis and suggestions. The application analyzes user-provided prompts, provides optimization recommendations, and offers a library of pre-built templates for various use cases.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **Styling**: Tailwind CSS with shadcn/ui component library
- **Build Tool**: Vite for development and bundling
- **State Management**: TanStack Query for server state management
- **UI Components**: Radix UI primitives with custom styling

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript
- **Database ORM**: Drizzle ORM with PostgreSQL
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **AI Integration**: OpenAI API for prompt analysis and optimization
- **Session Management**: Express sessions with PostgreSQL store

### Database Schema
- **Prompts**: Stores user prompts with optimization data and scoring
- **Suggestions**: Improvement recommendations linked to specific prompts
- **Templates**: Pre-built prompt templates categorized by use case

## Key Components

### Prompt Analysis Engine
- Analyzes prompt content for specificity, clarity, and context
- Provides numerical scoring (0-100) and detailed feedback
- Generates optimized versions of user prompts
- Creates actionable improvement suggestions

### Template System
- Categorized prompt templates (creative, analytical, educational)
- Usage tracking and popularity metrics
- One-click template application to prompt editor

### Suggestion Engine
- Type-based suggestions (specificity, clarity, context)
- Impact assessment (high, medium, low)
- Point-based scoring system for improvements

### User Interface
- **Prompt Editor**: Main editing interface with real-time analysis
- **Suggestions Sidebar**: Interactive improvement recommendations
- **Template Library**: Browsable collection of prompt templates
- **Mobile-responsive**: Optimized for desktop and mobile devices

## Data Flow

1. **Prompt Input**: User enters prompt content in the editor
2. **Analysis Request**: Frontend sends prompt to backend for OpenAI analysis
3. **AI Processing**: Backend uses OpenAI API to analyze and optimize prompt
4. **Data Storage**: Results stored in PostgreSQL via Drizzle ORM
5. **Response Display**: Analysis results and suggestions shown to user
6. **Optimization**: User can apply suggestions or use optimized version

## External Dependencies

### Core Services
- **OpenAI API**: GPT-4o model for prompt analysis and optimization
- **Neon Database**: Serverless PostgreSQL hosting
- **Replit Integration**: Development environment optimization

### Frontend Libraries
- **TanStack Query**: Server state management and caching
- **Radix UI**: Accessible component primitives
- **Tailwind CSS**: Utility-first styling framework
- **Wouter**: Lightweight client-side routing

### Backend Libraries
- **Drizzle ORM**: Type-safe database operations
- **Express.js**: Web server framework
- **OpenAI SDK**: AI service integration

## Deployment Strategy

### Development
- **Local Development**: Vite dev server with HMR
- **Backend**: tsx for TypeScript execution
- **Database**: Drizzle migrations with push command

### Production Build
- **Frontend**: Vite build outputs to `dist/public`
- **Backend**: esbuild bundles server code to `dist/index.js`
- **Database**: PostgreSQL with connection pooling
- **Environment**: Node.js production environment

### Configuration
- **Environment Variables**: DATABASE_URL, OPENAI_API_KEY
- **Build Process**: Separate frontend and backend compilation
- **Static Assets**: Served from build output directory

The application follows a monorepo structure with shared TypeScript schemas and clear separation between client and server code. The architecture prioritizes type safety, developer experience, and scalable data management.