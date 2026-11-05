// galponvial-front/src/features/privado/services/privadoService.ts
import { apiClient } from "@/services/api";

export interface MensajePrivado {
  id: number;
  asunto: string | null;
  texto: string;
  fecha: string;
  leido: boolean;
}

export async function getMisMensajesPrivados(): Promise<MensajePrivado[]> {
  const { data } = await apiClient.get<MensajePrivado[]>("/mensajes-privados/mios");
  return data;
}

export async function enviarMensajePrivado(asunto: string, texto: string): Promise<MensajePrivado> {
  const { data } = await apiClient.post<MensajePrivado>("/mensajes-privados", { asunto, texto });
  return data;
}

// ---------- Chat (superadmin <-> un admin) ----------

export interface ChatMensaje {
  id: number;
  texto: string;
  fecha: string;
  mio: boolean;
  leido: boolean;
}

export interface ChatAdmin {
  dni: number;
  nombre: string;
  apellido: string;
  sinLeer: number;
  ultimo: string | null;
}

// Admin: su conversacion con el superadmin
export async function getChatAdmin(): Promise<ChatMensaje[]> {
  const { data } = await apiClient.get<ChatMensaje[]>("/mensajes-privados/chat");
  return data;
}

export async function enviarChatAdmin(texto: string): Promise<ChatMensaje> {
  const { data } = await apiClient.post<ChatMensaje>("/mensajes-privados/chat", { texto });
  return data;
}

// Superadmin: lista de admins y conversacion con uno
export async function getChatAdmins(): Promise<ChatAdmin[]> {
  const { data } = await apiClient.get<ChatAdmin[]>("/mensajes-privados/chat/admins");
  return data;
}

export async function getChatConAdmin(dni: number): Promise<ChatMensaje[]> {
  const { data } = await apiClient.get<ChatMensaje[]>(`/mensajes-privados/chat/${dni}`);
  return data;
}

export async function enviarChatAAdmin(dni: number, texto: string): Promise<ChatMensaje> {
  const { data } = await apiClient.post<ChatMensaje>(`/mensajes-privados/chat/${dni}`, { texto });
  return data;
}

// Para el globito de la navbar
export async function getChatNoLeidos(): Promise<number> {
  const { data } = await apiClient.get<{ noLeidos: number }>("/mensajes-privados/chat/no-leidos");
  return data.noLeidos;
}

// ---------- Bandeja de Mensajes (superadmin <-> un admin) ----------

export interface MensajeBandeja {
  id: number;
  asunto: string | null;
  texto: string;
  fecha: string;
  recibido: boolean;
  dniOtro: number;
  nombreOtro: string;
  apellidoOtro: string;
  leido: boolean;
}

export async function getBandeja(): Promise<MensajeBandeja[]> {
  const { data } = await apiClient.get<MensajeBandeja[]>("/mensajes-privados/bandeja");
  return data;
}

// Solo superadmin: escribirle a un admin elegido
export async function enviarMensajeA(dni: number, asunto: string, texto: string): Promise<MensajeBandeja> {
  const { data } = await apiClient.post<MensajeBandeja>(`/mensajes-privados/para/${dni}`, { asunto, texto });
  return data;
}

export async function marcarMensajeLeido(id: number): Promise<void> {
  await apiClient.patch(`/mensajes-privados/${id}/leido`);
}

export async function eliminarMensaje(id: number): Promise<void> {
  await apiClient.delete(`/mensajes-privados/${id}`);
}
