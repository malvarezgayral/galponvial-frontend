import { useState } from 'react';
import { FileInput, type RegistroAdministrativoFormData } from './RegistroAdministrativoForm';

interface ListadoRegistroAdministrativoProps {
  registros: RegistroAdministrativoFormData[];
  onEliminar: (index: number) => void;
  onEditar: (index: number, data: RegistroAdministrativoFormData) => void;
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

type SituacionRevista = RegistroAdministrativoFormData['situacionRevista'];
type SituacionRevistaKey = keyof SituacionRevista;

const SITUACION_OPTIONS: { key: SituacionRevistaKey; label: string; hasHasta?: boolean }[] = [
  { key: 'plantaPermanenteDesde', label: 'Planta permanente' },
  { key: 'temporarioMensualizadoDesde', label: 'Temporario (mensualizado)' },
  { key: 'destajistaDesde', label: 'Destajista' },
  { key: 'planesEmpleoDesde', label: 'Planes de empleo' },
  { key: 'cooperativaDesde', label: 'Cooperativa' },
  { key: 'cargoTemporarioDesde', label: 'Cargo temporario', hasHasta: true },
];

function situacionRevistaLabel(r: RegistroAdministrativoFormData): string {
  const s = r.situacionRevista;
  const encontrada = SITUACION_OPTIONS.find((opt) => s[opt.key]);
  return encontrada ? encontrada.label : '—';
}

function getSituacionKeyActual(s: SituacionRevista): SituacionRevistaKey {
  return SITUACION_OPTIONS.find((opt) => s[opt.key])?.key ?? SITUACION_OPTIONS[0].key;
}

function formatPeriodo(desde: string, hasta: string): string {
  if (!desde && !hasta) return '—';
  return `${desde || '—'} a ${hasta || '—'}`;
}

const ESTUDIOS_OPTIONS = ['Primario', 'Secundario', 'Terciario', 'Universitario'];
const TIPO_DNI_OPTIONS = ['DNI', 'LC', 'LE'];

export default function ListadoRegistroAdministrativo({
  registros,
  onEliminar,
  onEditar,
}: ListadoRegistroAdministrativoProps) {
  const [filaEditando, setFilaEditando] = useState<number | null>(null);
  const [borrador, setBorrador] = useState<RegistroAdministrativoFormData | null>(null);

  if (registros.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow border border-gray-200 p-6 text-gray-400 text-sm">
        Todavía no hay registros administrativos cargados.
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

  const updateBorrador = <K extends keyof RegistroAdministrativoFormData>(
    field: K,
    value: RegistroAdministrativoFormData[K]
  ) => {
    setBorrador((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  const updateBorradorAcademicoSalud = <K extends keyof RegistroAdministrativoFormData['historialAcademicoSalud']>(
    field: K,
    value: RegistroAdministrativoFormData['historialAcademicoSalud'][K]
  ) => {
    setBorrador((prev) =>
      prev
        ? { ...prev, historialAcademicoSalud: { ...prev.historialAcademicoSalud, [field]: value } }
        : prev
    );
  };

  const updateBorradorLicenciaAnual = <K extends keyof RegistroAdministrativoFormData['licenciaAnual']>(
    field: K,
    value: RegistroAdministrativoFormData['licenciaAnual'][K]
  ) => {
    setBorrador((prev) =>
      prev ? { ...prev, licenciaAnual: { ...prev.licenciaAnual, [field]: value } } : prev
    );
  };

  const updateBorradorLicenciaConducir = <K extends keyof RegistroAdministrativoFormData['licenciaConducir']>(
    field: K,
    value: RegistroAdministrativoFormData['licenciaConducir'][K]
  ) => {
    setBorrador((prev) =>
      prev ? { ...prev, licenciaConducir: { ...prev.licenciaConducir, [field]: value } } : prev
    );
  };

  const updateBorradorSituacionTipo = (nuevaKey: SituacionRevistaKey) => {
    setBorrador((prev) => {
      if (!prev) return prev;
      const limpia: SituacionRevista = {
        plantaPermanenteDesde: '',
        temporarioMensualizadoDesde: '',
        destajistaDesde: '',
        planesEmpleoDesde: '',
        cooperativaDesde: '',
        cargoTemporarioDesde: '',
        cargoTemporarioHasta: '',
      };
      return {
        ...prev,
        situacionRevista: { ...limpia, [nuevaKey]: prev.situacionRevista[nuevaKey] || '' },
      };
    });
  };

  const updateBorradorSituacionFecha = <K extends SituacionRevistaKey>(field: K, value: string) => {
    setBorrador((prev) =>
      prev ? { ...prev, situacionRevista: { ...prev.situacionRevista, [field]: value } } : prev
    );
  };

  const inputClass =
    'border border-blue-300 rounded px-2 py-1 text-sm w-full min-w-[100px] bg-white';

  return (
    <div className="bg-white rounded-xl shadow border border-gray-200 overflow-x-auto">
      <table className="min-w-[2800px] w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            <th className="text-left px-3 py-2 font-medium text-gray-600 whitespace-nowrap">Nombre</th>
            <th className="text-left px-3 py-2 font-medium text-gray-600 whitespace-nowrap">Apellido</th>
            <th className="text-left px-3 py-2 font-medium text-gray-600 whitespace-nowrap">Legajo</th>
            <th className="text-left px-3 py-2 font-medium text-gray-600 whitespace-nowrap">Categoría actual</th>
            <th className="text-left px-3 py-2 font-medium text-gray-600 whitespace-nowrap">Tipo DNI</th>
            <th className="text-left px-3 py-2 font-medium text-gray-600 whitespace-nowrap">Número DNI</th>
            <th className="text-left px-3 py-2 font-medium text-gray-600 whitespace-nowrap">Número CUIL</th>
            <th className="text-left px-3 py-2 font-medium text-gray-600 whitespace-nowrap">Secretaría a cargo</th>
            <th className="text-left px-3 py-2 font-medium text-gray-600 whitespace-nowrap">Dirección a cargo</th>
            <th className="text-left px-3 py-2 font-medium text-gray-600 whitespace-nowrap">Tipo de cargo</th>
            <th className="text-left px-3 py-2 font-medium text-gray-600 whitespace-nowrap">Área específica</th>
            <th className="text-left px-3 py-2 font-medium text-gray-600 whitespace-nowrap">Antigüedad</th>
            <th className="text-left px-3 py-2 font-medium text-gray-600 whitespace-nowrap">Fecha de ingreso</th>
            <th className="text-left px-3 py-2 font-medium text-gray-600 whitespace-nowrap">Estudios alcanzados</th>
            <th className="text-left px-3 py-2 font-medium text-gray-600 whitespace-nowrap">Título</th>
            <th className="text-left px-3 py-2 font-medium text-gray-600 whitespace-nowrap">Certificaciones</th>
            <th className="text-left px-3 py-2 font-medium text-gray-600 whitespace-nowrap">Aptitud física</th>
            <th className="text-left px-3 py-2 font-medium text-gray-600 whitespace-nowrap">Acto administrativo</th>
            <th className="text-left px-3 py-2 font-medium text-gray-600 whitespace-nowrap">Lic. anual — período</th>
            <th className="text-left px-3 py-2 font-medium text-gray-600 whitespace-nowrap">Lic. anual — días</th>
            <th className="text-left px-3 py-2 font-medium text-gray-600 whitespace-nowrap">Lic. anual — asunto</th>
            <th className="text-left px-3 py-2 font-medium text-gray-600 whitespace-nowrap">Observaciones</th>
            <th className="text-left px-3 py-2 font-medium text-gray-600 whitespace-nowrap">Comprobante licencia</th>
            <th className="text-left px-3 py-2 font-medium text-gray-600 whitespace-nowrap">Lic. conducir — categoría</th>
            <th className="text-left px-3 py-2 font-medium text-gray-600 whitespace-nowrap">Lic. conducir — período</th>
            <th className="text-left px-3 py-2 font-medium text-gray-600 whitespace-nowrap">Comprobante conducir</th>
            <th className="text-left px-3 py-2 font-medium text-gray-600 whitespace-nowrap">Unidad a cargo — desde</th>
            <th className="text-left px-3 py-2 font-medium text-gray-600 whitespace-nowrap">Situación de revista</th>
            <th className="text-right px-3 py-2 font-medium text-gray-600 whitespace-nowrap">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {registros.map((r, index) => {
            const editando = filaEditando === index && borrador !== null;
            const fila = editando ? borrador : r;
            const situacionKeyActual = editando ? getSituacionKeyActual(fila.situacionRevista) : null;
            const situacionOptActual = situacionKeyActual
              ? SITUACION_OPTIONS.find((opt) => opt.key === situacionKeyActual)
              : null;

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
                      value={fila.legajo}
                      onChange={(e) => updateBorrador('legajo', e.target.value)}
                      className={inputClass}
                    />
                  ) : (
                    r.legajo || '—'
                  )}
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  {editando ? (
                    <input
                      type="text"
                      value={fila.categoriaActual}
                      onChange={(e) => updateBorrador('categoriaActual', e.target.value)}
                      className={inputClass}
                    />
                  ) : (
                    r.categoriaActual || '—'
                  )}
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  {editando ? (
                    <select
                      value={fila.tipoDni}
                      onChange={(e) => updateBorrador('tipoDni', e.target.value)}
                      className={inputClass}
                    >
                      <option value="">Seleccionar...</option>
                      {TIPO_DNI_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  ) : (
                    r.tipoDni || '—'
                  )}
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  {editando ? (
                    <input
                      type="text"
                      value={fila.numeroDni}
                      onChange={(e) => updateBorrador('numeroDni', e.target.value)}
                      className={inputClass}
                    />
                  ) : (
                    r.numeroDni || '—'
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
                    r.numeroCuil || '—'
                  )}
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  {editando ? (
                    <input
                      type="text"
                      value={fila.secretariaACargo}
                      onChange={(e) => updateBorrador('secretariaACargo', e.target.value)}
                      className={inputClass}
                    />
                  ) : (
                    r.secretariaACargo || '—'
                  )}
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  {editando ? (
                    <input
                      type="text"
                      value={fila.direccionACargo}
                      onChange={(e) => updateBorrador('direccionACargo', e.target.value)}
                      className={inputClass}
                    />
                  ) : (
                    r.direccionACargo || '—'
                  )}
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  {editando ? (
                    <input
                      type="text"
                      value={fila.tipoCargo}
                      onChange={(e) => updateBorrador('tipoCargo', e.target.value)}
                      className={inputClass}
                    />
                  ) : (
                    r.tipoCargo || '—'
                  )}
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  {editando ? (
                    <input
                      type="text"
                      value={fila.areaEspecifica}
                      onChange={(e) => updateBorrador('areaEspecifica', e.target.value)}
                      className={inputClass}
                    />
                  ) : (
                    r.areaEspecifica || '—'
                  )}
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  {editando ? (
                    <input
                      type="text"
                      value={fila.antiguedad}
                      onChange={(e) => updateBorrador('antiguedad', e.target.value)}
                      className={inputClass}
                    />
                  ) : (
                    r.antiguedad || '—'
                  )}
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  {editando ? (
                    <input
                      type="date"
                      value={fila.fechaIngreso}
                      onChange={(e) => updateBorrador('fechaIngreso', e.target.value)}
                      className={inputClass}
                    />
                  ) : (
                    r.fechaIngreso || '—'
                  )}
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  {editando ? (
                    <select
                      value={fila.historialAcademicoSalud.estudiosAlcanzados}
                      onChange={(e) => updateBorradorAcademicoSalud('estudiosAlcanzados', e.target.value)}
                      className={inputClass}
                    >
                      <option value="">Seleccionar...</option>
                      {ESTUDIOS_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  ) : (
                    r.historialAcademicoSalud.estudiosAlcanzados || '—'
                  )}
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  {editando ? (
                    <input
                      type="text"
                      value={fila.historialAcademicoSalud.titulo}
                      onChange={(e) => updateBorradorAcademicoSalud('titulo', e.target.value)}
                      className={inputClass}
                    />
                  ) : (
                    r.historialAcademicoSalud.titulo || '—'
                  )}
                </td>
                <td className="px-3 py-2 align-top" style={editando ? { minWidth: 220 } : undefined}>
                  {editando ? (
                    <FileInput
                      label="Certificaciones"
                      files={fila.historialAcademicoSalud.certificaciones}
                      onChange={(files) => updateBorradorAcademicoSalud('certificaciones', files)}
                    />
                  ) : (
                    <Badge value={r.historialAcademicoSalud.certificaciones.length > 0} />
                  )}
                </td>
                <td className="px-3 py-2 align-top" style={editando ? { minWidth: 220 } : undefined}>
                  {editando ? (
                    <FileInput
                      label="Aptitud física"
                      files={fila.historialAcademicoSalud.aptitudFisicaExamenes}
                      onChange={(files) => updateBorradorAcademicoSalud('aptitudFisicaExamenes', files)}
                    />
                  ) : (
                    <Badge value={r.historialAcademicoSalud.aptitudFisicaExamenes.length > 0} />
                  )}
                </td>
                <td className="px-3 py-2 align-top" style={editando ? { minWidth: 220 } : undefined}>
                  {editando ? (
                    <FileInput
                      label="Acto administrativo"
                      files={fila.historialAcademicoSalud.actoAdministrativo}
                      onChange={(files) => updateBorradorAcademicoSalud('actoAdministrativo', files)}
                    />
                  ) : (
                    <Badge value={r.historialAcademicoSalud.actoAdministrativo.length > 0} />
                  )}
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  {editando ? (
                    <div className="flex gap-1">
                      <input
                        type="date"
                        value={fila.licenciaAnual.periodoDesde}
                        onChange={(e) => updateBorradorLicenciaAnual('periodoDesde', e.target.value)}
                        className={inputClass}
                      />
                      <input
                        type="date"
                        value={fila.licenciaAnual.periodoHasta}
                        onChange={(e) => updateBorradorLicenciaAnual('periodoHasta', e.target.value)}
                        className={inputClass}
                      />
                    </div>
                  ) : (
                    formatPeriodo(r.licenciaAnual.periodoDesde, r.licenciaAnual.periodoHasta)
                  )}
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  {editando ? (
                    <input
                      type="text"
                      value={fila.licenciaAnual.dias}
                      onChange={(e) => updateBorradorLicenciaAnual('dias', e.target.value)}
                      className={inputClass}
                    />
                  ) : (
                    r.licenciaAnual.dias || '—'
                  )}
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  {editando ? (
                    <input
                      type="text"
                      value={fila.licenciaAnual.asunto}
                      onChange={(e) => updateBorradorLicenciaAnual('asunto', e.target.value)}
                      className={inputClass}
                    />
                  ) : (
                    r.licenciaAnual.asunto || '—'
                  )}
                </td>
                <td
                  className={editando ? 'px-3 py-2' : 'px-3 py-2 whitespace-nowrap max-w-[240px] truncate'}
                  title={editando ? undefined : r.licenciaAnual.observaciones}
                >
                  {editando ? (
                    <input
                      type="text"
                      value={fila.licenciaAnual.observaciones}
                      onChange={(e) => updateBorradorLicenciaAnual('observaciones', e.target.value)}
                      className={inputClass}
                    />
                  ) : (
                    r.licenciaAnual.observaciones || '—'
                  )}
                </td>
                <td className="px-3 py-2 align-top" style={editando ? { minWidth: 220 } : undefined}>
                  {editando ? (
                    <FileInput
                      label="Comprobante licencia"
                      files={fila.licenciaAnual.comprobante}
                      onChange={(files) => updateBorradorLicenciaAnual('comprobante', files)}
                    />
                  ) : (
                    <Badge value={r.licenciaAnual.comprobante.length > 0} />
                  )}
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  {editando ? (
                    <input
                      type="text"
                      value={fila.licenciaConducir.categoria}
                      onChange={(e) => updateBorradorLicenciaConducir('categoria', e.target.value)}
                      className={inputClass}
                    />
                  ) : (
                    r.licenciaConducir.categoria || '—'
                  )}
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  {editando ? (
                    <div className="flex gap-1">
                      <input
                        type="date"
                        value={fila.licenciaConducir.periodoDesde}
                        onChange={(e) => updateBorradorLicenciaConducir('periodoDesde', e.target.value)}
                        className={inputClass}
                      />
                      <input
                        type="date"
                        value={fila.licenciaConducir.periodoHasta}
                        onChange={(e) => updateBorradorLicenciaConducir('periodoHasta', e.target.value)}
                        className={inputClass}
                      />
                    </div>
                  ) : (
                    formatPeriodo(r.licenciaConducir.periodoDesde, r.licenciaConducir.periodoHasta)
                  )}
                </td>
                <td className="px-3 py-2 align-top" style={editando ? { minWidth: 220 } : undefined}>
                  {editando ? (
                    <FileInput
                      label="Comprobante conducir"
                      files={fila.licenciaConducir.comprobante}
                      onChange={(files) => updateBorradorLicenciaConducir('comprobante', files)}
                    />
                  ) : (
                    <Badge value={r.licenciaConducir.comprobante.length > 0} />
                  )}
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  {editando ? (
                    <input
                      type="date"
                      value={fila.unidadACargoDesde}
                      onChange={(e) => updateBorrador('unidadACargoDesde', e.target.value)}
                      className={inputClass}
                    />
                  ) : (
                    r.unidadACargoDesde || '—'
                  )}
                </td>
                <td className="px-3 py-2 align-top" style={editando ? { minWidth: 170 } : undefined}>
                  {editando && situacionKeyActual ? (
                    <div className="flex flex-col gap-1">
                      <select
                        value={situacionKeyActual}
                        onChange={(e) =>
                          updateBorradorSituacionTipo(e.target.value as SituacionRevistaKey)
                        }
                        className={inputClass}
                      >
                        {SITUACION_OPTIONS.map((opt) => (
                          <option key={opt.key} value={opt.key}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                      <input
                        type="date"
                        value={fila.situacionRevista[situacionKeyActual]}
                        onChange={(e) => updateBorradorSituacionFecha(situacionKeyActual, e.target.value)}
                        className={inputClass}
                        placeholder="Desde"
                      />
                      {situacionOptActual?.hasHasta && (
                        <input
                          type="date"
                          value={fila.situacionRevista.cargoTemporarioHasta}
                          onChange={(e) =>
                            updateBorradorSituacionFecha('cargoTemporarioHasta', e.target.value)
                          }
                          className={inputClass}
                          placeholder="Hasta"
                        />
                      )}
                    </div>
                  ) : (
                    situacionRevistaLabel(r)
                  )}
                </td>
                <td className="px-3 py-2 whitespace-nowrap text-right align-top">
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
