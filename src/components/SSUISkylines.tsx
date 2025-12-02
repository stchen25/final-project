//=====================================================================
//=====================================================================
//The App component of the SSUI Skylines Project (SSUI Final Project)
//By Stephen Chen




import React, { useState, useEffect, useRef, KeyboardEvent } from 'react';
import { Trash2, MousePointer2 } from 'lucide-react';


import { Building, Point, RoadSegment } from '../lib/types';
import { BUILDING_CATALOG, BUILDING_VARIANTS_MAP} from '../lib/cityConfig';
import { getDistance, findShortestPath} from '../lib/pathFinding';
import * as Renderer from '../lib/canvasRenderer';
import CategoryGroup from './CategoryGroup';


//the actual UI interface

export default function App() {
  // Definition of a bunch of states

  //all objects on the canvas will be stored in either 'buildings' or 'roads'
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [roads, setRoads] = useState<RoadSegment[]>([]);
  const [mode, setMode] = useState<'view' | 'road' | 'delete' | 'building'|'path'>('view');
  const [isDraggingRoad, setIsDraggingRoad] = useState(false);
  const [roadStart, setRoadStart] = useState<Point | null>(null);
  const [mousePos, setMousePos] = useState<Point>({ x: 0, y: 0 });
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);
  const [pathStart, setPathStart] = useState<Point | null>(null);
  const [calculatedPath, setCalculatedPath] = useState<Point[] | null>(null);

  //define our canvas and DOM
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  //All of our logic for drawing on the canvas goes into this useEffect() hook
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    //when something changes, redraw the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    //draw all roads that should be displayed on the canvas
    Renderer.drawRoads(ctx, roads);

    //for drawing a new road
    //if we are dragging a road, and the start of the road exists...
    if (isDraggingRoad && roadStart) {
      //check if we are able to snap the end of this road to the end of another road
      const snap = getSnapPoint(mousePos);

      //define the end of the road as either the snap location (only if we are snapping, which is handled in getSnapPoint) or our raw mouse location
      const endPoint = snap || mousePos;

      //draw the new road
      Renderer.drawActiveRoadGuide(ctx, roadStart, endPoint, !!snap);
    }

    //draw all buildings that should be displayed on the canvas
    Renderer.drawBuildings(ctx, buildings);

    //draw a faded building that follows the mouse when the user is deciding where to place the building
    //if we are placing buildings, and we have selected a specific building...
    if (mode === 'building' && selectedVariantId) {

      //retrieve the building from our variants map
      const variant = BUILDING_VARIANTS_MAP[selectedVariantId];

      //draw the faded building
      if (variant) {
        Renderer.drawGhostBuilding(ctx, variant, mousePos);
      }
    }

    //if we have calculated a shortest path, display it
    if (calculatedPath) {
      Renderer.drawCalculatedPath(ctx, calculatedPath);
    }

    //if we are drawing a path and have defined a first point, draw a line to follow the user's mouse
    if (mode === 'path' && pathStart) {
      Renderer.drawPathToolGuide(ctx, pathStart, mousePos);
    }

  }, [buildings, roads, isDraggingRoad, roadStart, mousePos, mode, calculatedPath, pathStart, selectedVariantId]);



  //get the point where one end of a road snaps to another end. 
  //basically, for the given point (which should be the end of a road), it finds the closest end of another road. 
  //if the closest road is too far, then we do not snap (return null)
  const getSnapPoint = (currentPos: Point): Point | null => {
    let bestPoint: Point | null = null; 
    let minDistance = 40; //40 pixels

    //iterate through each road 
    for (const road of roads) {
  
      //check the distance of our mouse position to the start of the road
      const distanceToStart = getDistance(currentPos, road.start);
      
      //if close enough, snap to the start of the road
      if (distanceToStart < minDistance) {
        minDistance = distanceToStart;
        bestPoint = road.start;
      }
    
      // //check the distance of our mouse position to the end of the road
      const distanceToEnd = getDistance(currentPos, road.end);
      
      //if close enough, snap to the start of the road
      if (distanceToEnd < minDistance) {
        minDistance = distanceToEnd;
        bestPoint = road.end;
      }
    }
    return bestPoint;
  };
  
  //function to handle pressing the escape button. It basically just resets our state to 'view' (not placing anything, and nothing selected)
  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === 'Escape'){
      setMode('view');
      setSelectedVariantId(null);
      setPathStart(null);
      setCalculatedPath(null);
      setIsDraggingRoad(false);
      setRoadStart(null);
    }
  };

  //function to handle click
  const handleMouseDown = (e: React.MouseEvent) => {
    //since the canvas is offset a little bit, but our mouseclick is based on React's UI coordinate system
    const rect = canvasRef.current!.getBoundingClientRect();

    //translate to the canvas' coordinate sstem
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rawPoint = { x, y };

    //get the point of our click that will be handled
    const snap = getSnapPoint(rawPoint); 
    const finalPoint = snap || rawPoint; 
  
    // if the state is to draw buildings...
    if (mode === 'building' && selectedVariantId) {

      //get the building
      const variant = BUILDING_VARIANTS_MAP[selectedVariantId];
      if (!variant) return;

      //create a new building object. We want to place it where our mouse is in the middle of the object, not the top left.
      const buildX = x - variant.w / 2;
      const buildY = y - variant.h / 2;
      const newBuilding: Building = {
        id: Math.random().toString(36),
        variantId: variant.id,
        x: buildX, y: buildY,
        width: variant.w, height: variant.h,
        color: variant.color
      };


      //check if the building overlaps with other buildings
      const hasCollision = buildings.some(b => 
        newBuilding.x < b.x + b.width &&
        newBuilding.x + newBuilding.width > b.x &&
        newBuilding.y < b.y + b.height &&
        newBuilding.y + newBuilding.height > b.y
      );

      
      //if not, add this new building to our list of buildings
      if (!hasCollision) setBuildings(prev => [...prev, newBuilding]);
    }
  
    // if the state is to draw roads, we indicate that we are drawing roads and define the start of the road, where we first click
    if (mode === 'road') {
        setIsDraggingRoad(true);
        setRoadStart(finalPoint);

    //if the state is to draw paths...
    } else if (mode === 'path') {
        //if this is the first click, allow user to choose a second point
        if (!pathStart) {
            setPathStart(finalPoint);
            setCalculatedPath(null);
        
        //if this is the second click, perform shortest path calculation between the two points
        } else {
            const path = findShortestPath(pathStart, finalPoint, roads);
            setCalculatedPath(path);
            setPathStart(null);
        }
    }
  };
  
  //function to define where our mouse is in the canvas coordinates
  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  //if we let go of the mouse...
  const handleMouseUp = () => {

    //if we are in the process of drawing a road...
    if (mode === 'road' && isDraggingRoad && roadStart) {
        //get the snap point
        const snap = getSnapPoint(mousePos);

        //choose whether we snap or end at our mouse position
        const endPoint = snap || mousePos;

        //create a new road and add it to our list of roads
        const newRoad: RoadSegment = {
                id: Math.random().toString(36),
                start: roadStart,
                end: endPoint
            };
        setRoads(prev => [...prev, newRoad]);
        
        //return to the state of not drawing a road
        setIsDraggingRoad(false);
        setRoadStart(null);
    }
  };

  //React Components for the sidebar and the canvas
  return (
    <div className="flex h-screen bg-slate-900 text-slate-200 font-sans overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 border-r border-slate-700 flex flex-col p-4 shadow-xl z-10 overflow-y-auto">
        <h1 className="text-xl font-bold mb-6 text-white tracking-tight flex items-center gap-2">

          {/* Title of Project */}
           <span className="text-blue-500">SSUI</span> Skylines
        </h1>
        <div className="space-y-6">
          {/* Building Categories */}
          <div>
            <h2 className="text-xs font-bold uppercase text-slate-500 mb-3 tracking-wider">Buildings</h2>
            <div className="space-y-3">

              {/* Click handling when we select a building */}
              {Object.values(BUILDING_CATALOG).map(cat => (
                <CategoryGroup 
                  key={cat.id} 
                  category={cat} 
                  onSelect={(variantId) => {
                    setMode('building');
                    setSelectedVariantId(variantId);
                  }}
                />
              ))}
            </div>
          </div>
          <div className="h-px bg-slate-700 w-full" />

          {/* Tools (road and path) */}
          <div>
            <h2 className="text-xs font-bold uppercase text-slate-500 mb-3 tracking-wider">Tools</h2>
            <div className="grid grid-cols-2 gap-2">
              {/* Set state to "road" when we click on road, to indicate that the user wants to draw a road */}
              <button 
                onClick={() => setMode('road')}
                className={`flex flex-col items-center justify-center p-3 rounded border transition-all ${mode === 'road' ? 'bg-slate-700 border-blue-500 text-blue-400' : 'border-slate-600 hover:bg-slate-700'}`}
              >
                <div className="w-6 h-2 bg-current mb-2 rounded-full transform -rotate-45" />
                <div />
                <span className="text-xs font-bold">Road</span>



              </button>
              {/* Set state to "path" when we click on road, to indicate that the user wants to draw a path */}
              <button 
                onClick={() => { setMode('path'); setCalculatedPath(null); setPathStart(null); }}
                className={`flex flex-col items-center justify-center p-3 rounded border transition-all ${mode === 'path' ? 'bg-slate-700 border-yellow-500 text-yellow-400' : 'border-slate-600 hover:bg-slate-700'}`}
              >
                <MousePointer2 size={20} className="mb-1" />
                <span className="text-xs font-bold">Path</span>
              </button>
              
              {/* Erase canvas and set mode to "view" when we click on "clear map" */}
              <button 
                 onClick={() => { setBuildings([]); setRoads([]); setCalculatedPath(null);setMode('view') }}
                 className="col-span-2 flex items-center justify-center p-3 rounded border border-red-900/50 bg-red-500/10 text-red-400 hover:bg-red-500/20"
              >
                <Trash2 size={16} className="mr-2" /> Clear Map
              </button>
            </div>
          </div>

           {/* Instructions */}
          <div className="mt-auto bg-slate-900/50 p-3 rounded text-xs text-slate-400 border border-slate-700">
             <p className="font-bold text-slate-300 mb-1">Instructions:</p>
             <ul className="list-disc list-inside space-y-1">
                <li><strong className="text-white">Buildings:</strong> Click and drop buildings.</li>
                <li><strong className="text-white">Roads:</strong> Drag to draw roads.</li>
                <li><strong className="text-white">Paths:</strong> Click two points to find path.</li>
                <li><strong className="text-white">Escape:</strong> Cancel current tool.</li>
             </ul>
          </div>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 relative bg-white overflow-hidden" ref={containerRef}>
        <div className="absolute inset-0 pattern-grid opacity-10 pointer-events-none" /> 
        
        {/* Create event handlers for when we interact with the canvas */}
        <canvas
          ref={canvasRef}
          width={window.innerWidth - 256} 
          height={window.innerHeight}
          tabIndex={0}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onKeyDown={handleEscape}
          className="cursor-crosshair w-full h-full block"
          onMouseEnter={(e) => e.currentTarget.focus()}
        />
      </div>
    </div>
  );
}