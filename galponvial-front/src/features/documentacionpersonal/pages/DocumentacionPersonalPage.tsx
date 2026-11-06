import { useCallback, useEffect, useState } from 'react';
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
import { useAdminPermissions } from '../../usuarios/hooks/useAdminPermissions';
import {
  documentacionService,
  registroService,
  documentacionToForm,
  registroToForm,
  type DocumentacionPersonalDto,
  type RegistroAdministrativoDto,
  archivosPersonalService,
  type ArchivoPersonalDto,
  type TipoArchivoPersonal,
} from '../services/personalService';

type Vista =
  | 'agregar-doc'
  | 'listado-doc'
  | 'historial-doc'
  | 'agregar-registro'
  | 'listado-registro'
  | 'historial-registro';

const mensajeError = (e: unknown): string => {
  const m = (e as { response?: { data?: { message?: string | string[] } } })
    ?.response?.data?.message;
  if (Array.isArray(m)) return m.join('. ');
  if (typeof m === 'string') return m;
  return 'No se pudo completar la operación. Intentá de nuevo.';
};

const DocumentacionPersonalPage = () => {
  const { canWritePersonal } = useAdminPermissions();
  const puedeEscribir = canWritePersonal();

  const [vista, setVista] = useState<Vista>(
    puedeEscribir ? 'agregar-doc' : 'listado-doc'
  );
  const [docs, setDocs] = useState<DocumentacionPersonalDto[]>([]);
  const [regs, setRegs] = useState<RegistroAdministrativoDto[]>([]);
  const [archivos, setArchivos] = useState<ArchivoPersonalDto[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cargar = useCallback(async () => {
    try {
      const [d, r, a] = await Promise.all([
        documentacionService.getAll(),
        registroService.getAll(),
        archivosPersonalService.listar().catch(() => [] as ArchivoPersonalDto[]),
      ]);
      setDocs(d);
      setRegs(r);
      setArchivos(a);
    } catch (e) {
      setError(mensajeError(e));
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const pendientesDeForm = (
    d: PersonalDocumentacionFormData
  ): { tipo: TipoArchivoPersonal; file: File }[] => [
    ...(d.fotoDni ? [{ tipo: 'dni' as const, file: d.fotoDni }] : []),
    ...(d.archivoCuil ? [{ tipo: 'cuil' as const, file: d.archivoCuil }] : []),
    ...d.historialAcademico.certificados.map((file) => ({ tipo: 'certificado' as const, file })),
  ];

  // Sube los archivos de a uno; devuelve los que fallaron (nombre y motivo)
  const subirArchivos = async (
    id: number | undefined,
    pendientes: { tipo: TipoArchivoPersonal; file: File }[]
  ): Promise<string[]> => {
    if (id === undefined) return pendientes.map((p) => p.file.name);
    const fallidos: string[] = [];
    for (const p of pendientes) {
      try {
        await archivosPersonalService.subir(id, p.tipo, p.file);
      } catch (e) {
        fallidos.push(`${p.file.name} (${mensajeError(e)})`);
      }
    }
    return fallidos;
  };

  const handleAbrirArchivo = async (archivoId: number) => {
    setError(null);
    try {
      await archivosPersonalService.abrir(archivoId);
    } catch (e) {
      setError(mensajeError(e));
    }
  };

  const handleSubirArchivo = async (index: number, tipo: TipoArchivoPersonal, file: File) => {
    setError(null);
    const fallidos = await subirArchivos(docs[index]?.id, [{ tipo, file }]);
    if (fallidos.length > 0) setError(`No se pudo subir: ${fallidos.join('; ')}`);
    await cargar();
  };

  const handleEliminarArchivo = async (archivoId: number) => {
    setError(null);
    try {
      await archivosPersonalService.eliminar(archivoId);
    } catch (e) {
      setError(mensajeError(e));
    }
    await cargar();
  };

  const handleGuardarDocumentacion = async (data: PersonalDocumentacionFormData) => {
    setError(null);
    try {
      const creado = await documentacionService.create(data);
      const fallidos = await subirArchivos(creado.id, pendientesDeForm(data));
      await cargar();
      setVista('listado-doc');
      if (fallidos.length > 0) {
        setError(
          `Se guardó la documentación, pero no se pudieron subir estos archivos: ${fallidos.join('; ')}`
        );
      }
    } catch (e) {
      setError(mensajeError(e));
    }
  };

  const handleEditarDocumentacion = async (
    index: number,
    data: PersonalDocumentacionFormData
  ) => {
    setError(null);
    const id = docs[index]?.id;
    if (id === undefined) return;
    try {
      await documentacionService.update(id, data);
    } catch (e) {
      setError(mensajeError(e));
    }
    await cargar();
  };

  const handleEliminarDocumentacion = async (index: number) => {
    setError(null);
    const id = docs[index]?.id;
    if (id === undefined) return;
    try {
      await documentacionService.remove(id);
    } catch (e) {
      setError(mensajeError(e));
    }
    await cargar();
  };

  const handleGuardarRegistro = async (data: RegistroAdministrativoFormData) => {
    setError(null);
    try {
      await registroService.create(data);
      await cargar();
      setVista('listado-registro');
    } catch (e) {
      setError(mensajeError(e));
    }
  };

  const handleEditarRegistro = async (
    index: number,
    data: RegistroAdministrativoFormData
  ) => {
    setError(null);
    const id = regs[index]?.id;
    if (id === undefined) return;
    try {
      await registroService.update(id, data);
    } catch (e) {
      setError(mensajeError(e));
    }
    await cargar();
  };

  const handleEliminarRegistro = async (index: number) => {
    setError(null);
    const id = regs[index]?.id;
    if (id === undefined) return;
    try {
      await registroService.remove(id);
    } catch (e) {
      setError(mensajeError(e));
    }
    await cargar();
  };

  const todosLosBotones: { key: Vista; label: string; escritura?: boolean }[] = [
    { key: 'agregar-doc', label: 'Agregar Documentación Personal', escritura: true },
    { key: 'listado-doc', label: 'Listado Documentación Personal' },
    { key: 'historial-doc', label: 'Historial Documentación Personal' },
    { key: 'agregar-registro', label: 'Agregar Registro Administrativo', escritura: true },
    { key: 'listado-registro', label: 'Listado Registro Administrativo' },
    { key: 'historial-registro', label: 'Historial Registro Administrativo' },
  ];
  const botones = todosLosBotones.filter((b) => !b.escritura || puedeEscribir);

  const docsForm = docs.map(documentacionToForm);
  const regsForm = regs.map(registroToForm);

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

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
          {error}
        </div>
      )}

      {cargando && <p className="text-sm text-gray-500">Cargando...</p>}

      {vista === 'agregar-doc' && puedeEscribir && (
        <PersonalDocumentacionForm
          onCancel={() => setVista('listado-doc')}
          onSubmit={handleGuardarDocumentacion}
        />
      )}
      {vista === 'listado-doc' && (
        <ListadoDocumentacionPersonal
          registros={docsForm}
          archivosPorFila={docs.map((d) => archivos.filter((x) => x.documentacionId === d.id))}
          onAbrirArchivo={handleAbrirArchivo}
          onSubirArchivo={puedeEscribir ? handleSubirArchivo : undefined}
          onEliminarArchivo={puedeEscribir ? handleEliminarArchivo : undefined}
          onEliminar={handleEliminarDocumentacion}
          onEditar={handleEditarDocumentacion}
        />
      )}
      {vista === 'historial-doc' && (
        <HistorialDocumentacionPersonal registros={docsForm} />
      )}
      {vista === 'agregar-registro' && puedeEscribir && (
        <RegistroAdministrativoForm
          onCancel={() => setVista('listado-registro')}
          onSubmit={handleGuardarRegistro}
        />
      )}
      {vista === 'listado-registro' && (
        <ListadoRegistroAdministrativo
          registros={regsForm}
          onEliminar={handleEliminarRegistro}
          onEditar={handleEditarRegistro}
        />
      )}
      {vista === 'historial-registro' && (
        <HistorialRegistroAdministrativo registros={regsForm} />
      )}
    </div>
  );
};

export default DocumentacionPersonalPage;
