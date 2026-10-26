# Pile of Potential UI Overhaul

The application has been transformed to match the **Pile of Potential** interface.

## Visual & Functional Features

1. **Top Navigation Bar**
   - **Menu**: Accessible hamburger dropdown menu with actions including _Reset to Demo Data_, _Export Data (JSON)_, and _Import Data (JSON)_.
   - **Branding**: Bespoke tabletop wargaming **Pile of Potential** logo.
   - **User Profile**: User handle (``) with avatar badge.

2. **Dashboard Header & Real-Time Stats**
   - **Title & Quick Share**: Heavy condensed title (`EDIT MY PILE OF POTENTIAL`), ``user tag,`VIEW`public preview button, and copyable`QUICK SHARE` link.
   - **Stat Metric Cards**:
     - **TOTAL POINTS**: Total points across models in project.
     - **TOTAL MODELS**: Sum of all miniature counts (154 in default dataset).
     - **POINTS COMPLETE**: Split indicator showing completed points percentage and count.
     - **MODELS COMPLETE**: Split indicator calculating complete models count (20) and exact percentage (**12.99%**).

3. **Projects & Categories Management (Left Column)**
   - **Collapsible Panels**: Smooth toggle for `PROJECTS` and `PROJECT SETTINGS`.
   - **Actions**: `ADD PROJECT` and `ADD CATEGORY` buttons.
   - **Expandable Green Category Pills**:
     - Forest-green category bars with visibility toggle (`👁`), expand/collapse indicator (`▲`/`▼`), edit pencil (`📝`), and delete button (`🗑️`).
     - Clicking a category expands it to reveal its nested projects:
       - `:: 👁 Adeptus Mechanicus`
       - `:: 👁 Adepta Sororitas`
       - `:: 👁 Astra Militarum`
       - `:: 👁 Blood Angels`
       - `:: 👁 Dark Angels`
       - `:: 👁 Dark Angels Vehicles`
       - `:: 👁 Space Wolves` (**Selected / Active Project**, highlighted in bold white)
       - `:: 👁 Space Wolves Firstborn`
       - `:: 👁 Ultramarines`
     - Selecting any project instantly switches the main table, stats, and settings to that project.
   - **Uncategorised Group**: Maroon category banner housing unallocated miniature projects (`Unallocated`, `Unallocated Primaris`).
   - **Project Settings**:
     - Inline project name editing (`Space Wolves`).
     - Project visibility toggle (`PUBLIC` / `PRIVATE`).
     - Customizable project columns and stages.

<<<<<<< HEAD
4. **Units & Painting Stages Table (Right Column)**
   - **Interactive Drag & Drop Reordering**:
     - Grab any unit using the **six dots** handle on the left with left-click and hold.
     - Move the cursor up or down: an illuminated **teal landing indicator line** with pin markers shows dynamically where the row will insert (either above or below the target row).
     - A floating preview pill displays the unit name and model count tracking alongside the cursor.
     - The row currently being dragged is highlighted with dashed teal borders and reduced opacity.
     - Releasing the mouse button drops the unit in the exact chosen location and updates `localStorage`.
   - **Stage Icons**: 4 circular badges representing the core miniature painting workflow:
     1. Assembly / Built (`BuiltIcon`)
     2. Spray Primer / Undercoat (`PrimedIcon`)
     3. Basecoat / Paint (`PaintedIcon`)
     4. Scenic Base / Finish (`BasedIcon`)
   - **Quick Add Row**: Inline input for new unit names, count, initial stage selection, and `Add Unit` button.
   - **Dynamic Row Highlighting**:
     - Units with 100% completed stages turn soft sage-green.
     - Units in-progress maintain neutral stone-grey.
   - **Stage Cell Status**:
     - Completed stages display in lush green with custom blue checkboxes.
     - Incomplete stages display in dusty rose with white checkboxes.
   - **Inline Editing & Management**:
     - Unit names and model counts are editable directly in the row.
     - Red trash can buttons for deletion.
=======
3. **Models Breakdown**
   - Sleek and minimalistic input toggles explicitly for: Built, Primed, Painted, Based statuses. 
   - A tabular view utilizing custom Tailwind CSS checkboxes (smooth SVGs) combined with editable inline text fields for rapidly updating names or counts.

## How to Run

1. Make sure you are in the directory we built:
   ```bash
   cd react-painting
   npm install
   ```
2. Start the development server using Vite:
   ```bash
   npm run dev
   ```
3. Open the provided `localhost` domain (typically `http://localhost:5173`) in your browser to experience it for yourself!
>>>>>>> 0a25e5c4ef1959c5c87c0e0a598d475a25208035
