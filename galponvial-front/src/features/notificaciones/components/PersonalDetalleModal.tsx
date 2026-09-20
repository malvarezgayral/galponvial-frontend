import { useEffect, useState } from 'react';
import {
  documentacionService,
  registroService,
} from '@/features/documentacionpersonal/services/personalService';

type Campo = [string, string];

const CAMPOS_DOCUMENTACION: Campo[] = [
  ['nombre', 'Nombre'],
  ['apellido', 'Apellido'],
  ['numeroDocumento', 'Número de documento'],
  ['numeroCuil', 'Número de CUIL'],
  ['fechaNacimiento', 'Fecha de nacimiento'],
  ['ciudad', 'Ciudad'],
  ['direccion', 'Dirección'],
  ['numero', 'N°'],
  ['piso', 'Piso'],
  ['telefonoContacto', 'Teléfono de contacto'],
  ['estudiosAlcanzados', 'Estudios alcanzados'],
  ['titulo', 'Título'],
  ['preocupacional', 'Preocupacional'],
  ['fechaPreocupacional', 'Fecha del preocupacional'],
  ['constanciaAptitudFisica', 'Constancia de aptitud física'],
  ['fechaConstanciaAptitudFisica', 'Fecha de la constancia'],
  ['examenesMedicos', 'Exámenes médicos'],
  ['fechaExamenesMedicos', 'Fecha de exámenes médicos'],
  ['examenesMedicosArt', 'Exámenes médicos por ART'],
  ['fechaExamenesMedicosArt', 'Fecha de exámenes por ART'],
];

const CAMPOS_REGISTRO: Campo[] = [
  ['nombre', 'Nombre'],
  ['apellido', 'Apellido'],
  ['legajo', 'Legajo'],
  ['categoriaActual', 'Categoría actual'],
  ['tipoDni', 'Tipo DNI'],
  ['numeroDni', 'Número DNI'],
  ['numeroCuil', 'Número de CUIL'],
  ['secretariaACargo', 'Secretaría a cargo'],
  ['direccionACargo', 'Dirección a cargo'],
  ['tipoCargo', 'Tipo de cargo'],
  ['areaEspecifica', 'Área específica'],
  ['antiguedad', 'Antigüedad'],
  ['fechaIngreso', 'Fecha de ingreso'],
  ['estudiosAlcanzados', 'Estudios alcanzados'],
  ['titulo', 'Título'],
  ['licAnualFechaPresentada', 'Licencia anual: fecha presentada'],
  ['licAnualAsunto', 'Licencia anual: asunto'],
  ['licAnualAnio', 'Licencia anual: año'],
  ['licAnualDesde', 'Licencia anual: desde'],
  ['licAnualHasta', 'Licencia anual: hasta'],
  ['licAnualDias', 'Licencia anual: días'],
  ['licAnualObservaciones', 'Licencia anual: observaciones'],
  ['licConducirCategoria', 'Licencia de conducir: categoría'],
  ['licConducirDesde', 'Licencia de conducir: desde'],
  ['licConducirHasta', 'Licencia de conducir: hasta'],
  ['unidadACargoDesde', 'Unidad a cargo: desde'],
  ['plantaPermanenteDesde', 'Planta permanente: desde'],
  ['temporarioMensualizadoDesde', 'Temporario (mensualizado): desde'],
  ['destajistaDesde', 'Destajista: desde'],
  ['planesEmpleoDesde', 'Planes de empleo: desde'],
  ['cooperativaDesde', 'Cooperativa: desde'],
  ['cargoTemporarioDesde', 'Cargo temporario: desde'],
  ['cargoTemporarioHasta', 'Cargo temporario: hasta'],
];

const formatear = (v: unknown): string => {
  if (v === null || v === undefined || v === '') return '—';
  const t = String(v);
  return /^\d{4}-\d{2}-\d{2}/.test(t) ? t.slice(0, 10) : t;
};

interface Props {
  referenciaTipo: string;
  referenciaId: number;
  onClose: () => void;
}

export default function PersonalDetalleModal({
  referenciaTipo,
  referenciaId,
  onClose,
}: Props) {
  const [datos, setDatos] = useState<Record<string, unknown> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const esDoc = referenciaTipo === 'documentacion';
  const campos = esDoc ? CAMPOS_DOCUMENTACION : CAMPOS_REGISTRO;

  useEffect(() => {
    let cancelado = false;
    const pedir = esDoc
      ? documentacionService.getById(referenciaId)
      : registroService.getById(referenciaId);
    pedir
      .then((d) => {
        if (!cancelado) setDatos(d as unknown as Record<string, unknown>);
      })
      .catch(() => {
        if (!cancelado)
          setError('No se pudo cargar el registro. Puede que haya sido eliminado.');
      });
    return () => {
      cancelado = true;
    };
  }, [esDoc, referenciaId]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-lg w-full max-w-3xl max-h-[85vh] overflow-y-auto p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-gray-200 pb-3 mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            {esDoc ? 'Documentación personal' : 'Registro administrativo'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl leading-none"
            aria-label="Cerrar"
          >
            ×
          </button>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}
        {!error && !datos && <p className="text-sm text-gray-500">Cargando...</p>}

        {datos && (
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
            {campos.map(([clave, etiqueta]) => (
              <div key={clave}>
                <dt className="text-xs font-medium text-gray-500">{etiqueta}</dt>
                <dd className="text-sm text-gray-900 break-words">
                  {formatear(datos[clave])}
                </dd>
              </div>
            ))}
          </dl>
        )}

        <div className="flex justify-end border-t border-gray-200 pt-4 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="border border-gray-300 rounded px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
