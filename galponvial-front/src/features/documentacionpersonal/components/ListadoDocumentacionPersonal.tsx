import type { PersonalDocumentacionFormData } from './PersonalDocumentacionForm';

interface ListadoDocumentacionPersonalProps {
  registros: PersonalDocumentacionFormData[];
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

export default function ListadoDocumentacionPersonal({
  registros,
  onEliminar,
}: ListadoDocumentacionPersonalProps) {
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
          {registros.map((r, index) => (
            <tr key={index} className="border-b border-gray-100 last:border-0">
              <td className="px-3 py-2 whitespace-nowrap">{r.nombre}</td>
              <td className="px-3 py-2 whitespace-nowrap">{r.apellido}</td>
              <td className="px-3 py-2 whitespace-nowrap">{r.numeroCuil}</td>
              <td className="px-3 py-2 whitespace-nowrap">{r.numeroDocumento}</td>
              <td className="px-3 py-2 whitespace-nowrap">{r.domicilioActual.ciudad}</td>
              <td className="px-3 py-2 whitespace-nowrap">
                {r.domicilioActual.direccion} {r.domicilioActual.numero}
              </td>
              <td className="px-3 py-2 whitespace-nowrap">{r.domicilioActual.piso}</td>
              <td className="px-3 py-2 whitespace-nowrap">{r.domicilioActual.telefonoContacto}</td>
              <td className="px-3 py-2 whitespace-nowrap">
                {r.historialAcademico.estudiosAlcanzados || '—'}
              </td>
              <td className="px-3 py-2 whitespace-nowrap">
                <Badge value={Boolean(r.historialAcademico.titulo)} />
              </td>
              <td className="px-3 py-2 whitespace-nowrap">
                <Badge value={Boolean(r.historialSalud.preocupacional)} />
              </td>
              <td className="px-3 py-2 whitespace-nowrap">
                <Badge value={Boolean(r.historialSalud.constanciaAptitudFisica)} />
              </td>
              <td className="px-3 py-2 whitespace-nowrap">
                <Badge value={Boolean(r.historialSalud.examenesMedicos)} />
              </td>
              <td className="px-3 py-2 whitespace-nowrap">
                <Badge value={Boolean(r.historialSalud.examenesMedicosArt)} />
              </td>
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
