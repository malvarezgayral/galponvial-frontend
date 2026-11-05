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
