import { useState } from 'react';
import PersonalDocumentacionForm, {
  type PersonalDocumentacionFormData,
} from '../components/PersonalDocumentacionForm';
import ListadoDocumentacionPersonal from '../components/ListadoDocumentacionPersonal';
import HistorialDocumentacionPersonal from '../components/HistorialDocumentacionPersonal';
import RegistroAdministrativoForm, {
  type RegistroAdministrativoFormData,
} from '../components/RegistroAdministrativoForm';
import ListadoRegistroAdministrativo from '../components/ListadoRegistroAdministrativo';
import HistorialRegistroAdministrativo from '../components/HistorialRegistroAdministrativo';

type Vista =
  | 'agregar-doc'
  | 'listado-doc'
  | 'historial-doc'
  | 'agregar-registro'
  | 'listado-registro'
  | 'historial-registro';

const DocumentacionPersonalPage = () => {
  const [vista, setVista] = useState<Vista>('agregar-doc');
  const [registros, setRegistros] = useState<PersonalDocumentacionFormData[]>([]);
  const [registrosAdministrativos, setRegistrosAdministrativos] = useState<
    RegistroAdministrativoFormData[]
  >([]);

  const handleGuardarDocumentacion = async (data: PersonalDocumentacionFormData) => {
    // TODO: conectar con el backend (NestJS) cuando esté listo
    setRegistros((prev) => [...prev, data]);
    setVista('listado-doc');
  };

  const handleEliminarRegistro = (index: number) => {
    // TODO: conectar con el backend (NestJS) cuando esté listo
    setRegistros((prev) => prev.filter((_, i) => i !== index));
  };

  const handleGuardarRegistroAdministrativo = async (data: RegistroAdministrativoFormData) => {
    // TODO: conectar con el backend (NestJS) cuando esté listo
    setRegistrosAdministrativos((prev) => [...prev, data]);
    setVista('listado-registro');
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
        <ListadoDocumentacionPersonal
          registros={registros}
          onEliminar={handleEliminarRegistro}
        />
      )}
      {vista === 'historial-doc' && (
        <HistorialDocumentacionPersonal registros={registros} />
      )}
      {vista === 'agregar-registro' && (
        <RegistroAdministrativoForm
          onCancel={() => setVista('listado-registro')}
          onSubmit={handleGuardarRegistroAdministrativo}
        />
      )}
      {vista === 'listado-registro' && (
        <ListadoRegistroAdministrativo
          registros={registrosAdministrativos}
          onEliminar={(index) =>
            setRegistrosAdministrativos((prev) => prev.filter((_, i) => i !== index))
          }
        />
      )}
      {vista === 'historial-registro' && (
          <HistorialRegistroAdministrativo registros={registrosAdministrativos} />
      )}
    </div>
  );
};

export default DocumentacionPersonalPage;
