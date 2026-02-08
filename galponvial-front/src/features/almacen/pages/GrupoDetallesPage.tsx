import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { almacenService } from '../services/almacenService';
import { Button } from '@/shared/ui/Button'; 
import { ROUTES } from '@/app/routes';

interface GrupoDetailDTO {
  id: number;
  nombre: string;
  descripcion: string;
  sector_galpon: string | number; 
  nombre_sector?: string; // Nuevo campo
  articulos: {
    cod: number; 
    cod_proveedor: string;
    nombre: string;
    modelo: string;
    descripcion: string;
    img_url: string;
    unidad_tipo: string;
  }[];
}

const GrupoDetallesPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  const [grupoData, setGrupoData] = useState<GrupoDetailDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchGrupoData = useCallback(async () => {
    if (!id) return;
    const grupoId = parseInt(id);

    try {
      setLoading(true);
      const data = await almacenService.getGrupoById(grupoId) as unknown as GrupoDetailDTO;
      setGrupoData(data);
    } catch (err) {
      const errorObj = err instanceof Error ? err : new Error('Error al cargar el grupo');
      setError(errorObj);
      console.error('Error fetching grupo details:', errorObj);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    void fetchGrupoData();
  }, [fetchGrupoData]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!grupoData || error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Grupo no encontrado</h1>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-800 mb-4">No se pudo cargar la información.</p>
            <Button variant="primary" onClick={() => navigate('/almacen')}>Volver al Almacén</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10">
      
      {/* Header con botón atrás */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-4">
            <button 
                onClick={() => navigate(-1)} 
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Volver atrás"
            >
                <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
            </button>
            <div>
                <h1 className="text-3xl font-bold text-gray-900">{grupoData.nombre}</h1>
                <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs font-mono bg-gray-100 px-2 py-0.5 rounded text-gray-600">ID: {grupoData.id}</span>
                </div>
            </div>
        </div>
      </div>

      {/* Info Card - Datos del Grupo (SIN IMAGEN y ANCHO COMPLETO) */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 relative overflow-hidden">
        {/* Adorno decorativo de fondo */}
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-indigo-50 rounded-full opacity-50 blur-xl"></div>

        <div className="relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
                {/* Sector */}
                <div>
                    <span className="text-gray-500 text-xs uppercase tracking-wider block mb-2 font-semibold">Sector / Ubicación</span>
                    <div className="flex items-center gap-3">
                         <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                         </div>
                         <div>
                            <p className="text-gray-900 font-bold text-lg leading-none">
                                {grupoData.nombre_sector || 'Sin nombre'}
                            </p>
                            <span className="text-xs text-gray-500">Nro. {grupoData.sector_galpon}</span>
                         </div>
                    </div>
                </div>

                {/* Total Artículos */}
                <div>
                     <span className="text-gray-500 text-xs uppercase tracking-wider block mb-2 font-semibold">Total Artículos</span>
                     <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-50 rounded-lg text-green-600">
                             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                        </div>
                        <span className="text-gray-900 font-bold text-2xl">{grupoData.articulos.length}</span>
                     </div>
                </div>
            </div>

            {/* Descripción a todo el ancho */}
            <div className="pt-6 border-t border-gray-100">
                <span className="text-gray-500 text-xs uppercase tracking-wider block mb-2 font-semibold">Descripción del Grupo</span>
                <p className="text-gray-700 text-base leading-relaxed max-w-4xl">
                    {grupoData.descripcion || 'Sin descripción detallada disponible para este grupo.'}
                </p>
            </div>
        </div>
      </div>

      {/* Tabla de Artículos Asociados */}
      <div className="bg-white rounded-lg shadow p-6 mt-8">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                Artículos en este Grupo
            </h2>
        </div>

        {grupoData.articulos.length === 0 ? (
             <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                <p className="text-gray-500">No hay artículos asociados a este grupo actualmente.</p>
             </div>
        ) : (
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-gray-200 bg-gray-50">
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Código</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Nombre</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Modelo</th>
                            <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Unidad</th>
                            <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                        {grupoData.articulos.map((art) => (
                            <tr key={art.cod} className="hover:bg-gray-50 transition-colors group">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-600 bg-gray-50/50">
                                    {art.cod}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {art.nombre}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {art.modelo || '-'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-700">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 capitalize">
                                        {art.unidad_tipo}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                                    <button 
                                        onClick={() => navigate(ROUTES.articuloDetalles(art.cod))}
                                        className="text-indigo-600 hover:text-indigo-900 font-medium text-xs uppercase tracking-wide hover:underline"
                                    >
                                        Ver Detalle
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )}
      </div>
    </div>
  );
};

export default GrupoDetallesPage;