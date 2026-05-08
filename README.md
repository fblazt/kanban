# Offline Kanban Board

A high-precision, fully offline Kanban board application built with React 19, TypeScript, and Tailwind CSS. All data is persisted locally in your browser, ensuring your workflow remains private and available even without an internet connection.

## Features

- **Board Management**: Create multiple boards to organize different projects.
- **Dynamic Columns**: Add, rename, and reorder columns (e.g., To Do, In Progress, Done).
- **Rich Card Details**: Assign priorities, labels, and due dates to tasks.
- **Drag & Drop**: Intuitive task reordering and movement between columns using `@dnd-kit`.
- **Full Persistence**: Automatic state saving to `localStorage`.
- **Export/Import**: Backup your boards or move them between devices via JSON files.
- **Precision UI**: A dark-themed, "Precision Workshop" aesthetic designed for focus and productivity.

## Tech Stack

- **Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/) with persistence
- **Drag & Drop**: [@dnd-kit](https://dndkit.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Testing**: [Vitest](https://vitest.dev/) & [Playwright](https://playwright.dev/)

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (Latest LTS recommended)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Development

Start the development server:
```bash
npm run dev
```

### Build

Build the project for production:
```bash
npm run build
```

Preview the production build locally:
```bash
npm run preview
```

## Testing

Run unit and integration tests:
```bash
npm run test
```

Generate test coverage report:
```bash
npm run test:coverage
```

Run end-to-end tests with Playwright:
```bash
npm run test:e2e
```

## License

MIT
