import React from 'react';
import type { Grupo } from '../types';

interface GrupoCardProps {
  grupo: Grupo;
  onEdit: (grupo: Grupo) => void;
  onDelete: (grupo: Grupo) => void;
  onViewDetails: (grupo: Grupo) => void;
}

export const GrupoCard: React.FC<GrupoCardProps> = ({ grupo, onEdit, onDelete, onViewDetails }) => {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden border border-gray-100 flex flex-col justify-between">
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <span className="inline-block px-2 py-1 text-xs font-semibold tracking-wide text-indigo-500 bg-indigo-50 rounded-full">
             ID: {grupo.id}
          </span>
          {grupo.sector && (
             <span className="inline-block px-2 py-1 text-xs font-semibold text-gray-500 bg-gray-100 rounded-full">
               Sector: {grupo.sector.nro_sector}
             </span>
          )}
        </div>
        
        <h3 className="text-xl font-bold text-gray-800 mb-2 truncate" title={grupo.nombre}>
          {grupo.nombre}
        </h3>
        <p className="text-gray-600 text-sm line-clamp-3 mb-4">
          {grupo.descripcion || 'Sin descripción disponible.'}
        </p>
      </div>

      <div className="bg-gray-50 px-5 py-3 border-t border-gray-100 flex justify-end gap-2">
         <button
          onClick={() => onViewDetails(grupo)}
          className="p-2 text-blue-600 hover:bg-blue-100 rounded-full transition-colors"
          title="Ver detalles"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        </button>
        <button
          onClick={() => onEdit(grupo)}
          className="p-2 text-yellow-600 hover:bg-yellow-100 rounded-full transition-colors"
          title="Editar"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
        <button
          onClick={() => onDelete(grupo)}
          className="p-2 text-red-600 hover:bg-red-100 rounded-full transition-colors"
          title="Eliminar"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  );
};