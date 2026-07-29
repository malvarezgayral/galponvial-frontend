import type { Notificacion, Tab } from "../types";

// TODO: cuando el backend esté listo, reemplazar el cuerpo de esta función por:
// const res = await fetch(`${import.meta.env.VITE_API_URL}/notificaciones?tipo=${tipo}`);
// if (!res.ok) throw new Error("Error al obtener notificaciones");
// return res.json();
export async function getNotificacionesPorTipo(tipo: Tab): Promise<Notificacion[]> {
  return [];
}

export async function marcarComoLeida(id: number): Promise<void> {
  // TODO: PATCH ${import.meta.env.VITE_API_URL}/notificaciones/${id}/leida
}
