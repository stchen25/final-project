import React from 'react';
import { Home, Building2, School, Hospital } from 'lucide-react';
import { BuildingCategory, BuildingVariant } from './types';




//definition of several buildings that the user can add to the UI
//To see structure of BuildingCategory, see lib/types.ts


//Edit this file to add more buildings!



export const BUILDING_CATALOG: Record<string, BuildingCategory> = {
  residential: {
    id: 'residential',
    label: 'Residential',
    icon: <Home size={20} />,
    baseColor: 'bg-blue-500',
    variants: [
      { id: 'res_small', label: 'Cottage', w: 30, h: 30, color: '#93c5fd' },
      { id: 'res_med', label: 'House', w: 40, h: 40, color: '#3b82f6' },
      { id: 'res_large', label: 'Apartment', w: 60, h: 60, color: '#1d4ed8' },
    ]
  },
  commercial: {
    id: 'commercial',
    label: 'Commercial',
    icon: <Building2 size={20} />,
    baseColor: 'bg-purple-500',
    variants: [
      { id: 'com_store', label: 'Small Store', w: 40, h: 40, color: '#d8b4fe' },
      { id: 'com_office', label: 'Office Block', w: 60, h: 80, color: '#a855f7' },
      { id: 'com_tower', label: 'Skyscraper', w: 80, h: 80, color: '#7e22ce' },
    ]
  },
  academic: {
    id: 'academic',
    label: 'Academic',
    icon: <School size={20} />,
    baseColor: 'bg-red-500',
    variants: [
      { id: 'student_center', label: 'Student Center', w: 70, h: 100, color: '#eb6b34' },
      { id: 'academic_building', label: 'Academic Building', w: 120, h: 100, color: '#de8264' },
    ]
  },
  services: {
    id: 'service',
    label: 'Services',
    icon: <Hospital size={20} />,
    baseColor: 'bg-green-500',
    variants: [
      { id: 'hospital', label: 'Hospital', w: 120, h: 120, color: '#000e7a' },
      { id: 'police-station', label: 'Police Station', w: 120, h: 100, color: '#22c55e' },
      { id: 'library', label: 'Library', w: 80, h: 80, color: '#0d3161' },
      { id: 'airport', label: 'Airport', w: 500, h: 400, color: '#797b7d' },
      { id: 'park', label: 'Park', w: 200, h: 200, color: '#86efac' },
    ]
  }
};

//Create a map of all building variants that we can look up later
export const BUILDING_VARIANTS_MAP: Record<string, BuildingVariant> = {};

//get all categories from the entire building catelog (residential, commercial, etc.)
const categories = Object.values(BUILDING_CATALOG);

//for each category...
for (const category of categories) {

  //for each variant...
  for (const variant of category.variants) {

    //Add the variant to our map using its ID as the key
    BUILDING_VARIANTS_MAP[variant.id] = variant;
  }
}