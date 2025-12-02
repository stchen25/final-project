import React from 'react';
import { BuildingCategory } from '../lib/types';


//A React component for selecting buildings. This file provides functionality for opening building options when we hover over a building category


interface Props {
  category: BuildingCategory;
  onSelect: (id: string) => void;
}

export default function CategoryGroup({ category, onSelect }: Props) {
  return (
    
    //Create the components to display the categories (Using the BuildingCategory parameters from lib/cityConfig.tsx)
    <div className="group relative">
      <div className="flex items-center gap-3 p-3 bg-slate-700 rounded-lg cursor-default transition-colors border border-transparent hover:border-slate-500 hover:bg-slate-600">
        <div className={`p-2 rounded ${category.baseColor} text-white shadow-lg`}>
          {category.icon}
        </div>
        <div>
          <span className="text-sm font-bold text-slate-200 block">{category.label}</span>
        </div>
      </div>
    

    {/* Logic to handle dropdown menu when hovering over a category */}
      <div className="hidden group-hover:block pl-4 mt-2 space-y-2">
        <div className="absolute left-6 top-12 bottom-4 w-0.5 bg-slate-600/50 -z-10" />
        

         {/* Create a new button for each building variant under the given category, using the parameters in lib/cityConfig.tsx */}
        {category.variants.map((variant) => (
          <button
            key={variant.id}
            onClick={() => onSelect(variant.id)}
            className="flex w-full items-center gap-3 p-2 bg-slate-800 rounded border border-slate-700 hover:border-blue-400 hover:bg-slate-700 transition-all ml-4 text-left"
          >
            <div 
              className="w-4 h-4 rounded" 
              style={{ backgroundColor: variant.color }} 
            />
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-slate-300">{variant.label}</span>
              <span className="text-[9px] text-slate-500">{variant.w}x{variant.h} px</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}