# Painting Log Web App - Walkthrough

The Painting Log web application has been fully implemented! 

## Technical Overview
- **Framework**: Built with React (TypeScript) and Vite for speed and optimal developer experience.
- **Styling**: Styled entirely with Tailwind CSS (v4 standard imports), omitting standard generic CSS classes for crisp UI tokens and deep dark mode `zinc` aesthetics. 
- **State Management**: A flattened and performant `useState` / `useReducer` combination. Utilizing `useReducer` prevents deep mutation bugs by exposing safe functional updates.
- **Persistence**: Synchronized tightly with `localStorage` so you never lose your painting progress upon refresh or closing.

## Features Developed

1. **Sidebar Navigation & Categories**
   - Clean gradient logos and transparent menus for your Categories.
   - You can add new categories effortlessly, switch between them, and even delete them. Cascade deletes have been handled!

2. **Projects & Progress Insights**
   - Implemented dynamic project creation beneath each category.
   - Each project possesses miniature visual indicators, including a **progress bar** summing up the painted status compared to your total models list!

3. **Models Breakdown**
   - Sleek and minimalistic input toggles explicitly for: Built, Primed, Painted, Based statuses. 
   - A tabular view utilizing custom Tailwind CSS checkboxes (smooth SVGs) combined with editable inline text fields for rapidly updating names or counts.

## How to Run

1. Make sure you are in the directory we built:
   ```bash
   cd /Users/michaelkitchen/dev/react-painting
   ```
2. Start the development server using Vite:
   ```bash
   npm run dev
   ```
3. Open the provided `localhost` domain (typically `http://localhost:5173`) in your browser to experience it for yourself!
