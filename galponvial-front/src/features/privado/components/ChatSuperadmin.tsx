// galponvial-front/src/features/privado/components/ChatSuperadmin.tsx
import { useCallback, useEffect, useRef, useState } from "react";
import ChatConversacion from "./ChatConversacion";
import {
  enviarChatAAdmin,
  getChatAdmins,
  getChatConAdmin,
  type ChatAdmin,
  type ChatMensaje,
} from "../services/privadoService";
import { REFRESCAR_CHAT_NO_LEIDOS } from "../hooks/useChatNoLeidos";

const formatearFecha = (iso: string) =>
  new Date(iso).toLocaleString("es-AR", { dateStyle: "short", timeStyle: "short" });

// Vista del superadmin: elige un admin y chatea con el
export default function ChatSuperadmin() {
  const [admins, setAdmins] = useState<ChatAdmin[]>([]);
  const [cargandoAdmins, setCargandoAdmins] = useState(true);
  const [errorAdmins, setErrorAdmins] = useState<string | null>(null);
  const [seleccionado, setSeleccionado] = useState<ChatAdmin | null>(null);
  const [mensajes, setMensajes] = useState<ChatMensaje[]>([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Evita que una respuesta vieja pise la conversacion de otro admin
  const dniActual = useRef<number | null>(null);

  const cargarAdmins = useCallback(() => {
    getChatAdmins()
      .then((data) => {
        setAdmins(data);
        setErrorAdmins(null);
      })
      .catch(() => setErrorAdmins("No se pudo cargar la lista de admins."))
      .finally(() => setCargandoAdmins(false));
  }, []);

  useEffect(() => {
    cargarAdmins();
    const id = window.setInterval(cargarAdmins, 30000);
    return () => window.clearInterval(id);
  }, [cargarAdmins]);

  const cargarChat = useCallback(
    (dni: number, silencioso: boolean) => {
      if (!silencioso) setCargando(true);
      getChatConAdmin(dni)
        .then((data) => {
          if (dniActual.current !== dni) return;
          setMensajes(data);
          setError(null);
          window.dispatchEvent(new Event(REFRESCAR_CHAT_NO_LEIDOS));
          cargarAdmins();
        })
        .catch(() => {
          if (dniActual.current === dni && !silencioso) setError("No se pudo cargar la conversación.");
        })
        .finally(() => {
          if (dniActual.current === dni && !silencioso) setCargando(false);
        });
    },
    [cargarAdmins],
  );

  const dniSeleccionado = seleccionado?.dni ?? null;

  useEffect(() => {
    dniActual.current = dniSeleccionado;
    if (dniSeleccionado === null) return;
    setMensajes([]);
    cargarChat(dniSeleccionado, false);
    const id = window.setInterval(() => cargarChat(dniSeleccionado, true), 15000);
    return () => window.clearInterval(id);
  }, [dniSeleccionado, cargarChat]);

  const handleEnviar = async (texto: string) => {
    if (!seleccionado) return;
    const nuevo = await enviarChatAAdmin(seleccionado.dni, texto);
    setMensajes((prev) => [...prev, nuevo]);
    cargarAdmins();
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-[280px_minmax(0,1fr)] gap-4 items-start">
      <div className="bg-white rounded-xl shadow border border-gray-200 p-4">
        <h2 className="text-lg font-bold text-gray-900 mb-3">Admins</h2>
        {cargandoAdmins ? (
          <p className="text-gray-400 text-sm">Cargando…</p>
        ) : errorAdmins ? (
          <p className="text-red-500 text-sm">{errorAdmins}</p>
        ) : admins.length === 0 ? (
          <p className="text-gray-400 text-sm">No hay admins activos.</p>
        ) : (
          <ul className="space-y-1">
            {admins.map((a) => (
              <li key={a.dni}>
                <button
                  type="button"
                  onClick={() => setSeleccionado(a)}
                  className={`w-full text-left px-3 py-2 rounded-lg flex items-center justify-between gap-2 transition-colors ${
                    seleccionado?.dni === a.dni ? "bg-blue-50 border border-[#0062e3]" : "hover:bg-gray-50 border border-transparent"
                  }`}
                >
                  <span className="min-w-0">
                    <span className="block font-medium text-gray-900 truncate">
                      {a.nombre} {a.apellido}
                    </span>
                    <span className="block text-xs text-gray-500">
                      {a.ultimo ? formatearFecha(a.ultimo) : "Sin mensajes"}
                    </span>
                  </span>
                  {a.sinLeer > 0 && (
                    <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1 rounded-full bg-red-600 text-white text-xs font-bold">
                      {a.sinLeer}
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {seleccionado ? (
        <ChatConversacion
          titulo={`Chat con ${seleccionado.nombre} ${seleccionado.apellido}`}
          subtitulo="Solo vos y este admin ven esta conversación."
          nombreOtro={seleccionado.nombre}
          mensajes={mensajes}
          cargando={cargando}
          error={error}
          onEnviar={handleEnviar}
        />
      ) : (
        <div className="bg-white rounded-xl shadow border border-gray-200 p-6">
          <p className="text-gray-600 text-sm">
            Elegí un admin de la lista para ver o empezar la conversación.
          </p>
        </div>
      )}
    </div>
  );
}
