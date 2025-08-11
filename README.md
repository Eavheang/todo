# Todo Application

A modern, full-stack todo application built with Next.js 15, TypeScript, and PostgreSQL. This project features a clean UI with Tailwind CSS and uses Drizzle ORM for database management.

## Features

- ✅ Create, read, update, and delete tasks
- 📅 Date and time scheduling for tasks
- ✔️ Mark tasks as completed
- 🎨 Modern UI with Tailwind CSS and Radix UI components
- 🗄️ PostgreSQL database with Drizzle ORM
- 🔄 Real-time updates
- 📱 Responsive design

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS v4, Radix UI components
- **Database**: PostgreSQL with Drizzle ORM
- **Icons**: Lucide React, React Icons
- **UI Components**: Custom components with class-variance-authority
- **Notifications**: Sonner for toast notifications
- **Date Handling**: date-fns, react-day-picker

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v18 or higher)
- npm, yarn, pnpm, or bun
- PostgreSQL database

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Eavheang/todo.git
   cd todo
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   # or
   bun install
   ```

## Database Setup

1. **Create a PostgreSQL database**
   Create a new PostgreSQL database for your todo application.

2. **Environment Variables**
   Create a `.env.local` file in the root directory and add your database connection string:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/todo_db"
   ```

3. **Run Database Migrations**
   The project uses Drizzle ORM for database management. Apply the existing migration:
   ```bash
   npm run db:migrate
   # or if you have drizzle-kit installed globally
   drizzle-kit migrate
   ```

   The database schema includes a `tasks` table with the following structure:
   - `id` (serial, primary key)
   - `text` (text, required)
   - `date` (date, required)
   - `time` (text, required)
   - `completed` (boolean, default: false)
   - `created_at` (timestamp, default: now())
   - `updated_at` (timestamp, default: now())

## Development

1. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

2. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

3. **Development with Turbopack**
   This project is configured to use Turbopack for faster development builds.

## Project Structure

```
todo/
├── src/
│   ├── app/
│   │   ├── globals.css          # Global styles and CSS variables
│   │   ├── layout.tsx           # Root layout with fonts
│   │   └── page.tsx             # Main page component
│   ├── components/
│   │   └── ui/                  # UI components
│   │       ├── calendar.tsx     # Calendar component
│   │       ├── delete-confirmation-modal.tsx
│   │       └── dialog.tsx       # Dialog component
│   ├── actions/
│   │   └── task.ts              # Server actions for task operations
│   ├── db/
│   │   └── schema.ts            # Database schema definitions
│   └── index.ts                 # Database connection
├── drizzle/
│   ├── meta/
│   │   ├── 0000_snapshot.json   # Database schema snapshot
│   │   └── _journal.json        # Migration history journal
│   └── migrations/              # SQL migration files
├── public/                      # Static assets
├── .env.local                   # Environment variables (create this)
├── drizzle.config.ts           # Drizzle configuration
├── eslint.config.mjs           # ESLint configuration
├── next.config.js              # Next.js configuration
├── package.json                # Dependencies and scripts
├── tailwind.config.js          # Tailwind CSS configuration
├── tsconfig.json               # TypeScript configuration
└── README.md                   # Project documentation
```

### Key Files and Directories

- **src/app/globals.css** - Contains Tailwind CSS imports, custom CSS variables for theming (light/dark mode), and base styles
- **src/components/** - Reusable React components including UI primitives, forms, and custom components
- **src/lib/** - Utility functions, database configuration, and shared logic
- **src/types/** - TypeScript type definitions for the application
- **drizzle/meta/0000_snapshot.json** - Contains the complete database schema definition including the tasks table structure
- **drizzle/meta/_journal.json** - Tracks migration history and metadata
- **eslint.config.mjs** - ESLint configuration using the new flat config format
- **package.json** - Project dependencies including Next.js 15, React 19, Drizzle ORM, Tailwind CSS v4, and other packages

### Database Schema

Based on the migration snapshot, the application includes:

**Tasks Table:**
- `id` (serial, primary key)
- `text` (text, required) - Task description
- `date` (date, required) - Scheduled date
- `time` (text, required) - Scheduled time
- `completed` (boolean, default: false) - Completion status
- `created_at` (timestamp, default: now()) - Creation timestamp
- `updated_at` (timestamp, default: now()) - Last update timestamp

## Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint for code linting

## Database Management

The project uses Drizzle ORM for type-safe database operations. Key files:
- Database schema and migrations are located in the `drizzle/` directory
- Migration metadata is tracked in `drizzle/meta/_journal.json`

## Styling

The application uses:
- **Tailwind CSS v4** for utility-first styling
- **CSS custom properties** for theming (light/dark mode support)
- **Radix UI** components for accessible UI primitives
- **Geist fonts** for typography

## UI Components

The project includes custom UI components with:
- Checkboxes for task completion
- Dialog modals for task management
- Date picker for scheduling
- Toast notifications for user feedback

## Development Guidelines

1. **Code Style**: The project uses ESLint for code linting
2. **TypeScript**: Strict TypeScript configuration for type safety
3. **Database**: Always use Drizzle ORM for database operations
4. **Styling**: Follow Tailwind CSS conventions and use CSS custom properties for theming

## Building for Production

```bash
npm run build
npm run start
```

## Deployment

### Vercel (Recommended)

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

1. Connect your repository to Vercel
2. Add your environment variables in the Vercel dashboard
3. Deploy automatically on every push to main

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more deployment options.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run linting and tests
5. Submit a pull request

## Learn More

To learn more about the technologies used:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API
- [Drizzle ORM](https://orm.drizzle.team/) - TypeScript ORM documentation
- [Tailwind CSS](https://tailwindcss.com/) - utility-first CSS framework
- [Radix UI](https://www.radix-ui.com/) - low-level UI primitives

## License

This project is open source and available under the [MIT License](LICENSE).