import { useState } from 'react';
import type { PersonalDocumentacionFormData } from './PersonalDocumentacionForm';

interface ListadoDocumentacionPersonalProps {
  registros: PersonalDocumentacionFormData[];
  onEliminar: (index: number) => void;
  onEditar: (index: number, data: PersonalDocumentacionFormData) => void;
}

function Badge({ value }: { value: boolean }) {
  return (
    <span
      className={`text-xs font-medium px-2.5 py-1 rounded-md ${
        value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
      }`}
    >
      {value ? 'Sí' : 'No'}
    </span>
  );
}

const ESTUDIOS_ALCANZADOS_OPTIONS = ['Primario', 'Secundario', 'Terciario', 'Universitario'];

export default function ListadoDocumentacionPersonal({
  registros,
  onEliminar,
  onEditar,
}: ListadoDocumentacionPersonalProps) {
  const [filaEditando, setFilaEditando] = useState<number | null>(null);
  const [borrador, setBorrador] = useState<PersonalDocumentacionFormData | null>(null);

  if (registros.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow border border-gray-200 p-6 text-gray-400 text-sm">
        Todavía no hay documentación personal cargada.
      </div>
    );
  }

  const handleEliminar = (index: number, nombre: string, apellido: string) => {
    const confirmado = window.confirm(
      `¿Seguro que querés eliminar el registro de ${nombre} ${apellido}?`
    );
    if (confirmado) {
      onEliminar(index);
    }
  };

  const iniciarEdicion = (index: number) => {
    setFilaEditando(index);
    setBorrador({ ...registros[index] });
  };

  const cancelarEdicion = () => {
    setFilaEditando(null);
    setBorrador(null);
  };

  const guardarEdicion = () => {
    if (filaEditando !== null && borrador) {
      onEditar(filaEditando, borrador);
      setFilaEditando(null);
      setBorrador(null);
    }
  };

  const updateBorrador = <K extends keyof PersonalDocumentacionFormData>(
    field: K,
    value: PersonalDocumentacionFormData[K]
  ) => {
    setBorrador((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  const updateBorradorDomicilio = <K extends keyof PersonalDocumentacionFormData['domicilioActual']>(
    field: K,
    value: PersonalDocumentacionFormData['domicilioActual'][K]
  ) => {
    setBorrador((prev) =>
      prev ? { ...prev, domicilioActual: { ...prev.domicilioActual, [field]: value } } : prev
    );
  };

  const updateBorradorAcademico = <K extends keyof PersonalDocumentacionFormData['historialAcademico']>(
    field: K,
    value: PersonalDocumentacionFormData['historialAcademico'][K]
  ) => {
    setBorrador((prev) =>
      prev ? { ...prev, historialAcademico: { ...prev.historialAcademico, [field]: value } } : prev
    );
  };

  const updateBorradorSalud = <K extends keyof PersonalDocumentacionFormData['historialSalud']>(
    field: K,
    value: PersonalDocumentacionFormData['historialSalud'][K]
  ) => {
    setBorrador((prev) =>
      prev ? { ...prev, historialSalud: { ...prev.historialSalud, [field]: value } } : prev
    );
  };

  const inputClass =
    'border border-blue-300 rounded px-2 py-1 text-sm w-full min-w-[100px] bg-white';

  return (
    <div className="bg-white rounded-xl shadow border border-gray-200 overflow-x-auto">
      <table className="min-w-[1600px] w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            <th className="text-left px-3 py-2 font-medium text-gray-600 whitespace-nowrap">Nombre</th>
            <th className="text-left px-3 py-2 font-medium text-gray-600 whitespace-nowrap">Apellido</th>
            <th className="text-left px-3 py-2 font-medium text-gray-600 whitespace-nowrap">N° CUIL</th>
            <th className="text-left px-3 py-2 font-medium text-gray-600 whitespace-nowrap">N° DNI</th>
            <th className="text-left px-3 py-2 font-medium text-gray-600 whitespace-nowrap">Ciudad</th>
            <th className="text-left px-3 py-2 font-medium text-gray-600 whitespace-nowrap">Dirección</th>
            <th className="text-left px-3 py-2 font-medium text-gray-600 whitespace-nowrap">Piso</th>
            <th className="text-left px-3 py-2 font-medium text-gray-600 whitespace-nowrap">Teléfono</th>
            <th className="text-left px-3 py-2 font-medium text-gray-600 whitespace-nowrap">Estudios alcanzados</th>
            <th className="text-left px-3 py-2 font-medium text-gray-600 whitespace-nowrap">Título cargado</th>
            <th className="text-left px-3 py-2 font-medium text-gray-600 whitespace-nowrap">Preocupacional</th>
            <th className="text-left px-3 py-2 font-medium text-gray-600 whitespace-nowrap">Aptitud física</th>
            <th className="text-left px-3 py-2 font-medium text-gray-600 whitespace-nowrap">Exámenes médicos</th>
            <th className="text-left px-3 py-2 font-medium text-gray-600 whitespace-nowrap">Exámenes ART</th>
            <th className="text-right px-3 py-2 font-medium text-gray-600 whitespace-nowrap">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {registros.map((r, index) => {
            const editando = filaEditando === index && borrador !== null;
            const fila = editando ? borrador : r;

            return (
              <tr
                key={index}
                className={`border-b border-gray-100 last:border-0 ${
                  editando ? 'bg-blue-50' : ''
                }`}
              >
                <td className="px-3 py-2 whitespace-nowrap">
                  {editando ? (
                    <input
                      type="text"
                      value={fila.nombre}
                      onChange={(e) => updateBorrador('nombre', e.target.value)}
                      className={inputClass}
                    />
                  ) : (
                    r.nombre
                  )}
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  {editando ? (
                    <input
                      type="text"
                      value={fila.apellido}
                      onChange={(e) => updateBorrador('apellido', e.target.value)}
                      className={inputClass}
                    />
                  ) : (
                    r.apellido
                  )}
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  {editando ? (
                    <input
                      type="text"
                      value={fila.numeroCuil}
                      onChange={(e) => updateBorrador('numeroCuil', e.target.value)}
                      className={inputClass}
                    />
                  ) : (
                    r.numeroCuil
                  )}
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  {editando ? (
                    <input
                      type="text"
                      value={fila.numeroDocumento}
                      onChange={(e) => updateBorrador('numeroDocumento', e.target.value)}
                      className={inputClass}
                    />
                  ) : (
                    r.numeroDocumento
                  )}
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  {editando ? (
                    <input
                      type="text"
                      value={fila.domicilioActual.ciudad}
                      onChange={(e) => updateBorradorDomicilio('ciudad', e.target.value)}
                      className={inputClass}
                    />
                  ) : (
                    r.domicilioActual.ciudad
                  )}
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  {editando ? (
                    <div className="flex gap-1">
                      <input
                        type="text"
                        value={fila.domicilioActual.direccion}
                        onChange={(e) => updateBorradorDomicilio('direccion', e.target.value)}
                        className={inputClass}
                        placeholder="Dirección"
                      />
                      <input
                        type="text"
                        value={fila.domicilioActual.numero}
                        onChange={(e) => updateBorradorDomicilio('numero', e.target.value)}
                        className={`${inputClass} min-w-[60px] max-w-[70px]`}
                        placeholder="N°"
                      />
                    </div>
                  ) : (
                    `${r.domicilioActual.direccion} ${r.domicilioActual.numero}`
                  )}
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  {editando ? (
                    <input
                      type="text"
                      value={fila.domicilioActual.piso}
                      onChange={(e) => updateBorradorDomicilio('piso', e.target.value)}
                      className={inputClass}
                    />
                  ) : (
                    r.domicilioActual.piso
                  )}
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  {editando ? (
                    <input
                      type="text"
                      value={fila.domicilioActual.telefonoContacto}
                      onChange={(e) => updateBorradorDomicilio('telefonoContacto', e.target.value)}
                      className={inputClass}
                    />
                  ) : (
                    r.domicilioActual.telefonoContacto
                  )}
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  {editando ? (
                    <select
                      value={fila.historialAcademico.estudiosAlcanzados}
                      onChange={(e) => updateBorradorAcademico('estudiosAlcanzados', e.target.value)}
                      className={inputClass}
                    >
                      <option value="">Seleccionar...</option>
                      {ESTUDIOS_ALCANZADOS_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  ) : (
                    r.historialAcademico.estudiosAlcanzados || '—'
                  )}
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  {editando ? (
                    <input
                      type="text"
                      value={fila.historialAcademico.titulo}
                      onChange={(e) => updateBorradorAcademico('titulo', e.target.value)}
                      className={inputClass}
                    />
                  ) : (
                    <Badge value={Boolean(r.historialAcademico.titulo)} />
                  )}
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  {editando ? (
                    <input
                      type="text"
                      value={fila.historialSalud.preocupacional}
                      onChange={(e) => updateBorradorSalud('preocupacional', e.target.value)}
                      className={inputClass}
                    />
                  ) : (
                    <Badge value={Boolean(r.historialSalud.preocupacional)} />
                  )}
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  {editando ? (
                    <input
                      type="text"
                      value={fila.historialSalud.constanciaAptitudFisica}
                      onChange={(e) => updateBorradorSalud('constanciaAptitudFisica', e.target.value)}
                      className={inputClass}
                    />
                  ) : (
                    <Badge value={Boolean(r.historialSalud.constanciaAptitudFisica)} />
                  )}
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  {editando ? (
                    <input
                      type="text"
                      value={fila.historialSalud.examenesMedicos}
                      onChange={(e) => updateBorradorSalud('examenesMedicos', e.target.value)}
                      className={inputClass}
                    />
                  ) : (
                    <Badge value={Boolean(r.historialSalud.examenesMedicos)} />
                  )}
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  {editando ? (
                    <input
                      type="text"
                      value={fila.historialSalud.examenesMedicosArt}
                      onChange={(e) => updateBorradorSalud('examenesMedicosArt', e.target.value)}
                      className={inputClass}
                    />
                  ) : (
                    <Badge value={Boolean(r.historialSalud.examenesMedicosArt)} />
                  )}
                </td>
                <td className="px-3 py-2 whitespace-nowrap text-right">
                  <div className="flex justify-end gap-2">
                    {editando ? (
                      <>
                        <button
                          type="button"
                          onClick={guardarEdicion}
                          className="text-white bg-blue-600 hover:bg-blue-700 text-sm font-medium rounded px-3 py-1 transition-colors"
                        >
                          Guardar
                        </button>
                        <button
                          type="button"
                          onClick={cancelarEdicion}
                          className="text-gray-600 hover:text-gray-800 text-sm font-medium border border-gray-300 rounded px-3 py-1 hover:bg-gray-50 transition-colors"
                        >
                          Cancelar
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={() => iniciarEdicion(index)}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium border border-blue-200 rounded px-3 py-1 hover:bg-blue-50 transition-colors"
                        >
                          Editar
                        </button>
                        <button
                          type="button"
                          onClick={() => handleEliminar(index, r.nombre, r.apellido)}
                          className="text-red-600 hover:text-red-800 text-sm font-medium border border-red-200 rounded px-3 py-1 hover:bg-red-50 transition-colors"
                        >
                          Eliminar
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
