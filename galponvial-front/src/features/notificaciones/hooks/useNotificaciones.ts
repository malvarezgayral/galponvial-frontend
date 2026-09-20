import { useEffect, useState } from "react";
import type { Notificacion, Tab } from "../types";
import { getNotificacionesPorTipo } from "../services/notificacionesService";

export function useNotificaciones(tipo: Tab) {
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [version, setVersion] = useState(0);
  const recargar = () => setVersion((v) => v + 1);

  useEffect(() => {
    let cancelado = false;
    setLoading(true);
    setError(null);

    getNotificacionesPorTipo(tipo)
      .then((data) => {
        if (!cancelado) setNotificaciones(data);
      })
      .catch(() => {
        if (!cancelado) setError("No se pudieron cargar las notificaciones.");
      })
      .finally(() => {
        if (!cancelado) setLoading(false);
      });

    return () => {
      cancelado = true;
    };
  }, [tipo, version]);

  return { notificaciones, loading, error, recargar };
}
