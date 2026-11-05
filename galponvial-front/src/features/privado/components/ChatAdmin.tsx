// galponvial-front/src/features/privado/components/ChatAdmin.tsx
import { useCallback, useEffect, useRef, useState } from "react";
import ChatConversacion from "./ChatConversacion";
import {
  enviarChatAdmin,
  getChatAdmin,
  getChatGrupo,
  getChatNoLeidosDetalle,
  type ChatMensaje,
} from "../services/privadoService";
import { REFRESCAR_CHAT_NO_LEIDOS } from "../hooks/useChatNoLeidos";

type Canal = "personal" | "grupo";

// Vista del admin: su chat con el superadmin y el "Grupo Galpón Vial" (solo lectura)
export default function ChatAdmin() {
  const [canal, setCanal] = useState<Canal>("personal");
  const [mensajes, setMensajes] = useState<ChatMensaje[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [grupoSinLeer, setGrupoSinLeer] = useState(0);
  const canalActual = useRef<Canal>("personal");

  const cargarGrupoSinLeer = useCallback(() => {
    getChatNoLeidosDetalle()
      .then((d) => setGrupoSinLeer(d.grupo ?? 0))
      .catch(() => undefined);
  }, []);

  const cargar = useCallback(
    (c: Canal, silencioso: boolean) => {
      if (!silencioso) setCargando(true);
      const pedido = c === "grupo" ? getChatGrupo() : getChatAdmin();
      pedido
        .then((data) => {
          if (canalActual.current !== c) return;
          setMensajes(data);
          setError(null);
          window.dispatchEvent(new Event(REFRESCAR_CHAT_NO_LEIDOS));
          cargarGrupoSinLeer();
        })
        .catch(() => {
          if (canalActual.current === c && !silencioso) setError("No se pudo cargar el chat.");
        })
        .finally(() => {
          if (canalActual.current === c && !silencioso) setCargando(false);
        });
    },
    [cargarGrupoSinLeer],
  );

  useEffect(() => {
    canalActual.current = canal;
    setMensajes([]);
    cargar(canal, false);
    const id = window.setInterval(() => cargar(canal, true), 15000);
    return () => window.clearInterval(id);
  }, [canal, cargar]);

  const handleEnviar = async (texto: string) => {
    const nuevo = await enviarChatAdmin(texto);
    setMensajes((prev) => [...prev, nuevo]);
  };

  const opciones: { key: Canal; titulo: string; detalle: string }[] = [
    { key: "personal", titulo: "Superadmin", detalle: "Chat personal" },
    { key: "grupo", titulo: "Grupo Galpón Vial", detalle: "Solo lectura" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-[280px_minmax(0,1fr)] gap-4 items-start">
      <div className="bg-white rounded-xl shadow border border-gray-200 p-4">
        <h2 className="text-lg font-bold text-gray-900 mb-3">Chats</h2>
        <ul className="space-y-1">
          {opciones.map((o) => (
            <li key={o.key}>
              <button
                type="button"
                onClick={() => setCanal(o.key)}
                className={`w-full text-left px-3 py-2 rounded-lg flex items-center justify-between gap-2 transition-colors ${
                  canal === o.key ? "bg-blue-50 border border-[#0062e3]" : "hover:bg-gray-50 border border-transparent"
                }`}
              >
                <span className="min-w-0">
                  <span className="block font-medium text-gray-900 truncate">{o.titulo}</span>
                  <span className="block text-xs text-gray-500">{o.detalle}</span>
                </span>
                {o.key === "grupo" && grupoSinLeer > 0 && (
                  <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1 rounded-full bg-red-600 text-white text-xs font-bold">
                    {grupoSinLeer}
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {canal === "personal" ? (
        <ChatConversacion
          titulo="Chat con el superadmin"
          subtitulo="Solo vos y el superadmin ven esta conversación."
          nombreOtro="Superadmin"
          mensajes={mensajes}
          cargando={cargando}
          error={error}
          onEnviar={handleEnviar}
        />
      ) : (
        <ChatConversacion
          titulo="Grupo Galpón Vial"
          subtitulo="Mensajes del superadmin para todos los admin."
          nombreOtro="Superadmin"
          mensajes={mensajes}
          cargando={cargando}
          error={error}
          onEnviar={async () => undefined}
          soloLectura="Solo el superadmin puede escribir en este grupo."
        />
      )}
    </div>
  );
}
