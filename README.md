# SSUI Skylines

A React-based simple 2D city planning application that allows users to create custom city layouts with buildings, roads, and pathfinding capabilities. It is based on the popular game Cities Skylines, of the same premise

## Project Overview

SSUI Skylines is an interactive canvas application where users can:
- Place various types of buildings (residential, commercial, academic, and service buildings)
- Draw roads that connect different parts of the city
- Calculate shortest paths between buildings using Dijkstra's algorithm
- Create custom city layouts with a visual interface

## Prerequisites

Before running this project, ensure you have the following installed on your system:

- **Node.js** (version 16.x or higher recommended)
- **npm** (comes with Node.js)

To check if you have Node.js and npm installed, run:
```bash
node --version
npm --version
```

If you don't have Node.js installed, download it from [nodejs.org](https://nodejs.org/).

## Installation Instructions

### Step 1: Navigate to the Project Directory

Open your terminal/command prompt and navigate to the project folder:

```bash
cd path/to/final-project
```

### Step 2: Install Dependencies

Install all required dependencies by running:

```bash
npm install
```

This will install all packages listed in `package.json`, including:
- React and React DOM
- TypeScript
- Tailwind CSS
- Lucide React (for icons)
- Testing libraries

### Step 3: Start the Development Server

Once the installation is complete, start the development server:

```bash
npm start
```

This command will:
- Compile the TypeScript code
- Start the React development server
- Automatically open your default browser to `http://localhost:3000`

If the browser doesn't open automatically, manually navigate to `http://localhost:3000` in your web browser.

## Using the Application

### Building Placement

1. **Select a Building Category**: In the left sidebar, click on a building category (Residential, Commercial, Academic, or Services)
2. **Choose a Building Type**: Hover over the category to see available building variants
3. **Place the Building**: Click on the canvas to place the selected building
4. **Collision Detection**: Buildings cannot overlap with existing buildings

### Drawing Roads

1. **Activate Road Tool**: Click the "Road" button in the Tools section
2. **Draw a Road**: Click and drag on the canvas to create a road
3. **Snap to Roads**: When drawing near existing roads, the endpoint will automatically snap to connect
4. **View Distance**: While dragging, the road length is displayed in meters

### Finding Paths

1. **Activate Path Tool**: Click the "Path" button in the Tools section
2. **Select Start Point**: Click on or near a building to set the starting point
3. **Select End Point**: Click on or near another building to calculate the shortest path
4. **View Path**: The shortest path will be highlighted in yellow
5. **Buildings Must Be Near Roads**: Buildings must be within 100 pixels of a road to connect to the path network

### Additional Features

- **Clear Map**: Click the "Clear Map" button to remove all buildings and roads
- **Cancel Current Tool**: Press the `Escape` key to exit the current tool mode
- **View Mode**: Click anywhere in an empty space to return to view mode

## Project Structure

```
final-project/
├── src/
│   ├── components/
│   │   ├── SSUISkylines.tsx    # Main application component
│   │   └── CategoryGroup.tsx    # Building category selector
│   ├── lib/
│   │   ├── types.ts            # TypeScript type definitions
│   │   ├── cityConfig.tsx      # Building catalog configuration
│   │   ├── pathFinding.ts      # Dijkstra's shortest path algorithm
│   │   └── canvasRenderer.ts   # Canvas drawing functions
│   ├── index.tsx               # Application entry point
│   └── index.css               # Global styles
├── package.json                # Project dependencies
├── tsconfig.json              # TypeScript configuration
└── tailwind.config.js         # Tailwind CSS configuration
```

## Customization

### Adding New Buildings

To add custom buildings, edit `src/lib/cityConfig.tsx`:

1. Locate the `BUILDING_CATALOG` object
2. Add a new variant to an existing category or create a new category
3. Specify the building's `id`, `label`, dimensions (`w`, `h`), and `color`

Example:
```typescript
residential: {
  // ... existing code
  variants: [
    // ... existing variants
    { id: 'res_mansion', label: 'Mansion', w: 80, h: 80, color: '#1e40af' }
  ]
}
```

## Available Scripts

In the project directory, you can run:

- **`npm start`**: Runs the app in development mode
- **`npm test`**: Launches the test runner
- **`npm run build`**: Builds the app for production to the `build` folder
- **`npm run eject`**: Ejects from Create React App (one-way operation)

## Troubleshooting

### Port Already in Use

If port 3000 is already in use, you can:
- Stop the process using port 3000
- Or, the app will prompt you to use a different port (usually 3001)

### Installation Errors

If you encounter errors during `npm install`:
1. Delete the `node_modules` folder and `package-lock.json`
2. Run `npm install` again
3. If issues persist, try `npm cache clean --force` before reinstalling

### TypeScript Errors

If you see TypeScript compilation errors:
1. Ensure you're using a compatible Node.js version (16.x or higher)
2. Try deleting the `.cache` folder in `node_modules/.cache`
3. Restart the development server

## Technologies Used

- **React 19.2.0**: UI framework
- **TypeScript 4.9.5**: Type-safe JavaScript
- **Tailwind CSS 3.4.15**: Utility-first CSS framework
- **Lucide React**: Icon library
- **HTML5 Canvas**: For rendering the city layout
- **Dijkstra's Algorithm**: For shortest path calculation

## Browser Compatibility

This application works best in modern browsers:
- Chrome
- Firefox
- Safari
- Edge



---

For questions or issues, please refer to the course materials or contact the instructor.
