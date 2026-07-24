import type { PersonalDocumentacionFormData } from './PersonalDocumentacionForm';

interface ListadoDocumentacionPersonalProps {
  registros: PersonalDocumentacionFormData[];
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
}: ListadoDocumentacionPersonalProps) {
  if (registros.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow border border-gray-200 p-6 text-gray-400 text-sm">
        Todavía no hay documentación personal cargada.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow border border-gray-200 overflow-x-auto">
      <table className="min-w-[1500px] w-full text-sm">
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
