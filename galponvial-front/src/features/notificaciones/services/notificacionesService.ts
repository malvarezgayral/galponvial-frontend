// galponvial-front/src/features/notificaciones/services/notificacionesService.ts
import { apiClient } from "@/services/api";
import type { Notificacion, Tab } from "../types";

export async function getNotificacionesPorTipo(tipo: Tab): Promise<Notificacion[]> {
  const { data } = await apiClient.get<Notificacion[]>("/notificaciones", {
    params: { tipo },
  });
  return data;
}

export async function marcarComoLeida(id: number): Promise<void> {
  await apiClient.patch(`/notificaciones/${id}/leida`);
}