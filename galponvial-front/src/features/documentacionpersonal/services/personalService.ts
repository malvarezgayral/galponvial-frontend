import { apiClient } from '@/services/api';
import { API_ENDPOINTS } from '@/services/apiEndpoints';
import type { PersonalDocumentacionFormData } from '../components/PersonalDocumentacionForm';
import type { RegistroAdministrativoFormData } from '../components/RegistroAdministrativoForm';

// ---------- Tipos del backend (campos planos) ----------
export interface DocumentacionPersonalDto {
  id?: number;
  nombre: string;
  apellido: string;
  numeroDocumento: string;
  numeroCuil: string;
  fechaNacimiento: string;
  ciudad?: string | null;
  direccion?: string | null;
  numero?: string | null;
  piso?: string | null;
  telefonoContacto?: string | null;
  estudiosAlcanzados?: string | null;
  titulo?: string | null;
  preocupacional?: string | null;
  fechaPreocupacional?: string | null;
  constanciaAptitudFisica?: string | null;
  fechaConstanciaAptitudFisica?: string | null;
  examenesMedicos?: string | null;
  fechaExamenesMedicos?: string | null;
  examenesMedicosArt?: string | null;
  fechaExamenesMedicosArt?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface RegistroAdministrativoDto {
  id?: number;
  nombre: string;
  apellido: string;
  legajo?: string | null;
  categoriaActual?: string | null;
  tipoDni?: string | null;
  numeroDni?: string | null;
  numeroCuil?: string | null;
  secretariaACargo?: string | null;
  direccionACargo?: string | null;
  tipoCargo?: string | null;
  areaEspecifica?: string | null;
  antiguedad?: string | null;
  fechaIngreso?: string | null;
  estudiosAlcanzados?: string | null;
  titulo?: string | null;
  licAnualFechaPresentada?: string | null;
  licAnualAsunto?: string | null;
  licAnualAnio?: string | null;
  licAnualDesde?: string | null;
  licAnualHasta?: string | null;
  licAnualDias?: string | null;
  licAnualObservaciones?: string | null;
  licConducirCategoria?: string | null;
  licConducirDesde?: string | null;
  licConducirHasta?: string | null;
  unidadACargoDesde?: string | null;
  plantaPermanenteDesde?: string | null;
  temporarioMensualizadoDesde?: string | null;
  destajistaDesde?: string | null;
  planesEmpleoDesde?: string | null;
  cooperativaDesde?: string | null;
  cargoTemporarioDesde?: string | null;
  cargoTemporarioHasta?: string | null;
  created_at?: string;
  updated_at?: string;
}

// ---------- Conversión formulario <-> backend ----------
const s = (v: string | null | undefined): string => v ?? '';

export function documentacionToPayload(
  f: PersonalDocumentacionFormData
): DocumentacionPersonalDto {
  return {
    nombre: f.nombre,
    apellido: f.apellido,
    numeroDocumento: f.numeroDocumento,
    numeroCuil: f.numeroCuil,
    fechaNacimiento: f.fechaNacimiento,
    ciudad: f.domicilioActual.ciudad,
    direccion: f.domicilioActual.direccion,
    numero: f.domicilioActual.numero,
    piso: f.domicilioActual.piso,
    telefonoContacto: f.domicilioActual.telefonoContacto,
    estudiosAlcanzados: f.historialAcademico.estudiosAlcanzados,
    titulo: f.historialAcademico.titulo,
    preocupacional: f.historialSalud.preocupacional,
    fechaPreocupacional: f.historialSalud.fechaPreocupacional,
    constanciaAptitudFisica: f.historialSalud.constanciaAptitudFisica,
    fechaConstanciaAptitudFisica: f.historialSalud.fechaConstanciaAptitudFisica,
    examenesMedicos: f.historialSalud.examenesMedicos,
    fechaExamenesMedicos: f.historialSalud.fechaExamenesMedicos,
    examenesMedicosArt: f.historialSalud.examenesMedicosArt,
    fechaExamenesMedicosArt: f.historialSalud.fechaExamenesMedicosArt,
  };
}

export function documentacionToForm(
  d: DocumentacionPersonalDto
): PersonalDocumentacionFormData {
  return {
    nombre: d.nombre,
    apellido: d.apellido,
    numeroDocumento: d.numeroDocumento,
    fotoDni: null,
    numeroCuil: d.numeroCuil,
    archivoCuil: null,
    fechaNacimiento: s(d.fechaNacimiento).slice(0, 10),
    domicilioActual: {
      ciudad: s(d.ciudad),
      direccion: s(d.direccion),
      numero: s(d.numero),
      piso: s(d.piso),
      telefonoContacto: s(d.telefonoContacto),
    },
    historialAcademico: {
      estudiosAlcanzados: s(d.estudiosAlcanzados),
      titulo: s(d.titulo),
      certificados: [],
    },
    historialSalud: {
      preocupacional: s(d.preocupacional),
      fechaPreocupacional: s(d.fechaPreocupacional).slice(0, 10),
      constanciaAptitudFisica: s(d.constanciaAptitudFisica),
      fechaConstanciaAptitudFisica: s(d.fechaConstanciaAptitudFisica).slice(0, 10),
      examenesMedicos: s(d.examenesMedicos),
      fechaExamenesMedicos: s(d.fechaExamenesMedicos).slice(0, 10),
      examenesMedicosArt: s(d.examenesMedicosArt),
      fechaExamenesMedicosArt: s(d.fechaExamenesMedicosArt).slice(0, 10),
    },
  };
}

export function registroToPayload(
  f: RegistroAdministrativoFormData
): RegistroAdministrativoDto {
  return {
    nombre: f.nombre,
    apellido: f.apellido,
    legajo: f.legajo,
    categoriaActual: f.categoriaActual,
    tipoDni: f.tipoDni,
    numeroDni: f.numeroDni,
    numeroCuil: f.numeroCuil,
    secretariaACargo: f.secretariaACargo,
    direccionACargo: f.direccionACargo,
    tipoCargo: f.tipoCargo,
    areaEspecifica: f.areaEspecifica,
    antiguedad: f.antiguedad,
    fechaIngreso: f.fechaIngreso,
    estudiosAlcanzados: f.historialAcademicoSalud.estudiosAlcanzados,
    titulo: f.historialAcademicoSalud.titulo,
    licAnualFechaPresentada: f.licenciaAnual.fechaPresentada,
    licAnualAsunto: f.licenciaAnual.asunto,
    licAnualAnio: f.licenciaAnual.anio,
    licAnualDesde: f.licenciaAnual.periodoDesde,
    licAnualHasta: f.licenciaAnual.periodoHasta,
    licAnualDias: f.licenciaAnual.dias,
    licAnualObservaciones: f.licenciaAnual.observaciones,
    licConducirCategoria: f.licenciaConducir.categoria,
    licConducirDesde: f.licenciaConducir.periodoDesde,
    licConducirHasta: f.licenciaConducir.periodoHasta,
    unidadACargoDesde: f.unidadACargoDesde,
    plantaPermanenteDesde: f.situacionRevista.plantaPermanenteDesde,
    temporarioMensualizadoDesde: f.situacionRevista.temporarioMensualizadoDesde,
    destajistaDesde: f.situacionRevista.destajistaDesde,
    planesEmpleoDesde: f.situacionRevista.planesEmpleoDesde,
    cooperativaDesde: f.situacionRevista.cooperativaDesde,
    cargoTemporarioDesde: f.situacionRevista.cargoTemporarioDesde,
    cargoTemporarioHasta: f.situacionRevista.cargoTemporarioHasta,
  };
}

export function registroToForm(
  d: RegistroAdministrativoDto
): RegistroAdministrativoFormData {
  return {
    nombre: d.nombre,
    apellido: d.apellido,
    legajo: s(d.legajo),
    categoriaActual: s(d.categoriaActual),
    tipoDni: s(d.tipoDni),
    numeroDni: s(d.numeroDni),
    numeroCuil: s(d.numeroCuil),
    secretariaACargo: s(d.secretariaACargo),
    direccionACargo: s(d.direccionACargo),
    tipoCargo: s(d.tipoCargo),
    areaEspecifica: s(d.areaEspecifica),
    antiguedad: s(d.antiguedad),
    fechaIngreso: s(d.fechaIngreso).slice(0, 10),
    historialAcademicoSalud: {
      estudiosAlcanzados: s(d.estudiosAlcanzados),
      titulo: s(d.titulo),
      certificaciones: [],
      aptitudFisicaExamenes: [],
      actoAdministrativo: [],
    },
    licenciaAnual: {
      fechaPresentada: s(d.licAnualFechaPresentada).slice(0, 10),
      asunto: s(d.licAnualAsunto),
      anio: s(d.licAnualAnio),
      periodoDesde: s(d.licAnualDesde).slice(0, 10),
      periodoHasta: s(d.licAnualHasta).slice(0, 10),
      dias: s(d.licAnualDias),
      observaciones: s(d.licAnualObservaciones),
      comprobante: [],
    },
    licenciaConducir: {
      categoria: s(d.licConducirCategoria),
      periodoDesde: s(d.licConducirDesde).slice(0, 10),
      periodoHasta: s(d.licConducirHasta).slice(0, 10),
      comprobante: [],
    },
    unidadACargoDesde: s(d.unidadACargoDesde).slice(0, 10),
    situacionRevista: {
      plantaPermanenteDesde: s(d.plantaPermanenteDesde).slice(0, 10),
      temporarioMensualizadoDesde: s(d.temporarioMensualizadoDesde).slice(0, 10),
      destajistaDesde: s(d.destajistaDesde).slice(0, 10),
      planesEmpleoDesde: s(d.planesEmpleoDesde).slice(0, 10),
      cooperativaDesde: s(d.cooperativaDesde).slice(0, 10),
      cargoTemporarioDesde: s(d.cargoTemporarioDesde).slice(0, 10),
      cargoTemporarioHasta: s(d.cargoTemporarioHasta).slice(0, 10),
    },
  };
}

// ---------- Llamadas a la API ----------
const unwrap = <T>(data: unknown): T =>
  ((data as { data?: T })?.data ?? data) as T;

const list = <T>(data: unknown): T[] =>
  Array.isArray(data) ? (data as T[]) : ((data as { data?: T[] })?.data ?? []);

export const documentacionService = {
  getAll: async (): Promise<DocumentacionPersonalDto[]> => {
    const { data } = await apiClient.get(API_ENDPOINTS.PERSONAL_DOCUMENTACION.LIST);
    return list<DocumentacionPersonalDto>(data);
  },
  getById: async (id: number | string): Promise<DocumentacionPersonalDto> => {
    const { data } = await apiClient.get(API_ENDPOINTS.PERSONAL_DOCUMENTACION.DETAIL(id));
    return unwrap<DocumentacionPersonalDto>(data);
  },
  create: async (form: PersonalDocumentacionFormData): Promise<DocumentacionPersonalDto> => {
    const { data } = await apiClient.post(
      API_ENDPOINTS.PERSONAL_DOCUMENTACION.CREATE,
      documentacionToPayload(form)
    );
    return unwrap<DocumentacionPersonalDto>(data);
  },
  update: async (
    id: number | string,
    form: PersonalDocumentacionFormData
  ): Promise<DocumentacionPersonalDto> => {
    const { data } = await apiClient.put(
      API_ENDPOINTS.PERSONAL_DOCUMENTACION.UPDATE(id),
      documentacionToPayload(form)
    );
    return unwrap<DocumentacionPersonalDto>(data);
  },
  remove: async (id: number | string): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.PERSONAL_DOCUMENTACION.DELETE(id));
  },
};

export const registroService = {
  getAll: async (): Promise<RegistroAdministrativoDto[]> => {
    const { data } = await apiClient.get(API_ENDPOINTS.PERSONAL_REGISTRO.LIST);
    return list<RegistroAdministrativoDto>(data);
  },
  getById: async (id: number | string): Promise<RegistroAdministrativoDto> => {
    const { data } = await apiClient.get(API_ENDPOINTS.PERSONAL_REGISTRO.DETAIL(id));
    return unwrap<RegistroAdministrativoDto>(data);
  },
  create: async (form: RegistroAdministrativoFormData): Promise<RegistroAdministrativoDto> => {
    const { data } = await apiClient.post(
      API_ENDPOINTS.PERSONAL_REGISTRO.CREATE,
      registroToPayload(form)
    );
    return unwrap<RegistroAdministrativoDto>(data);
  },
  update: async (
    id: number | string,
    form: RegistroAdministrativoFormData
  ): Promise<RegistroAdministrativoDto> => {
    const { data } = await apiClient.put(
      API_ENDPOINTS.PERSONAL_REGISTRO.UPDATE(id),
      registroToPayload(form)
    );
    return unwrap<RegistroAdministrativoDto>(data);
  },
  remove: async (id: number | string): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.PERSONAL_REGISTRO.DELETE(id));
  },
};
