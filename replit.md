# AI Governance Platform - Groovy Security

## Overview

This is a full-stack React application for an AI governance platform called "Groovy Security." The application is built with a modern tech stack including Express.js backend, React frontend with TypeScript, and PostgreSQL database using Drizzle ORM. It serves as a marketing website and lead capture system for an enterprise AI governance platform.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui component library
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query for server state management
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Runtime**: Node.js with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Session Management**: Express sessions with PostgreSQL store
- **API**: RESTful API endpoints

### Database Architecture
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Migration**: Drizzle Kit for schema migrations
- **Connection**: Neon serverless driver for PostgreSQL

## Key Components

### Frontend Components
- **Marketing Pages**: Landing page with hero section, platform overview, features, and integrations
- **Lead Capture**: Form component for capturing potential customer information
- **UI Components**: Comprehensive set of reusable components from shadcn/ui
- **Navigation**: Responsive navigation with smooth scrolling to sections

### Backend Components
- **API Routes**: Lead capture endpoints (`/api/leads`)
- **Storage Layer**: Abstract storage interface with PostgreSQL database implementation
- **Database Connection**: Neon serverless PostgreSQL with Drizzle ORM
- **Request Logging**: Comprehensive logging middleware for API requests
- **Error Handling**: Centralized error handling middleware

### Database Schema
- **Leads Table**: Stores lead information including contact details, company info, and AI usage preferences
- **Users Table**: Basic user authentication schema (currently unused)

## Data Flow

1. **Lead Capture Flow**:
   - User fills out lead form on frontend
   - Form data is validated using Zod schemas
   - POST request sent to `/api/leads` endpoint
   - Server validates data and stores in database
   - Success/error response returned to frontend
   - Toast notification shown to user

2. **Admin Data Access**:
   - GET request to `/api/leads` returns all captured leads
   - Data can be used for admin dashboard or CRM integration

## External Dependencies

### Frontend Dependencies
- **UI Framework**: Radix UI primitives with shadcn/ui components
- **Icons**: Lucide React icons
- **Forms**: React Hook Form with Zod validation
- **Date Handling**: date-fns for date formatting
- **Carousels**: Embla Carousel for interactive components

### Backend Dependencies
- **Database**: @neondatabase/serverless for PostgreSQL connection
- **ORM**: Drizzle ORM with Zod integration
- **Session Store**: connect-pg-simple for PostgreSQL-backed sessions
- **Development**: tsx for TypeScript execution

### Build Dependencies
- **Bundler**: Vite for frontend, esbuild for backend
- **CSS**: Tailwind CSS with PostCSS
- **TypeScript**: Full TypeScript support across the stack

## Deployment Strategy

### Build Process
- **Frontend**: Vite builds React app to `dist/public`
- **Backend**: esbuild bundles server code to `dist/index.js`
- **Database**: Drizzle migrations run via `db:push` command

### Environment Configuration
- **Development**: Uses tsx for hot reloading server
- **Production**: Runs compiled JavaScript with NODE_ENV=production
- **Database**: Requires DATABASE_URL environment variable

### Replit Integration
- **Development Banner**: Replit development banner for external access
- **Runtime Error Overlay**: Replit error modal for development
- **Cartographer**: Replit's code mapping tool for development

The application follows a monorepo structure with shared types and schemas, making it easy to maintain consistency between frontend and backend. The storage layer is abstracted to allow for easy switching between in-memory and database implementations.