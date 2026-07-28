import type { RegistroAdministrativoFormData } from './RegistroAdministrativoForm';

interface ListadoRegistroAdministrativoProps {
  registros: RegistroAdministrativoFormData[];
  onEliminar: (index: number) => void;
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

function situacionRevistaLabel(r: RegistroAdministrativoFormData): string {
  const s = r.situacionRevista;
  if (s.plantaPermanenteDesde) return 'Planta permanente';
  if (s.temporarioMensualizadoDesde) return 'Temporario (mensualizado)';
  if (s.destajistaDesde) return 'Destajista';
  if (s.planesEmpleoDesde) return 'Planes de empleo';
  if (s.cooperativaDesde) return 'Cooperativa';
  if (s.cargoTemporarioDesde) return 'Cargo temporario';
  return '—';
}

function formatPeriodo(desde: string, hasta: string): string {
  if (!desde && !hasta) return '—';
  return `${desde || '—'} a ${hasta || '—'}`;
}

export default function ListadoRegistroAdministrativo({
  registros,
  onEliminar,
}: ListadoRegistroAdministrativoProps) {
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

  return (
    <div className="bg-white rounded-xl shadow border border-gray-200 overflow-x-auto">
      <table className="min-w-[2600px] w-full text-sm">
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
          {registros.map((r, index) => (
            <tr key={index} className="border-b border-gray-100 last:border-0">
              <td className="px-3 py-2 whitespace-nowrap">{r.nombre}</td>
              <td className="px-3 py-2 whitespace-nowrap">{r.apellido}</td>
              <td className="px-3 py-2 whitespace-nowrap">{r.legajo || '—'}</td>
              <td className="px-3 py-2 whitespace-nowrap">{r.categoriaActual || '—'}</td>
              <td className="px-3 py-2 whitespace-nowrap">{r.tipoDni || '—'}</td>
              <td className="px-3 py-2 whitespace-nowrap">{r.numeroDni || '—'}</td>
              <td className="px-3 py-2 whitespace-nowrap">{r.numeroCuil || '—'}</td>
              <td className="px-3 py-2 whitespace-nowrap">{r.secretariaACargo || '—'}</td>
              <td className="px-3 py-2 whitespace-nowrap">{r.direccionACargo || '—'}</td>
              <td className="px-3 py-2 whitespace-nowrap">{r.tipoCargo || '—'}</td>
              <td className="px-3 py-2 whitespace-nowrap">{r.areaEspecifica || '—'}</td>
              <td className="px-3 py-2 whitespace-nowrap">{r.antiguedad || '—'}</td>
              <td className="px-3 py-2 whitespace-nowrap">{r.fechaIngreso || '—'}</td>
              <td className="px-3 py-2 whitespace-nowrap">
                {r.historialAcademicoSalud.estudiosAlcanzados || '—'}
              </td>
              <td className="px-3 py-2 whitespace-nowrap">{r.historialAcademicoSalud.titulo || '—'}</td>
              <td className="px-3 py-2 whitespace-nowrap">
                <Badge value={r.historialAcademicoSalud.certificaciones.length > 0} />
              </td>
              <td className="px-3 py-2 whitespace-nowrap">
                <Badge value={r.historialAcademicoSalud.aptitudFisicaExamenes.length > 0} />
              </td>
              <td className="px-3 py-2 whitespace-nowrap">
                <Badge value={r.historialAcademicoSalud.actoAdministrativo.length > 0} />
              </td>
              <td className="px-3 py-2 whitespace-nowrap">
                {formatPeriodo(r.licenciaAnual.periodoDesde, r.licenciaAnual.periodoHasta)}
              </td>
              <td className="px-3 py-2 whitespace-nowrap">{r.licenciaAnual.dias || '—'}</td>
              <td className="px-3 py-2 whitespace-nowrap">{r.licenciaAnual.asunto || '—'}</td>
              <td className="px-3 py-2 whitespace-nowrap max-w-[240px] truncate" title={r.licenciaAnual.observaciones}>
                {r.licenciaAnual.observaciones || '—'}
              </td>
              <td className="px-3 py-2 whitespace-nowrap">
                <Badge value={r.licenciaAnual.comprobante.length > 0} />
              </td>
              <td className="px-3 py-2 whitespace-nowrap">{r.licenciaConducir.categoria || '—'}</td>
              <td className="px-3 py-2 whitespace-nowrap">
                {formatPeriodo(r.licenciaConducir.periodoDesde, r.licenciaConducir.periodoHasta)}
              </td>
              <td className="px-3 py-2 whitespace-nowrap">
                <Badge value={r.licenciaConducir.comprobante.length > 0} />
              </td>
              <td className="px-3 py-2 whitespace-nowrap">{r.unidadACargoDesde || '—'}</td>
              <td className="px-3 py-2 whitespace-nowrap">{situacionRevistaLabel(r)}</td>
              <td className="px-3 py-2 whitespace-nowrap text-right">
                <button
                  type="button"
                  onClick={() => handleEliminar(index, r.nombre, r.apellido)}
                  className="text-red-600 hover:text-red-800 text-sm font-medium border border-red-200 rounded px-3 py-1 hover:bg-red-50 transition-colors"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
