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
  | "privada";

export interface Notificacion {
  id: number;
  tipo: Tab;
  titulo: string;
  mensaje: string;
  fecha: string;
  leida: boolean;
}
