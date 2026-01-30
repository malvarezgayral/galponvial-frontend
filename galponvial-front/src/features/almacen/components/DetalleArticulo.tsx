import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import type { Articulo, Movimiento } from '../types';
import { almacenService } from '../services/almacenService';

export const DetalleArticulo: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams<{ id: string }>(); 
  const [articulo, setArticulo] = useState<Articulo | undefined>(location.state?.articulo);
  const [movimientos, setMovimientos] = useState<Movimiento[]>([]);
  const [loadingArticulo, setLoadingArticulo] = useState(!articulo); 
  const [loadingMovimientos, setLoadingMovimientos] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      navigate('/almacen');
      return;
    }

    const fetchDatos = async () => {
      try {
        const articuloId = Number(id);

        if (!articulo) {
          setLoadingArticulo(true);
          try {
            const artData = await almacenService.getArticuloById(articuloId);
            setArticulo(artData);
          } catch (err) {
            console.error("Error cargando artículo:", err);
            setError("No se pudo cargar la información del artículo.");
            return;
          } finally {
            setLoadingArticulo(false);
          }
        }

        setLoadingMovimientos(true);
        try {
          const movData = await almacenService.getMovimientos(articuloId);
          setMovimientos(movData);
        } catch (err) {
          console.error("Error cargando movimientos:", err);
        } finally {
          setLoadingMovimientos(false);
        }

      } catch (err) {
        console.error("Error general:", err);
        setError("Ocurrió un error inesperado.");
      }
    };

    fetchDatos();
  }, [id, navigate, articulo]); 

  if (error) {
    return (
        <div className="p-8 text-center">
            <p className="text-red-500 mb-4">{error}</p>
            <button onClick={() => navigate('/almacen')} className="text-blue-600 hover:underline">
                Volver al almacén
            </button>
        </div>
    );
  }

  if (loadingArticulo && !articulo) {
    return (
        <div className="flex justify-center items-center h-64">
             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
    );
  }

  if (!articulo) return null;

  return (
    <div className="space-y-6 animate-fadeIn pb-10">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-full hover:bg-gray-200 text-gray-600 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <h1 className="text-2xl font-bold text-gray-800">Detalle del Artículo</h1>
      </div>

      {/* Tarjeta Artículo */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
        <div className="p-6 border-b border-gray-100 bg-gray-50/50">
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-xl font-bold text-gray-900">{articulo.nombre}</h2>
                    <p className="text-sm text-gray-500 mt-1">
                        Código: <span className="font-mono font-medium">{articulo.cod || articulo.cod_proveedor}</span>
                    </p>
                </div>
                <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    {articulo.unidad_tipo || 'Unidad'}
                </div>
            </div>
        </div>
        
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Descripción</label>
                <p className="mt-1 text-gray-700">{articulo.descripcion || 'Sin descripción disponible.'}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Modelo</label>
                    <p className="mt-1 text-gray-700">{articulo.modelo || '-'}</p>
                </div>
            </div>
        </div>
      </div>

      {/* Tabla Movimientos */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h3 className="text-lg font-bold text-gray-800">Historial de Movimientos</h3>
            <span className="text-sm text-gray-500">
                {loadingMovimientos ? 'Actualizando...' : `${movimientos.length} registros`}
            </span>
        </div>

        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-gray-50 text-gray-600 text-sm border-b border-gray-200">
                        <th className="p-4 font-semibold">Tipo</th>
                        <th className="p-4 font-semibold">Fecha</th>
                        <th className="p-4 font-semibold">Usuario (DNI)</th>
                        <th className="p-4 font-semibold">Motivo</th>
                        <th className="p-4 font-semibold">Detalle</th>
                    </tr>
                </thead>
                <tbody className="text-sm text-gray-700">
                    {loadingMovimientos ? (
                        <tr>
                            <td colSpan={5} className="p-12 text-center text-gray-500">
                                <div className="flex flex-col justify-center items-center gap-3">
                                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                                    <span>Cargando historial...</span>
                                </div>
                            </td>
                        </tr>
                    ) : movimientos.length === 0 ? (
                        <tr>
                            <td colSpan={5} className="p-12 text-center text-gray-400 italic">
                                No hay movimientos registrados para este artículo.
                            </td>
                        </tr>
                    ) : (
                        movimientos.map((mov, index) => (
                            <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                <td className="p-4">
                                   <span className={`px-2 py-1 rounded-md text-xs font-bold ${
                                        (mov.tipoMovimiento === 'entrada')
                                            ? 'bg-green-100 text-green-700' 
                                            : 'bg-red-100 text-red-700'
                                    }`}>
                                        {mov.tipoMovimiento.toUpperCase()}
                                    </span>
                                </td>
                                <td className="p-4 text-gray-600">
                                    {new Date(mov.fecha).toLocaleDateString()} 
                                    <span className="text-gray-400 ml-2 text-xs">
                                        {new Date(mov.fecha).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                    </span>
                                </td>
                                <td className="p-4 font-mono text-gray-600">{mov.dniUsuario}</td>
                                <td className="p-4">{mov.motivo}</td>
                                <td className="p-4 text-gray-500">{mov.detalle}</td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};