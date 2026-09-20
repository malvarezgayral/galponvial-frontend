import { useCallback, useEffect, useState } from "react";
import { getNoLeidas } from "../services/notificacionesService";

// Evento global para refrescar el conteo desde cualquier lugar
export const REFRESCAR_NO_LEIDAS = "notificaciones:refrescar";

export function useNoLeidas(activo: boolean = true) {
  const [conteo, setConteo] = useState<Record<string, number>>({});

  const refrescar = useCallback(() => {
    if (!activo) return;
    getNoLeidas()
      .then(setConteo)
      .catch(() => setConteo({}));
  }, [activo]);

  useEffect(() => {
    if (!activo) {
      setConteo({});
      return;
    }
    refrescar();
    const id = window.setInterval(refrescar, 60000);
    window.addEventListener(REFRESCAR_NO_LEIDAS, refrescar);
    return () => {
      window.clearInterval(id);
      window.removeEventListener(REFRESCAR_NO_LEIDAS, refrescar);
    };
  }, [activo, refrescar]);

  const total = Object.values(conteo).reduce((a, b) => a + b, 0);
  return { conteo, total, refrescar };
}
