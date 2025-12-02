SSUI Skylines

SSUI Skylines is an interactive city planning simulation built with React and TypeScript. This application allows users to design a city layout by placing various types of buildings, drawing road networks, and calculating the shortest paths between locations using Dijkstra's algorithm. The visualization is handled via the HTML5 Canvas API for high-performance rendering.

🚀 Features

Building Placement: Select from multiple categories (Residential, Commercial, Academic, Services) and place specific building variants on the map.

Road Construction: Intuitive drag-and-drop road creation with automatic snapping to existing road endpoints for seamless connections.

Pathfinding Visualization: A "Path" tool that calculates and visualizes the shortest route between two points on your road network using Dijkstra's algorithm.

Dynamic Rendering: Real-time canvas rendering for smooth interaction.

Modern UI: Clean sidebar interface built with Tailwind CSS and Lucide icons.

📋 Prerequisites

Before you begin, ensure you have the following installed on your machine:

Node.js: (Version 14.0.0 or higher recommended)

npm: (Usually comes installed with Node.js)

🛠 Installation & Setup

Follow these steps to get the project running locally:

Unzip/Clone the Project
Navigate to the project directory in your terminal:

cd final-project


Install Dependencies
Run the following command to install all required libraries (React, TypeScript, Tailwind, etc.) listed in package.json:

npm install


Run the Application
Start the development server:

npm start


View in Browser
The application should automatically open in your default browser. If not, navigate to:

http://localhost:3000


🎮 How to Use

The application interface is divided into a sidebar (left) and the map canvas (right).

1. Placing Buildings

Hover over a category in the Buildings section of the sidebar (e.g., Residential, Commercial).

A menu will expand showing specific building variants (e.g., Cottage, Apartment, Hospital).

Click on a building variant.

Move your mouse to the canvas (a ghost image of the building will follow your cursor).

Click to place the building.

2. Drawing Roads

Click the Road button in the Tools section.

Click and hold (drag) on the canvas to start drawing a road segment.

Release the mouse button to finish the segment.

Tip: The tool automatically snaps to the ends of existing roads (indicated by a blue circle) to help you connect segments.

Tip: A distance label is displayed while drawing to show the length of the road segment.

3. Finding Paths

Click the Path button in the Tools section.

Click once near a building or road to set the Start Point (marked by a red pin).

Click a second time at a different location to set the End Point.

The application will calculate and highlight the shortest path in yellow.

Note: Buildings must be close enough to a road (approx. 100px) to effectively "connect" to the road network.

4. General Controls

Clear Map: Click the "Clear Map" button in the sidebar to remove all buildings and roads.

Escape Key: Press Esc on your keyboard to cancel the current tool (stop placing a building or cancel a road/path action).

🏗 Project Structure

src/components/SSUISkylines.tsx: The main application component containing the UI logic and state management.

src/lib/cityConfig.tsx: Configuration file defining available buildings, their dimensions, and colors.

src/lib/canvasRenderer.ts: Contains functions responsible for drawing roads, buildings, and guides on the HTML5 Canvas.

src/lib/pathFinding.ts: Implementation of Dijkstra's algorithm for calculating shortest paths on the road graph.

src/lib/types.ts: TypeScript interfaces defining the shape of data (Points, Buildings, Roads, etc.).

🔧 Technologies Used

React 19

TypeScript

Tailwind CSS (Styling)

Lucide React (Icons)

HTML5 Canvas API

📝 Scripts

In the project directory, you can run:

npm start: Runs the app in development mode.

npm run build: Builds the app for production to the build folder.

npm test: Launches the test runner.
You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
