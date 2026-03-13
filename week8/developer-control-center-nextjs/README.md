# Developer Control Center - Next.js + Prisma + SQLite

A modern, full-stack web application for managing notes and action items with a beautiful dark-mode UI.

## Tech Stack

- **Frontend**: React 18, Next.js 14, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: SQLite with Prisma ORM
- **Language**: TypeScript

## Features

- ✅ Create, read, update, and delete notes (with title and content)
- ✅ Create, read, update, and delete action items (with description and completion status)
- ✅ Checkbox-based completion toggle for action items
- ✅ Real-time UI updates
- ✅ Input validation (no empty fields)
- ✅ Responsive dark-mode design
- ✅ Persistent storage with SQLite

## Prerequisites

- Node.js 18+ (with npm or yarn)
- npm or yarn package manager

## Installation

1. Navigate to the project directory:
```bash
cd developer-control-center-nextjs
```

2. Install dependencies:
```bash
npm install
```

## Environment Configuration

Create a `.env.local` file with the following content (already provided):

```env
DATABASE_URL="file:./dev.db"
```

## Setup and Running

### Development Mode

1. Initialize the database and start the dev server:
```bash
npm run dev
```

This will:
- Run Prisma migrations to create/update the SQLite database
- Start the Next.js development server on `http://localhost:3000`

2. Open your browser and navigate to `http://localhost:3000`

### Production Mode

1. Build the application:
```bash
npm run build
```

2. Start the production server:
```bash
npm start
```

## Scripts

- `npm run dev` - Start development server with DB setup
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run db:push` - Apply Prisma migrations to SQLite
- `npm run db:seed` - Seed the database (if seed script is added)
- `npm run db:reset` - Reset the entire database

## Project Structure

```
developer-control-center-nextjs/
├── src/
│   ├── app/               # Next.js app directory
│   │   ├── layout.tsx     # Root layout component
│   │   ├── page.tsx       # Home page
│   │   └── globals.css    # Tailwind CSS imports
│   ├── components/        # React components
│   │   ├── Button.tsx
│   │   ├── NoteCard.tsx
│   │   ├── ActionItemCard.tsx
│   │   ├── NotesSection.tsx
│   │   └── ActionItemsSection.tsx
│   ├── lib/
│   │   └── prisma.ts      # Prisma client singleton
│   └── pages/
│       └── api/           # API routes
│           ├── notes/
│           │   ├── index.ts    # GET/POST notes
│           │   └── [id].ts     # GET/PUT/DELETE specific note
│           └── action-items/
│               ├── index.ts    # GET/POST action items
│               └── [id].ts     # GET/PUT/DELETE specific item
├── prisma/
│   └── schema.prisma      # Database schema
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── postcss.config.js
```

## API Endpoints

### Notes
- `GET /api/notes` - Get all notes
- `POST /api/notes` - Create a new note
- `GET /api/notes/[id]` - Get a specific note
- `PUT /api/notes/[id]` - Update a note
- `DELETE /api/notes/[id]` - Delete a note

### Action Items
- `GET /api/action-items` - Get all action items
- `POST /api/action-items` - Create a new action item
- `GET /api/action-items/[id]` - Get a specific action item
- `PUT /api/action-items/[id]` - Update an action item
- `DELETE /api/action-items/[id]` - Delete an action item

## Usage

### Creating a Note
1. Click the "+ New Note" button
2. Enter a title and content
3. Click "Create Note"
4. The note will appear in the grid below

### Creating an Action Item
1. Click the "+ New Task" button
2. Enter a description
3. Click "Create Action Item"
4. The action item will appear in the grid below

### Editing
1. Click "Edit" on any card
2. Modify the content
3. Click "Save" to update

### Deleting
1. Click "Delete" on any card
2. Confirm the deletion in the popup

### Completing Action Items
1. Click the checkbox next to an action item to mark it as complete
2. Completed items will be visually distinguished with strikethrough text

## Validation

All inputs are validated:
- **Title (Notes)**: Required and cannot be empty
- **Content (Notes)**: Required and cannot be empty
- **Description (Action Items)**: Required and cannot be empty

Empty submissions will display an error message.

## Data Persistence

All data is stored in a SQLite database (`dev.db`) in the project root. The database persists across server restarts and deployments.

## Known Issues & Notes

- The database file (`dev.db`) must be in a writable directory
- On Windows, ensure file permissions allow read/write access
- SQLite is suitable for single-server deployments; for multi-instance deployments, migrate to PostgreSQL

## Troubleshooting

### Port 3000 already in use
```bash
npm run dev -- -p 3001
```

### Database errors
Reset the database:
```bash
npm run db:reset
```

### Dependencies not installing
Clear npm cache and reinstall:
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

## Performance

- Notes and action items are loaded on component mount
- Dark mode is applied by default
- Responsive grid layout (1 column on mobile, 2 columns on larger screens)
- Optimized API calls with proper error handling

## Future Enhancements

- Search functionality
- Filter by completion status
- Sorting options (by date, alphabetically)
- Tags for notes
- Due dates for action items
- User authentication
- Export to PDF/CSV
