export type Tab =
  | "service"
  | "reparacion"
  | "compras"
  | "incidentes"
  | "personal"
  | "recordatorio"
  | "combustible"
  | "proveedores"
  | "lubricentro"
  | "combustible-carro"
  | "privada"
  | "almacen";

export interface Notificacion {
  id: number;
  tipo: Tab;
  titulo: string;
  mensaje: string;
  fecha: string;
  leida: boolean;
  referenciaTipo?: string | null;
  referenciaId?: number | null;
}
