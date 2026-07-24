import { useState } from 'react';
import PersonalDocumentacionForm from '../components/PersonalDocumentacionForm';

type Vista =
  | 'agregar-doc'
  | 'listado-doc'
  | 'historial-doc'
  | 'agregar-registro'
  | 'listado-registro'
  | 'historial-registro';

const DocumentacionPersonalPage = () => {
  const [vista, setVista] = useState<Vista>('agregar-doc');

  const handleGuardarDocumentacion = async (data: any) => {
    console.log('Documentación a guardar:', data);
    // TODO: conectar con el backend (NestJS) cuando esté listo
    setVista('listado-doc');
  };

  const botones: { key: Vista; label: string }[] = [
    { key: 'agregar-doc', label: 'Agregar Documentación Personal' },
    { key: 'listado-doc', label: 'Listado Documentación Personal' },
    { key: 'historial-doc', label: 'Historial Documentación Personal' },
    { key: 'agregar-registro', label: 'Agregar Registro Administrativo' },
    { key: 'listado-registro', label: 'Listado Registro Administrativo' },
    { key: 'historial-registro', label: 'Historial Registro Administrativo' },
  ];

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Listado Personal de la Dirección Vial</h1>

        <div className="flex flex-nowrap gap-3 mt-4 overflow-x-auto pb-2">
          {botones.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setVista(key)}
              className={`px-5 py-2 rounded-lg text-white font-medium transition-colors whitespace-nowrap ${
                vista === key ? 'bg-[#0062e3]' : 'bg-gray-400 hover:bg-gray-500'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {vista === 'agregar-doc' && (
        <PersonalDocumentacionForm
          onCancel={() => setVista('listado-doc')}
          onSubmit={handleGuardarDocumentacion}
        />
      )}
      {vista === 'listado-doc' && (
        <div className="bg-white rounded-xl shadow border border-gray-200 p-6 text-gray-400 text-sm">
          Documentación personal — sección en construcción.
        </div>
      )}
      {vista === 'historial-doc' && (
        <div className="bg-white rounded-xl shadow border border-gray-200 p-6 text-gray-400 text-sm">
          Historial de documentación personal — sección en construcción.
        </div>
      )}
      {vista === 'agregar-registro' && (
        <div className="bg-white rounded-xl shadow border border-gray-200 p-6 text-gray-400 text-sm">
          Agregar registro administrativo — sección en construcción.
        </div>
      )}
      {vista === 'listado-registro' && (
        <div className="bg-white rounded-xl shadow border border-gray-200 p-6 text-gray-400 text-sm">
          Registro administrativo — sección en construcción.
        </div>
      )}
      {vista === 'historial-registro' && (
        <div className="bg-white rounded-xl shadow border border-gray-200 p-6 text-gray-400 text-sm">
          Historial de registro administrativo — sección en construcción.
        </div>
      )}
    </div>
  );
};

export default DocumentacionPersonalPage;
