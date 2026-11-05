// galponvial-front/src/features/privado/components/ChatAdmin.tsx
import { useCallback, useEffect, useState } from "react";
import ChatConversacion from "./ChatConversacion";
import { enviarChatAdmin, getChatAdmin, type ChatMensaje } from "../services/privadoService";
import { REFRESCAR_CHAT_NO_LEIDOS } from "../hooks/useChatNoLeidos";

// Vista del admin: una sola conversacion, con el superadmin
export default function ChatAdmin() {
  const [mensajes, setMensajes] = useState<ChatMensaje[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cargar = useCallback((silencioso: boolean) => {
    if (!silencioso) setCargando(true);
    getChatAdmin()
      .then((data) => {
        setMensajes(data);
        setError(null);
        window.dispatchEvent(new Event(REFRESCAR_CHAT_NO_LEIDOS));
      })
      .catch(() => {
        if (!silencioso) setError("No se pudo cargar el chat.");
      })
      .finally(() => {
        if (!silencioso) setCargando(false);
      });
  }, []);

  useEffect(() => {
    cargar(false);
    const id = window.setInterval(() => cargar(true), 15000);
    return () => window.clearInterval(id);
  }, [cargar]);

  const handleEnviar = async (texto: string) => {
    const nuevo = await enviarChatAdmin(texto);
    setMensajes((prev) => [...prev, nuevo]);
  };

  return (
    <ChatConversacion
      titulo="Chat con el superadmin"
      subtitulo="Solo vos y el superadmin ven esta conversación."
      nombreOtro="Superadmin"
      mensajes={mensajes}
      cargando={cargando}
      error={error}
      onEnviar={handleEnviar}
    />
  );
}
