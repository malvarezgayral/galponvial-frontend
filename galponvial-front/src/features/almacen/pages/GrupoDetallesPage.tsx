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
      
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
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
                <span className="text-sm text-gray-500">ID Grupo: {grupoData.id}</span>
            </div>
        </div>
      </div>

      {/* Info Card - Datos del Grupo */}
      <div className="bg-white rounded-lg shadow p-8 border-t-4 border-indigo-500">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <div className="md:col-span-1">
                <div className="aspect-video bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-400 border border-indigo-100">
                    <div className="text-center">
                        <svg className="w-16 h-16 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                        <span className="text-xs font-medium">Grupo de Artículos</span>
                    </div>
                </div>
            </div>

            <div className="md:col-span-2 flex flex-col h-full justify-center">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-12 mb-6">
                    <div>
                        <span className="text-gray-500 text-xs uppercase tracking-wider block mb-1">Sector (Galpón)</span>
                        <div className="flex items-center gap-2">
                             <span className="text-gray-900 font-semibold text-lg">
                                {grupoData.sector_galpon || 'Sin sector asignado'}
                             </span>
                        </div>
                    </div>
                    <div>
                         <span className="text-gray-500 text-xs uppercase tracking-wider block mb-1">Total Artículos</span>
                         <span className="text-gray-900 font-semibold text-lg">{grupoData.articulos.length}</span>
                    </div>
                </div>

                <div className="pt-4 border-t border-gray-100">
                    <span className="text-gray-500 text-xs uppercase tracking-wider block mb-2">Descripción</span>
                    <p className="text-gray-900 text-base leading-relaxed">
                        {grupoData.descripcion || 'Sin descripción detallada.'}
                    </p>
                </div>
            </div>
        </div>
      </div>

      {/* Tabla de Artículos Asociados */}
      <div className="bg-white rounded-lg shadow p-6 mt-8">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Artículos en este Grupo</h2>
        </div>

        {grupoData.articulos.length === 0 ? (
             <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-100">
                <p className="text-gray-500">No hay artículos asociados a este grupo.</p>
             </div>
        ) : (
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-gray-200 bg-gray-50">
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Código</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Modelo</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Unidad</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                        {grupoData.articulos.map((art) => (
                            <tr key={art.cod} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-600">
                                    {art.cod}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {art.nombre}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {art.modelo || '-'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-700">
                                    <span className="capitalize">{art.unidad_tipo}</span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                                    <button 
                                        onClick={() => navigate(ROUTES.articuloDetalles(art.cod))}
                                        className="text-indigo-600 hover:text-indigo-900 font-medium text-xs uppercase"
                                    >
                                        Ver
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