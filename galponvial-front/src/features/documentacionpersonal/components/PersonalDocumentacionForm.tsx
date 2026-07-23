import { useState } from "react";


const ACCEPTED_FILE_TYPES =
  ".pdf,.jpg,.jpeg,.png,.doc,.docx,application/pdf,image/jpeg,image/png,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document";

const ACCEPTED_FILE_LABEL = "PDF, JPG, PNG o DOC";

const MAX_FILE_SIZE_MB = 10;

interface DomicilioActual {
  ciudad: string;
  direccion: string;
  numero: string;
  piso: string;
  telefonoContacto: string;
}

interface HistorialAcademico {
  estudiosAlcanzados: string;
  titulo: string;
  certificados: File[];
}

interface HistorialSalud {
  preocupacional: string;
  fechaPreocupacional: string;
  constanciaAptitudFisica: string;
  fechaConstanciaAptitudFisica: string;
  examenesMedicos: string;
  fechaExamenesMedicos: string;
  examenesMedicosArt: string;
  fechaExamenesMedicosArt: string;
}

export interface PersonalDocumentacionFormData {
  nombre: string;
  apellido: string;
  numeroDocumento: string;
  fotoDni: File | null;
  numeroCuil: string;
  archivoCuil: File | null;
  fechaNacimiento: string;
  domicilioActual: DomicilioActual;
  historialAcademico: HistorialAcademico;
  historialSalud: HistorialSalud;
}

const ESTUDIOS_ALCANZADOS_OPTIONS = [
  "Primario",
  "Secundario",
  "Terciario",
  "Universitario",
];

const emptyForm: PersonalDocumentacionFormData = {
  nombre: "",
  apellido: "",
  numeroDocumento: "",
  fotoDni: null,
  numeroCuil: "",
  archivoCuil: null,
  fechaNacimiento: "",
  domicilioActual: {
    ciudad: "",
    direccion: "",
    numero: "",
    piso: "",
    telefonoContacto: "",
  },
  historialAcademico: {
    estudiosAlcanzados: "",
    titulo: "",
    certificados: [],
  },
  historialSalud: {
    preocupacional: "",
    fechaPreocupacional: "",
    constanciaAptitudFisica: "",
    fechaConstanciaAptitudFisica: "",
    examenesMedicos: "",
    fechaExamenesMedicos: "",
    examenesMedicosArt: "",
    fechaExamenesMedicosArt: "",
  },
};

function validateFile(file: File): string | null {
  const validExtensions = [".pdf", ".jpg", ".jpeg", ".png", ".doc", ".docx"];
  const lowerName = file.name.toLowerCase();
  const hasValidExtension = validExtensions.some((ext) =>
    lowerName.endsWith(ext)
  );

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
  file: File | null;
  onChange: (file: File | null) => void;
  multiple?: boolean;
  files?: File[];
  onChangeMultiple?: (files: File[]) => void;
}

function FileInput({
  label,
  file,
  onChange,
  multiple = false,
  files = [],
  onChangeMultiple,
}: FileInputProps) {
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

    if (multiple && onChangeMultiple) {
      onChangeMultiple([...files, ...selectedFiles]);
    } else {
      onChange(selectedFiles[0]);
    }
  };

  const removeFile = (index?: number) => {
    if (multiple && onChangeMultiple) {
      onChangeMultiple(files.filter((_, i) => i !== index));
    } else {
      onChange(null);
    }
    setError(null);
  };

  const displayFiles = multiple ? files : file ? [file] : [];

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
          {displayFiles.length > 0
            ? "Adjuntar otro archivo"
            : `Adjuntar archivo (${ACCEPTED_FILE_LABEL})`}
        </span>
        <input
          id={inputId}
          type="file"
          accept={ACCEPTED_FILE_TYPES}
          multiple={multiple}
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </label>

      {error && <p className="text-sm text-red-600">{error}</p>}

      {displayFiles.length > 0 && (
        <ul className="flex flex-col gap-1 mt-1">
          {displayFiles.map((f, index) => (
            <li
              key={`${f.name}-${index}`}
              className="flex items-center justify-between text-sm bg-gray-50 border border-gray-200 rounded px-2 py-1"
            >
              <span className="truncate max-w-[75%]" title={f.name}>
                {f.name}
              </span>
              <button
                type="button"
                onClick={() => removeFile(multiple ? index : undefined)}
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

interface PersonalDocumentacionFormProps {
  onCancel: () => void;
  onSubmit: (data: PersonalDocumentacionFormData) => void | Promise<void>;
  initialData?: PersonalDocumentacionFormData;
}

export default function PersonalDocumentacionForm({
  onCancel,
  onSubmit,
  initialData,
}: PersonalDocumentacionFormProps) {
  const [form, setForm] = useState<PersonalDocumentacionFormData>(
    initialData ?? emptyForm
  );
  const [submitting, setSubmitting] = useState(false);

  const updateField = <K extends keyof PersonalDocumentacionFormData>(
    field: K,
    value: PersonalDocumentacionFormData[K]
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const updateDomicilio = <K extends keyof DomicilioActual>(
    field: K,
    value: DomicilioActual[K]
  ) => {
    setForm((prev) => ({
      ...prev,
      domicilioActual: { ...prev.domicilioActual, [field]: value },
    }));
  };

  const updateAcademico = <K extends keyof HistorialAcademico>(
    field: K,
    value: HistorialAcademico[K]
  ) => {
    setForm((prev) => ({
      ...prev,
      historialAcademico: { ...prev.historialAcademico, [field]: value },
    }));
  };

  const updateSalud = <K extends keyof HistorialSalud>(
    field: K,
    value: HistorialSalud[K]
  ) => {
    setForm((prev) => ({
      ...prev,
      historialSalud: { ...prev.historialSalud, [field]: value },
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
        <h2 className="text-lg font-semibold text-gray-900">
          Agregar documentación personal
        </h2>
        <button
          type="button"
          onClick={onCancel}
          className="text-gray-500 hover:text-gray-700 text-base"
        >
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
          <label className="text-sm font-medium text-gray-700">
            Apellido
          </label>
          <input
            type="text"
            value={form.apellido}
            onChange={(e) => updateField("apellido", e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 text-base"
            required
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">
            Número de documento
          </label>
          <input
            type="text"
            value={form.numeroDocumento}
            onChange={(e) => updateField("numeroDocumento", e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 text-base"
            required
          />
        </div>
        <FileInput
          label="Foto del DNI"
          file={form.fotoDni}
          onChange={(file) => updateField("fotoDni", file)}
        />

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">
            Número de CUIL
          </label>
          <input
            type="text"
            value={form.numeroCuil}
            onChange={(e) => updateField("numeroCuil", e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 text-base"
            required
          />
        </div>
        <FileInput
          label="Archivo de CUIL"
          file={form.archivoCuil}
          onChange={(file) => updateField("archivoCuil", file)}
        />

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">
            Fecha de nacimiento
          </label>
          <input
            type="date"
            value={form.fechaNacimiento}
            onChange={(e) => updateField("fechaNacimiento", e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 text-base"
            required
          />
        </div>
      </section>

      <section className="border-t border-gray-200 pt-4">
        <h3 className="text-base font-semibold text-gray-900 mb-3">
          Domicilio actual
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">
              Ciudad
            </label>
            <input
              type="text"
              value={form.domicilioActual.ciudad}
              onChange={(e) => updateDomicilio("ciudad", e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 text-base"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">
              Dirección
            </label>
            <input
              type="text"
              value={form.domicilioActual.direccion}
              onChange={(e) => updateDomicilio("direccion", e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 text-base"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">N°</label>
            <input
              type="text"
              value={form.domicilioActual.numero}
              onChange={(e) => updateDomicilio("numero", e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 text-base"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Piso</label>
            <input
              type="text"
              value={form.domicilioActual.piso}
              onChange={(e) => updateDomicilio("piso", e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 text-base"
            />
          </div>
          <div className="flex flex-col gap-1 col-span-2">
            <label className="text-sm font-medium text-gray-700">
              Teléfono de contacto
            </label>
            <input
              type="tel"
              value={form.domicilioActual.telefonoContacto}
              onChange={(e) =>
                updateDomicilio("telefonoContacto", e.target.value)
              }
              className="border border-gray-300 rounded px-3 py-2 text-base"
            />
          </div>
        </div>
      </section>

      <section className="border-t border-gray-200 pt-4">
        <h3 className="text-base font-semibold text-gray-900 mb-3">
          Historial académico
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">
              Estudios alcanzados
            </label>
            <select
              value={form.historialAcademico.estudiosAlcanzados}
              onChange={(e) =>
                updateAcademico("estudiosAlcanzados", e.target.value)
              }
              className="border border-gray-300 rounded px-3 py-2 text-base bg-white"
            >
              <option value="">Seleccionar...</option>
              {ESTUDIOS_ALCANZADOS_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">
              Título
            </label>
            <input
              type="text"
              value={form.historialAcademico.titulo}
              onChange={(e) => updateAcademico("titulo", e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 text-base"
            />
          </div>
          <div className="col-span-2">
            <FileInput
              label="Certificado/s"
              file={null}
              onChange={() => {}}
              multiple
              files={form.historialAcademico.certificados}
              onChangeMultiple={(files) =>
                updateAcademico("certificados", files)
              }
            />
          </div>
        </div>
      </section>

      <section className="border-t border-gray-200 pt-4">
        <h3 className="text-base font-semibold text-gray-900 mb-3">
          Historial de salud
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">
              Preocupacional
            </label>
            <input
              type="text"
              value={form.historialSalud.preocupacional}
              onChange={(e) => updateSalud("preocupacional", e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 text-base"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">
              Fecha del preocupacional
            </label>
            <input
              type="date"
              value={form.historialSalud.fechaPreocupacional}
              onChange={(e) =>
                updateSalud("fechaPreocupacional", e.target.value)
              }
              className="border border-gray-300 rounded px-3 py-2 text-base"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">
              Constancia de aptitud física
            </label>
            <input
              type="text"
              value={form.historialSalud.constanciaAptitudFisica}
              onChange={(e) =>
                updateSalud("constanciaAptitudFisica", e.target.value)
              }
              className="border border-gray-300 rounded px-3 py-2 text-base"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">
              Fecha de la constancia
            </label>
            <input
              type="date"
              value={form.historialSalud.fechaConstanciaAptitudFisica}
              onChange={(e) =>
                updateSalud("fechaConstanciaAptitudFisica", e.target.value)
              }
              className="border border-gray-300 rounded px-3 py-2 text-base"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">
              Exámenes médicos
            </label>
            <input
              type="text"
              value={form.historialSalud.examenesMedicos}
              onChange={(e) => updateSalud("examenesMedicos", e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 text-base"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">
              Fecha de exámenes médicos
            </label>
            <input
              type="date"
              value={form.historialSalud.fechaExamenesMedicos}
              onChange={(e) =>
                updateSalud("fechaExamenesMedicos", e.target.value)
              }
              className="border border-gray-300 rounded px-3 py-2 text-base"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">
              Exámenes médicos por ART
            </label>
            <input
              type="text"
              value={form.historialSalud.examenesMedicosArt}
              onChange={(e) =>
                updateSalud("examenesMedicosArt", e.target.value)
              }
              className="border border-gray-300 rounded px-3 py-2 text-base"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">
              Fecha de exámenes por ART
            </label>
            <input
              type="date"
              value={form.historialSalud.fechaExamenesMedicosArt}
              onChange={(e) =>
                updateSalud("fechaExamenesMedicosArt", e.target.value)
              }
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