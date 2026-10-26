# Pile of Potential UI Overhaul

A tabletop miniature painting tracker: projects held in categories, with each unit
tracked through configurable painting stages.

## Visual & Functional Features

1. **Top Navigation Bar**
   - **Menu**: hamburger dropdown with two actions — _Export Backup (JSON)_ and
     _Import Data (JSON)_. The import is validated on load and replaces the whole
     state; the export downloads the current state as a dated JSON file.
   - **Branding**: the bespoke tabletop wargaming **Pile of Potential** mark with
     the `PAINTING LOG` title.

2. **Project Stats, In The Unit Table Header**
   - The stats are not a separate bar: they sit on the table header row, to the
     right of `UNIT NAME`, so they scroll and resize with the table itself.
   - **TOTAL**: total models across every unit in the active project (154 in the
     default dataset). The value occupies the model count column, so it reads as
     that column's total above the per-unit counts.
   - **DONE**: a split indicator, percentage complete in teal and the completed
     model count in dark. A unit counts as complete only when every one of the
     project's stage columns is ticked (20 of 154, i.e. 13%, in the default
     dataset).

3. **Projects & Categories Management (Left Column)**
   - **Collapsible Panels**: smooth toggle for `PROJECTS` and `PROJECT SETTINGS`.
   - **Actions**: `ADD PROJECT` and `ADD CATEGORY` buttons, each revealing an
     inline name field.
   - **Expandable Green Category Pills**:
     - Forest-green bars with a visibility toggle (`👁`), expand/collapse
       indicator (`▲`/`▼`), edit pencil, and delete button.
     - Clicking a category reveals its projects, each shown with a grip and an
       eye icon; the active project is bold white. A trash button appears on
       hover and asks for confirmation.
     - Deleting a category cascades to its projects and their units.
   - **Uncategorised Group**: a maroon banner holding unallocated projects.
   - **Project Settings**: inline project name editing. Stages are stored per
     project, so different projects can carry different workflows; unit rows keep
     a tick per column.

4. **Units & Painting Stages Table (Right Column)**
   - **Interactive Drag & Drop Reordering**:
     - Grab any unit by the **six dots** handle with left-click and hold.
     - An illuminated teal landing line with pin markers shows where the row will
       insert, above or below the hovered row.
     - A floating pill follows the cursor with the unit name and model count, and
       the dragged row dims with dashed teal borders.
     - Releasing drops the unit in place and the new order is saved.
   - **Stage Icons**: circular badges for the default four-stage workflow — Built,
     Primed, Painted, Based. These use custom artwork (white marks on transparent
     backgrounds, in `src/assets`), sized with `object-contain` so the taller
     source images are not squashed. Icons are fixed images rather than
     `currentColor` SVGs, so they do not recolour.
   - **Quick Add Row**: inline name field, count, initial stage checkboxes, and an
     `Add Unit` button. New units are inserted at the top of the list.
   - **Dynamic Row Highlighting**: units fully through every stage turn soft
     sage-green; in-progress units stay neutral stone-grey.
   - **Stage Cell Status**: completed stages show lush green with custom blue
     checkboxes; incomplete stages show dusty rose with white checkboxes. Clicking
     a cell toggles that stage for that unit.
   - **Inline Editing & Management**: unit names and model counts are editable in
     the row, and a red trash button deletes a unit.

## Persistence

State is saved to `localStorage` under `pile-of-potential-state-v4` on every
change and restored on load, so a refresh keeps your work. The seed dataset is
only used on a first run with empty storage. There is no in-app reset: to start
over, clear that key in the browser devtools, or import a backup file.

## How to Run

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
3. Open `http://localhost:5173` (Vite's default port).

## Checks

```bash
npm run build   # tsc -b first, then the Vite bundle
npm run lint    # eslint
npm test        # vitest, including type-level tests
```

`npm test` also type-checks `src/types/state.test-d.ts`, which pins the `AppState`
and `Unit` field lists, so a required field missing from the seed data fails the
tests rather than only the build.
