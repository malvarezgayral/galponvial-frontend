// galponvial-front/src/features/privado/hooks/useChatNoLeidos.ts
import { useEffect, useState } from "react";
import { getChatNoLeidos } from "../services/privadoService";

export const REFRESCAR_CHAT_NO_LEIDOS = "privado:refrescar";

// Cantidad de mensajes de chat sin leer (globito de "Privado" en la navbar)
export function useChatNoLeidos(habilitado: boolean): number {
  const [noLeidos, setNoLeidos] = useState(0);

  useEffect(() => {
    if (!habilitado) {
      setNoLeidos(0);
      return;
    }
    let vivo = true;
    const cargar = () => {
      getChatNoLeidos()
        .then((n) => {
          if (vivo) setNoLeidos(n);
        })
        .catch(() => undefined);
    };
    cargar();
    const id = window.setInterval(cargar, 60000);
    window.addEventListener(REFRESCAR_CHAT_NO_LEIDOS, cargar);
    return () => {
      vivo = false;
      window.clearInterval(id);
      window.removeEventListener(REFRESCAR_CHAT_NO_LEIDOS, cargar);
    };
  }, [habilitado]);

  return noLeidos;
}
