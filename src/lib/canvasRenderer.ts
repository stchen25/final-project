import { Building, Point, RoadSegment, BuildingVariant } from './types';
import { getDistance } from './pathFinding';


//functions for drawing all graphics

export const drawRoads = (ctx: CanvasRenderingContext2D, roads: RoadSegment[]) => {
  ctx.lineCap = 'round';

  //Draw all roads saved to the canvas
  roads.forEach(road => {
    ctx.beginPath();
    ctx.moveTo(road.start.x, road.start.y);
    ctx.lineTo(road.end.x, road.end.y);
    ctx.strokeStyle = '#475569'; 
    ctx.lineWidth = 12;
    ctx.stroke();
  });
};
 //Draw all buildings saved to the canvas 
export const drawBuildings = (ctx: CanvasRenderingContext2D, buildings: Building[]) => {
  buildings.forEach(b => {
    ctx.fillStyle = b.color;
    ctx.fillRect(b.x, b.y, b.width, b.height);
  });
};


//draw the faded building when we select a building and hover over the canvas
export const drawGhostBuilding = (ctx: CanvasRenderingContext2D, variant: BuildingVariant, mousePos: Point) => {

    //save the current canvas context without the faded building
    ctx.save();

    //set transparency of the building
    ctx.globalAlpha = 0.6;

    //Make the center coordinates of the faded building follow the mouse
    const ghostX = mousePos.x - variant.w / 2;
    const ghostY = mousePos.y - variant.h / 2;

    //draw the faded building
    ctx.fillStyle = variant.color;
    ctx.fillRect(ghostX, ghostY, variant.w, variant.h);
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.strokeRect(ghostX, ghostY, variant.w, variant.h);

    //restore the original canvas without the faded building
    ctx.restore();
};

//draw a dashed line as we change the size of a road we are drawing.
//The start Point is the first click where the beginning of the road is
//the end Point is the location of our mouse
export const drawActiveRoadGuide = (ctx: CanvasRenderingContext2D, start: Point, end: Point, isSnapped: boolean) => {

  //draw the dashed line from the start of the road to our mouse
  ctx.beginPath();
  ctx.moveTo(start.x, start.y);
  ctx.lineTo(end.x, end.y);
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 4;
  ctx.setLineDash([5, 5]);
  ctx.stroke();
  ctx.setLineDash([]);
  
  //if our current mouse location snaps to the end of another road, draw the dashed line until the snapped location
  if (isSnapped) {
    ctx.beginPath();
    ctx.arc(end.x, end.y, 8, 0, Math.PI * 2);
    ctx.fillStyle = '#38bdf8';
    ctx.fill();
  }

  //label the dashed line with the current distance of the road

  //calculate distance in pixels from current mouse position to start of the road. Convert from pixels to meters (this is an arbitrary conversion)
  let dist = Math.round(getDistance(start, end));
  dist = Math.round(dist/1.5)
  //find the middle of the dashed line
  const midX = (start.x + end.x) / 2;
  const midY = (start.y + end.y) / 2;
  

  //draw the text for size of the road and its unit (m) inside a box
  const text = `${dist}m`;
  ctx.font = '12px sans-serif';
  const metrics = ctx.measureText(text);
  const boxW = metrics.width + 8;
  const boxH = 18;
  ctx.beginPath();
  ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
  ctx.roundRect(midX - boxW / 2, midY - boxH / 2, boxW, boxH, 4);
  ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, midX, midY);
};

//function for drawing the path calculated from our shortest path algorithm. "path" are the selected roads that are in our shortest path
export const drawCalculatedPath = (ctx: CanvasRenderingContext2D, path: Point[]) => {

  //highlight each path yellow
  ctx.beginPath();
  path.forEach((p, i) => {
    if (i === 0) 
      ctx.moveTo(p.x, p.y);
    else ctx.lineTo(p.x, p.y);
  });
  ctx.strokeStyle = '#facc15';
  ctx.lineWidth = 6;
  ctx.stroke();

};

//function for drawing a dashed line when the user is selecting buildings to find a path between
export const drawPathToolGuide = (ctx: CanvasRenderingContext2D, start: Point, mouse: Point) => {

  //draw a circle to pin the start point of our path (the first building)
  ctx.beginPath();
  ctx.arc(start.x, start.y, 6, 0, Math.PI*2);
  ctx.fillStyle = '#ef4444';
  ctx.fill();
  
  //draw the dashed line from the start point to the current location of our mouse
  ctx.beginPath();
  ctx.moveTo(start.x, start.y);
  ctx.lineTo(mouse.x, mouse.y);
  ctx.strokeStyle = 'rgba(239, 68, 68, 0.5)';
  ctx.lineWidth = 2;
  ctx.setLineDash([5,5]);
  ctx.stroke();
  ctx.setLineDash([]);
};