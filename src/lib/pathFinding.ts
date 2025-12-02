import { Point, RoadSegment, GraphNode } from './types';

//=================

//file that defines all necessary shortest path algorithm logic

//=============

//function to get distance between two points, using the Distance Formula
export const getDistance = (p1: Point, p2: Point) => {
  return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
};

//converts a point's number values to string to to identify each point on the graph
export const pointToString = (p: Point) => `${Math.round(p.x)},${Math.round(p.y)}`;


//function to build the graph of roads for shortest path calculation. Takes in an array of roads and forms the graph based on intersections
const buildGraph = (roads: RoadSegment[]): Record<string, GraphNode> => {

  //initialize the graph
  const graph: Record<string, GraphNode> = {};

  //function to add a node to the graph at a given point
  const addNode = (p: Point) => {

    //convert point to string format
    const id = pointToString(p);

    //if the graph does not already contain this point as a node, add this point to the graph
    if (!graph[id]) {
      graph[id] = { id, x: p.x, y: p.y, connections: [] };
    }
    return id;
  };

  //for each road...
  roads.forEach(road => {

    //add the beginning and end of the road to the graph, adding two total nodes to the graph
    const startId = addNode(road.start);
    const endId = addNode(road.end);

    //add connections between the beginning and end of a road. This symbolizes the "transition" from one end of the road to another
    if (!graph[startId].connections.includes(endId)) 
      graph[startId].connections.push(endId);
    if (!graph[endId].connections.includes(startId)) 
      graph[endId].connections.push(startId);
    
    
  });
  return graph;
};


//we use dijkstra's algorithm
export const findShortestPath = (
  startP: Point,
  endP: Point,  //startP and endP should correspond to the location of a building
  roads: RoadSegment[]
): Point[] | null => {
  
  //construct the base graph with only the roads
  const graph = buildGraph(roads);

  // Create a temporary node at targetP that represents the location of the builing. Initialize variables to that will store the best road to connect to
  const injectNode = (targetP: Point, tempId: string): string | null => {
    let bestDist = Infinity
    let bestProj = null as Point | null;
    let bestRoad = null as RoadSegment | null;


    // Find nearest road segment to this temporary node. So for each road...
    roads.forEach(r => {

      //Get closest point on road segment to building
      const proj = getClosestPointOnSegment(targetP, r.start, r.end);

      //get distance between these points
      const dist = getDistance(targetP, proj);

      // Threshold: Building must be within 100px of a road to connect
      if (dist < bestDist && dist < 100) { 
        bestDist = dist;
        bestProj = proj;
        bestRoad = r;
      }
    });

    //If building is too far from any road, abort
    if (!bestProj || !bestRoad) return null;

    // Create the temporary node
    graph[tempId] = { 
      id: tempId, 
      x: bestProj.x, 
      y: bestProj.y, 
      connections: [] 
    };


    const roadStartId = pointToString(bestRoad.start);
    const roadEndId = pointToString(bestRoad.end);

    // Add bidirectional connections
    // connect the new node to the start of the road segment
    graph[tempId].connections.push(roadStartId);
    graph[roadStartId].connections.push(tempId);
    
    // connect the new node to the end of the road segment
    graph[tempId].connections.push(roadEndId);
    graph[roadEndId].connections.push(tempId);

    return tempId;
  };

  // Inject the start and end points into the graph
  const startNodeId = injectNode(startP, 'TEMP_START');
  const endNodeId = injectNode(endP, 'TEMP_END');


  // If we did not point to a start or end point (buildings), abort
  if (!startNodeId || !endNodeId) return null;

  //the implementation of Dijkstra's Algorithm begins here
  const distances: Record<string, number> = {};
  const previous: Record<string, string | null> = {};
  const queue: string[] = [];


  //initialize distances to highest value
  Object.keys(graph).forEach(id => {
    distances[id] = Infinity;
    previous[id] = null;
    queue.push(id);
  });

  //distance from source to self is 0
  distances[startNodeId] = 0;

  //while we still have nodes to explore...
  while (queue.length > 0) {
    // Sort by distance (smallest length road first)
    queue.sort((a, b) => distances[a] - distances[b]);

    //pop the shortest road from the queue
    const u = queue.shift()!;

    //if we cant get to a node, or if the node is our target, then break
    if (u === endNodeId) break;
    if (distances[u] === Infinity) break;

    //Calulate and update shortest distances from source to u's neighbors
    const neighbors = graph[u].connections;
    for (const v of neighbors) {
      if (queue.includes(v)) {
        const d = getDistance({x: graph[u].x, y: graph[u].y}, {x: graph[v].x, y: graph[v].y});
        const alt = distances[u] + d;
        if (alt < distances[v]) {
          distances[v] = alt;
          previous[v] = u;
        }
      }
    }
  }

  //Reconstruct Path
  const path: Point[] = [];
  let current: string | null = endNodeId;
  
  //If we found a path (or if start == end)
  if (previous[current] || current === startNodeId) {
    while (current) {
      path.unshift({ x: graph[current].x, y: graph[current].y });
      current = previous[current];
    }

    //return the path as a collection of visited
    return [startP, ...path, endP]; 
  }
  
  return null;
};

export const getClosestPointOnSegment = (p: Point, a: Point, b: Point): Point => {
  //I calculate the closest point on the line to the building by doing the computation for the projection from a point onto a line.
  //The computation is just using dot products, as derived in https://en.wikipedia.org/wiki/Vector_projection
  //The code here is modified from the answer on https://stackoverflow.com/questions/64330618/finding-the-projection-of-a-point-onto-a-line

  //get the following vectors:
  const AB = { x: b.x - a.x, y: b.y - a.y };  //vector from start of road to building
  const PA = { x: p.x - a.x, y: p.y - a.y };   //vector that represents the line
  
  //compute dot products
  const num = PA.x * AB.x + PA.y * AB.y
  const denom = AB.x * AB.x + AB.y * AB.y;


  // Project point onto line
  let t = num/denom;

  //ensure that the projection does not go past the first line segment
  t = Math.max(0, Math.min(1, t));

  //calculate the point on the line segment
  return { 
    x: a.x + t * AB.x, 
    y: a.y + t * AB.y 
  };
};