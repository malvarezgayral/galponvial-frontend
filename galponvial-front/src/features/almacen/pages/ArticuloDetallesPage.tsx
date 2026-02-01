import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { almacenService } from '../services/almacenService';
import { Button } from '@/shared/ui/Button'; 
import { Badge } from '@/shared/ui/Badge'; 
import type { Articulo, Movimiento } from '../types';
import CreateMovimientoModal from '../components/CreateMovimientoModal';

const ArticuloDetallesPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  const [articulo, setArticulo] = useState<Articulo | null>(null);
  const [articuloLoading, setArticuloLoading] = useState(true);
  const [articuloError, setArticuloError] = useState<Error | null>(null);

  const [movimientos, setMovimientos] = useState<Movimiento[]>([]);
  const [movimientosLoading, setMovimientosLoading] = useState(false);
  const [openMovimientoModal, setOpenMovimientoModal] = useState(false);

  
  const refetchAllData = useCallback(async () => {
    if (!id) return;
    const articuloId = parseInt(id);

    try {
      setArticuloLoading(true);
      const data = await almacenService.getArticuloById(articuloId);
      setArticulo(data);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Error al cargar el artículo');
      setArticuloError(error);
      console.error('Error fetching articulo:', error);
    } finally {
      setArticuloLoading(false);
    }

    try {
      setMovimientosLoading(true);
      const movData = await almacenService.getMovimientos(articuloId);
      setMovimientos(movData);
    } catch (err) {
      console.error('Error fetching movimientos:', err);
    } finally {
      setMovimientosLoading(false);
    }
  }, [id]);

  useEffect(() => {
    void refetchAllData();
  }, [refetchAllData]);

  const getMovimientoBadgeColor = (tipo: string) => {
    const tipoLimpio = tipo.toLowerCase();
    if (tipoLimpio.includes('entrada') || tipoLimpio.includes('alta')) return 'bg-green-100 text-green-800';
    if (tipoLimpio.includes('salida') || tipoLimpio.includes('baja')) return 'bg-red-100 text-red-800';
    return 'bg-gray-100 text-gray-800';
  };

  if (articuloLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!articulo || articuloError) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Artículo no encontrado</h1>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-800 mb-4">No se pudo cargar la información del artículo.</p>
            <Button variant="primary" onClick={() => navigate('/almacen')}>Volver al Almacén</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10">
      
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
                <h1 className="text-3xl font-bold text-gray-900">{articulo.nombre}</h1>
            </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <div className="md:col-span-1">
                <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 border border-gray-200">
                    <div className="text-center">
                        <svg className="w-16 h-16 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-xs text-gray-400">Imagen del artículo</span>
                    </div>
                </div>
            </div>

            <div className="md:col-span-2 flex flex-col h-full">
                
                    
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-12 mb-8">
                    <div>
                        <span className="text-gray-500 text-xs uppercase tracking-wider block mb-1">Código Proveedor</span>
                        <span className="text-gray-900 font-semibold">{articulo.cod_proveedor || '-'}</span>
                    </div>
                    <div>
                        <span className="text-gray-500 text-xs uppercase tracking-wider block mb-1">Modelo</span>
                        <span className="text-gray-900 font-semibold">{articulo.modelo || '-'}</span>
                    </div>
                     <div>
                        <span className="text-gray-500 text-xs uppercase tracking-wider block mb-1">Tipo Unidad</span>
                        <span className="text-gray-900 font-semibold capitalize">{articulo.unidad_tipo}</span>
                    </div>
                    
                     <div className="mb-8">
                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-100 w-fit min-w-50">
                        <h3 className="text-blue-800 text-sm font-semibold mb-1">Stock Actual</h3>
                        <div className="flex items-baseline gap-2">
                            <span className="text-4xl font-bold text-blue-900">{articulo.stock}</span>
                            <span className="text-blue-700 font-medium capitalize text-sm">{articulo.unidad_tipo}s</span>
                        </div>
                        <p className="text-[11px] text-blue-600 mt-1">
                            Disponible inmediato
                        </p>
                    </div>
                </div>
                </div>

                <div className="mt-auto pt-6 border-t border-gray-100">
                    <span className="text-gray-500 text-xs uppercase tracking-wider block mb-2">Descripción</span>
                    <p className="text-gray-900 text-base leading-relaxed">
                        {articulo.descripcion || 'No hay una descripción detallada para este artículo.'}
                    </p>
                </div>
            </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6 mt-8">
        <div className="flex justify-between items-center mb-6">
            <Button
            variant="primary"
            onClick={() => setOpenMovimientoModal(true)}
            >
            Registrar movimiento
            </Button>

            <h2 className="text-lg font-semibold text-gray-900">Historial de Movimientos</h2>
            <div className="text-sm text-gray-500">
                {movimientos.length} registros
            </div>
        </div>

        {movimientosLoading && (
             <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
             </div>
        )}

        {!movimientosLoading && movimientos.length === 0 && (
             <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-100">
                <p className="text-gray-500">Este artículo no tiene movimientos registrados aún.</p>
             </div>
        )}

        {!movimientosLoading && movimientos.length > 0 && (
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-gray-200 bg-gray-50">
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuario</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Motivo</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Detalle</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                        {movimientos.map((mov, idx) => (
                            <tr key={idx} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <Badge variant="primary" className={getMovimientoBadgeColor(mov.tipoMovimiento)}>
                                        {mov.tipoMovimiento.toUpperCase()}
                                    </Badge>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                    {new Date(mov.fecha).toLocaleString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                                    {mov.dniUsuario}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                    {mov.motivo}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600">
                                    {mov.detalle}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )}
        {openMovimientoModal && articulo && (
            <CreateMovimientoModal
                codArticulo={articulo.cod}
                onClose={() => setOpenMovimientoModal(false)}
                onSuccess={refetchAllData}
            />
            )}

      </div>

    </div>
  );
};

export default ArticuloDetallesPage;