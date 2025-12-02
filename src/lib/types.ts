import { ReactNode } from 'react';

//file that defines each important class


//a Point where an object is on the (x,y) plane
export interface Point {
  x: number;
  y: number;
}


//a BuildingVariant defines a specific building (e.g. an apartment, hospital, etc.) on the sidebar. This is for display on the sidebar, not the canvas
export interface BuildingVariant {
  id: string;  //id of the building
  label: string;  //label of the building on the sidebar
  w: number;   //dimensions
  h: number;
  color: string; //color of the displayed building
}


//each BuildingVariant is a member of a BuildingCategory: Residential, Commercial, Academic, and Services
export interface BuildingCategory {
  id: string;   //id of the building
  label: string;  //label of the building on the bar
  icon: ReactNode;   //icon to represent category in the UI
  baseColor: string;  //color of the category in the UI
  variants: BuildingVariant[];  //Each specific building within this category
}

//Defines the parameters for drawing the actual buildings. These are what are placed onto the canvas
export interface Building {
  id: string;  //each building has an id
  variantId: string; //each building corresponds to a variant on the sidebar
  x: number;  //parameters for drawing
  y: number;
  width: number;
  height: number;
  color: string;  //color of the building
}



//defines a road
export interface RoadSegment {
  id: string; //id of the road
  start: Point;  //(x,y) coordinates for the start and ends of the road
  end: Point;
}


//defines a node on a graph, for shortest path algorithm
export interface GraphNode {
  id: string; //id of the Node
  x: number; //(x,y) coordinate of the node
  y: number;
  connections: string[]; //other nodes that this node is connected to, stored by the node's id
}