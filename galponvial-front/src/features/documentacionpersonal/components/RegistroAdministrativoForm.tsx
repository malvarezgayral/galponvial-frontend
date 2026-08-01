import { useState } from "react";

const ACCEPTED_FILE_TYPES =
  ".pdf,.jpg,.jpeg,.png,.doc,.docx,application/pdf,image/jpeg,image/png,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document";
const ACCEPTED_FILE_LABEL = "PDF, JPG, PNG o DOC";
const MAX_FILE_SIZE_MB = 10;

const ESTUDIOS_OPTIONS = ["Primario", "Secundario", "Terciario", "Universitario"];
const TIPO_DNI_OPTIONS = ["DNI", "LC", "LE"];

interface HistorialAcademicoSalud {
  estudiosAlcanzados: string;
  titulo: string;
  certificaciones: File[];
  aptitudFisicaExamenes: File[];
  actoAdministrativo: File[];
}

interface LicenciaAnual {
  fechaPresentada: string;
  asunto: string;
  anio: string;
  periodoDesde: string;
  periodoHasta: string;
  dias: string;
  observaciones: string;
  comprobante: File[];
}

interface LicenciaConducir {
  categoria: string;
  periodoDesde: string;
  periodoHasta: string;
  comprobante: File[];
}

interface SituacionRevista {
  plantaPermanenteDesde: string;
  temporarioMensualizadoDesde: string;
  destajistaDesde: string;
  planesEmpleoDesde: string;
  cooperativaDesde: string;
  cargoTemporarioDesde: string;
  cargoTemporarioHasta: string;
}

export interface RegistroAdministrativoFormData {
  nombre: string;
  apellido: string;
  legajo: string;
  categoriaActual: string;
  tipoDni: string;
  numeroDni: string;
  numeroCuil: string;
  secretariaACargo: string;
  direccionACargo: string;
  tipoCargo: string;
  areaEspecifica: string;
  antiguedad: string;
  fechaIngreso: string;
  historialAcademicoSalud: HistorialAcademicoSalud;
  licenciaAnual: LicenciaAnual;
  licenciaConducir: LicenciaConducir;
  unidadACargoDesde: string;
  situacionRevista: SituacionRevista;
}

const emptyForm: RegistroAdministrativoFormData = {
  nombre: "",
  apellido: "",
  legajo: "",
  categoriaActual: "",
  tipoDni: "",
  numeroDni: "",
  numeroCuil: "",
  secretariaACargo: "",
  direccionACargo: "",
  tipoCargo: "",
  areaEspecifica: "",
  antiguedad: "",
  fechaIngreso: "",
  historialAcademicoSalud: {
    estudiosAlcanzados: "",
    titulo: "",
    certificaciones: [],
    aptitudFisicaExamenes: [],
    actoAdministrativo: [],
  },
  licenciaAnual: {
    fechaPresentada: "",
    asunto: "",
    anio: "",
    periodoDesde: "",
    periodoHasta: "",
    dias: "",
    observaciones: "",
    comprobante: [],
  },
  licenciaConducir: {
    categoria: "",
    periodoDesde: "",
    periodoHasta: "",
    comprobante: [],
  },
  unidadACargoDesde: "",
  situacionRevista: {
    plantaPermanenteDesde: "",
    temporarioMensualizadoDesde: "",
    destajistaDesde: "",
    planesEmpleoDesde: "",
    cooperativaDesde: "",
    cargoTemporarioDesde: "",
    cargoTemporarioHasta: "",
  },
};

function validateFile(file: File): string | null {
  const validExtensions = [".pdf", ".jpg", ".jpeg", ".png", ".doc", ".docx"];
  const lowerName = file.name.toLowerCase();
  const hasValidExtension = validExtensions.some((ext) => lowerName.endsWith(ext));
  if (!hasValidExtension) {
    return `Formato no permitido. Solo se acepta ${ACCEPTED_FILE_LABEL}.`;
  }
  if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
    return `El archivo supera los ${MAX_FILE_SIZE_MB}MB permitidos.`;
  }
  return null;
}

interface FileInputProps {
  label: string;
  files: File[];
  onChange: (files: File[]) => void;
}

export function FileInput({ label, files, onChange }: FileInputProps) {
  const [error, setError] = useState<string | null>(null);
  const inputId = `file-${label.replace(/\s+/g, "-").toLowerCase()}`;

  const handleFiles = (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    const selectedFiles = Array.from(fileList);
    for (const f of selectedFiles) {
      const validationError = validateFile(f);
      if (validationError) {
        setError(validationError);
        return;
      }
    }
    setError(null);
    onChange([...files, ...selectedFiles]);
  };

  const removeFile = (index: number) => {
    onChange(files.filter((_, i) => i !== index));
    setError(null);
  };

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={inputId} className="text-sm font-medium text-gray-700">
        {label}
      </label>
      <label
        htmlFor={inputId}
        className="flex items-center justify-center gap-2 border border-dashed border-gray-300 rounded px-3 py-2 text-sm text-gray-600 cursor-pointer hover:bg-gray-50 transition-colors"
      >
        <span>
          {files.length > 0 ? "Adjuntar otro archivo" : `Adjuntar archivo (${ACCEPTED_FILE_LABEL})`}
        </span>
        <input
          id={inputId}
          type="file"
          accept={ACCEPTED_FILE_TYPES}
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </label>
      {error && <p className="text-sm text-red-600">{error}</p>}
      {files.length > 0 && (
        <ul className="flex flex-col gap-1 mt-1">
          {files.map((f, index) => (
            <li
              key={`${f.name}-${index}`}
              className="flex items-center justify-between text-sm bg-gray-50 border border-gray-200 rounded px-2 py-1"
            >
              <span className="truncate max-w-[75%]" title={f.name}>
                {f.name}
              </span>
              <button
                type="button"
                onClick={() => removeFile(index)}
                className="text-gray-500 hover:text-red-600"
                aria-label={`Quitar ${f.name}`}
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

interface RegistroAdministrativoFormProps {
  onCancel: () => void;
  onSubmit: (data: RegistroAdministrativoFormData) => void | Promise<void>;
  initialData?: RegistroAdministrativoFormData;
}

export default function RegistroAdministrativoForm({
  onCancel,
  onSubmit,
  initialData,
}: RegistroAdministrativoFormProps) {
  const [form, setForm] = useState<RegistroAdministrativoFormData>(initialData ?? emptyForm);
  const [submitting, setSubmitting] = useState(false);

  const updateField = <K extends keyof RegistroAdministrativoFormData>(
    field: K,
    value: RegistroAdministrativoFormData[K]
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const updateAcademicoSalud = <K extends keyof HistorialAcademicoSalud>(
    field: K,
    value: HistorialAcademicoSalud[K]
  ) => {
    setForm((prev) => ({
      ...prev,
      historialAcademicoSalud: { ...prev.historialAcademicoSalud, [field]: value },
    }));
  };

  const updateLicenciaAnual = <K extends keyof LicenciaAnual>(field: K, value: LicenciaAnual[K]) => {
    setForm((prev) => ({
      ...prev,
      licenciaAnual: { ...prev.licenciaAnual, [field]: value },
    }));
  };

  const updateLicenciaConducir = <K extends keyof LicenciaConducir>(
    field: K,
    value: LicenciaConducir[K]
  ) => {
    setForm((prev) => ({
      ...prev,
      licenciaConducir: { ...prev.licenciaConducir, [field]: value },
    }));
  };

  const updateSituacionRevista = <K extends keyof SituacionRevista>(
    field: K,
    value: SituacionRevista[K]
  ) => {
    setForm((prev) => ({
      ...prev,
      situacionRevista: { ...prev.situacionRevista, [field]: value },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit(form);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-lg border border-gray-200 shadow-sm p-8 max-w-5xl mx-auto flex flex-col gap-8"
    >
      <div className="flex items-center justify-between border-b border-gray-200 pb-3">
        <h2 className="text-lg font-semibold text-gray-900">Agregar registro administrativo</h2>
        <button type="button" onClick={onCancel} className="text-gray-500 hover:text-gray-700 text-base">
          Cerrar
        </button>
      </div>

      <section className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Nombre</label>
          <input
            type="text"
            value={form.nombre}
            onChange={(e) => updateField("nombre", e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 text-base"
            required
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Apellido</label>
          <input
            type="text"
            value={form.apellido}
            onChange={(e) => updateField("apellido", e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 text-base"
            required
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Legajo</label>
          <input
            type="text"
            value={form.legajo}
            onChange={(e) => updateField("legajo", e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 text-base"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Categoría actual</label>
          <input
            type="text"
            value={form.categoriaActual}
            onChange={(e) => updateField("categoriaActual", e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 text-base"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Tipo DNI</label>
          <select
            value={form.tipoDni}
            onChange={(e) => updateField("tipoDni", e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 text-base bg-white"
          >
            <option value="">Seleccionar...</option>
            {TIPO_DNI_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Número DNI</label>
          <input
            type="text"
            value={form.numeroDni}
            onChange={(e) => updateField("numeroDni", e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 text-base"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Número de CUIL</label>
          <input
            type="text"
            value={form.numeroCuil}
            onChange={(e) => updateField("numeroCuil", e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 text-base"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Secretaría a cargo</label>
          <input
            type="text"
            value={form.secretariaACargo}
            onChange={(e) => updateField("secretariaACargo", e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 text-base"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Dirección a cargo</label>
          <input
            type="text"
            value={form.direccionACargo}
            onChange={(e) => updateField("direccionACargo", e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 text-base"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Tipo de cargo</label>
          <input
            type="text"
            value={form.tipoCargo}
            onChange={(e) => updateField("tipoCargo", e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 text-base"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Área específica</label>
          <input
            type="text"
            value={form.areaEspecifica}
            onChange={(e) => updateField("areaEspecifica", e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 text-base"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Antigüedad</label>
          <input
            type="text"
            value={form.antiguedad}
            onChange={(e) => updateField("antiguedad", e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 text-base"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Fecha de ingreso</label>
          <input
            type="date"
            value={form.fechaIngreso}
            onChange={(e) => updateField("fechaIngreso", e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 text-base"
          />
        </div>
      </section>

      <section className="border-t border-gray-200 pt-4">
        <h3 className="text-base font-semibold text-gray-900 mb-3">Historial académico y de salud</h3>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Estudios alcanzados</label>
            <select
              value={form.historialAcademicoSalud.estudiosAlcanzados}
              onChange={(e) => updateAcademicoSalud("estudiosAlcanzados", e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 text-base bg-white"
            >
              <option value="">Seleccionar...</option>
              {ESTUDIOS_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Título</label>
            <input
              type="text"
              value={form.historialAcademicoSalud.titulo}
              onChange={(e) => updateAcademicoSalud("titulo", e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 text-base"
            />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <FileInput
            label="Certificaciones"
            files={form.historialAcademicoSalud.certificaciones}
            onChange={(files) => updateAcademicoSalud("certificaciones", files)}
          />
          <FileInput
            label="Aptitud física / exámenes médicos"
            files={form.historialAcademicoSalud.aptitudFisicaExamenes}
            onChange={(files) => updateAcademicoSalud("aptitudFisicaExamenes", files)}
          />
          <FileInput
            label="Acto administrativo / decreto"
            files={form.historialAcademicoSalud.actoAdministrativo}
            onChange={(files) => updateAcademicoSalud("actoAdministrativo", files)}
          />
        </div>
      </section>

      <section className="border-t border-gray-200 pt-4">
        <h3 className="text-base font-semibold text-gray-900 mb-3">Licencia anual</h3>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Fecha presentada</label>
            <input
              type="date"
              value={form.licenciaAnual.fechaPresentada}
              onChange={(e) => updateLicenciaAnual("fechaPresentada", e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 text-base"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Año</label>
            <input
              type="text"
              value={form.licenciaAnual.anio}
              onChange={(e) => updateLicenciaAnual("anio", e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 text-base"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Período desde</label>
            <input
              type="date"
              value={form.licenciaAnual.periodoDesde}
              onChange={(e) => updateLicenciaAnual("periodoDesde", e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 text-base"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Período hasta</label>
            <input
              type="date"
              value={form.licenciaAnual.periodoHasta}
              onChange={(e) => updateLicenciaAnual("periodoHasta", e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 text-base"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Días</label>
            <input
              type="text"
              value={form.licenciaAnual.dias}
              onChange={(e) => updateLicenciaAnual("dias", e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 text-base"
            />
          </div>
          <div className="flex flex-col gap-1 col-span-2">
            <label className="text-sm font-medium text-gray-700">Asunto</label>
            <input
              type="text"
              value={form.licenciaAnual.asunto}
              onChange={(e) => updateLicenciaAnual("asunto", e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 text-base"
            />
          </div>
          <div className="flex flex-col gap-1 col-span-2">
            <label className="text-sm font-medium text-gray-700">Observaciones generales</label>
            <textarea
              value={form.licenciaAnual.observaciones}
              onChange={(e) => updateLicenciaAnual("observaciones", e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 text-base min-h-[80px]"
            />
          </div>
        </div>
        <FileInput
          label="Comprobante adjunto"
          files={form.licenciaAnual.comprobante}
          onChange={(files) => updateLicenciaAnual("comprobante", files)}
        />
      </section>

      <section className="border-t border-gray-200 pt-4">
        <h3 className="text-base font-semibold text-gray-900 mb-3">Licencia de conducir</h3>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Categoría</label>
            <input
              type="text"
              value={form.licenciaConducir.categoria}
              onChange={(e) => updateLicenciaConducir("categoria", e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 text-base"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Período desde</label>
            <input
              type="date"
              value={form.licenciaConducir.periodoDesde}
              onChange={(e) => updateLicenciaConducir("periodoDesde", e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 text-base"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Período hasta</label>
            <input
              type="date"
              value={form.licenciaConducir.periodoHasta}
              onChange={(e) => updateLicenciaConducir("periodoHasta", e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 text-base"
            />
          </div>
        </div>
        <FileInput
          label="Comprobante adjunto"
          files={form.licenciaConducir.comprobante}
          onChange={(files) => updateLicenciaConducir("comprobante", files)}
        />
      </section>

      <section className="border-t border-gray-200 pt-4">
        <h3 className="text-base font-semibold text-gray-900 mb-3">Unidad a cargo</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Período desde</label>
            <input
              type="date"
              value={form.unidadACargoDesde}
              onChange={(e) => updateField("unidadACargoDesde", e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 text-base"
            />
          </div>
        </div>
      </section>

      <section className="border-t border-gray-200 pt-4">
        <h3 className="text-base font-semibold text-gray-900 mb-3">Situación de revista</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Personal de planta permanente — desde</label>
            <input
              type="date"
              value={form.situacionRevista.plantaPermanenteDesde}
              onChange={(e) => updateSituacionRevista("plantaPermanenteDesde", e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 text-base"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Personal temporario (mensualizado) — desde</label>
            <input
              type="date"
              value={form.situacionRevista.temporarioMensualizadoDesde}
              onChange={(e) => updateSituacionRevista("temporarioMensualizadoDesde", e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 text-base"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Personal destajista — desde</label>
            <input
              type="date"
              value={form.situacionRevista.destajistaDesde}
              onChange={(e) => updateSituacionRevista("destajistaDesde", e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 text-base"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Personal planes de empleo — desde</label>
            <input
              type="date"
              value={form.situacionRevista.planesEmpleoDesde}
              onChange={(e) => updateSituacionRevista("planesEmpleoDesde", e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 text-base"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Personal cooperativa — desde</label>
            <input
              type="date"
              value={form.situacionRevista.cooperativaDesde}
              onChange={(e) => updateSituacionRevista("cooperativaDesde", e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 text-base"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Cargo temporario — desde</label>
            <input
              type="date"
              value={form.situacionRevista.cargoTemporarioDesde}
              onChange={(e) => updateSituacionRevista("cargoTemporarioDesde", e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 text-base"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Cargo temporario — hasta</label>
            <input
              type="date"
              value={form.situacionRevista.cargoTemporarioHasta}
              onChange={(e) => updateSituacionRevista("cargoTemporarioHasta", e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 text-base"
            />
          </div>
        </div>
      </section>

      <div className="flex justify-end gap-2 border-t border-gray-200 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="border border-gray-300 rounded px-4 py-2 text-base text-gray-700 hover:bg-gray-50"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="bg-blue-600 text-white rounded px-4 py-2 text-base hover:bg-blue-700 disabled:opacity-50"
        >
          {submitting ? "Guardando..." : "Guardar"}
        </button>
      </div>
    </form>
  );
}
