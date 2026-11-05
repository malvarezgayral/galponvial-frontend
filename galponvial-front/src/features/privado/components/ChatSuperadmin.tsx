// galponvial-front/src/features/privado/components/ChatSuperadmin.tsx
import { useCallback, useEffect, useRef, useState } from "react";
import ChatConversacion from "./ChatConversacion";
import {
  enviarChatAAdmin,
  enviarChatGrupo,
  getChatAdmins,
  getChatConAdmin,
  getChatGrupo,
  type ChatAdmin,
  type ChatMensaje,
} from "../services/privadoService";
import { REFRESCAR_CHAT_NO_LEIDOS } from "../hooks/useChatNoLeidos";

const formatearFecha = (iso: string) =>
  new Date(iso).toLocaleString("es-AR", { dateStyle: "short", timeStyle: "short" });

// "grupo" = Grupo Galpón Vial; si no, el DNI del admin elegido
type Clave = "grupo" | number;

// Vista del superadmin: elige un admin (o el grupo) y chatea
export default function ChatSuperadmin() {
  const [admins, setAdmins] = useState<ChatAdmin[]>([]);
  const [cargandoAdmins, setCargandoAdmins] = useState(true);
  const [errorAdmins, setErrorAdmins] = useState<string | null>(null);
  const [clave, setClave] = useState<Clave | null>(null);
  const [mensajes, setMensajes] = useState<ChatMensaje[]>([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Evita que una respuesta vieja pise la conversacion elegida
  const claveActual = useRef<Clave | null>(null);

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
    (c: Clave, silencioso: boolean) => {
      if (!silencioso) setCargando(true);
      const pedido = c === "grupo" ? getChatGrupo() : getChatConAdmin(c);
      pedido
        .then((data) => {
          if (claveActual.current !== c) return;
          setMensajes(data);
          setError(null);
          window.dispatchEvent(new Event(REFRESCAR_CHAT_NO_LEIDOS));
          cargarAdmins();
        })
        .catch(() => {
          if (claveActual.current === c && !silencioso) setError("No se pudo cargar la conversación.");
        })
        .finally(() => {
          if (claveActual.current === c && !silencioso) setCargando(false);
        });
    },
    [cargarAdmins],
  );

  useEffect(() => {
    claveActual.current = clave;
    if (clave === null) return;
    setMensajes([]);
    cargarChat(clave, false);
    const id = window.setInterval(() => cargarChat(clave, true), 15000);
    return () => window.clearInterval(id);
  }, [clave, cargarChat]);

  const adminElegido = typeof clave === "number" ? admins.find((a) => a.dni === clave) ?? null : null;

  const handleEnviar = async (texto: string) => {
    if (clave === null) return;
    const nuevo = clave === "grupo" ? await enviarChatGrupo(texto) : await enviarChatAAdmin(clave, texto);
    setMensajes((prev) => [...prev, nuevo]);
    cargarAdmins();
  };

  const estiloItem = (activo: boolean) =>
    `w-full text-left px-3 py-2 rounded-lg flex items-center justify-between gap-2 transition-colors ${
      activo ? "bg-blue-50 border border-[#0062e3]" : "hover:bg-gray-50 border border-transparent"
    }`;

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
                <button type="button" onClick={() => setClave(a.dni)} className={estiloItem(clave === a.dni)}>
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
        <div className="border-t border-gray-200 mt-3 pt-3">
          <button type="button" onClick={() => setClave("grupo")} className={estiloItem(clave === "grupo")}>
            <span className="min-w-0">
              <span className="block font-medium text-gray-900 truncate">Grupo Galpón Vial</span>
              <span className="block text-xs text-gray-500">Todos los admin · solo vos escribís</span>
            </span>
          </button>
        </div>
      </div>

      {clave === "grupo" ? (
        <ChatConversacion
          titulo="Grupo Galpón Vial"
          subtitulo="Lo ven todos los admin. Ellos no pueden responder."
          nombreOtro=""
          mensajes={mensajes}
          cargando={cargando}
          error={error}
          onEnviar={handleEnviar}
        />
      ) : adminElegido ? (
        <ChatConversacion
          titulo={`Chat con ${adminElegido.nombre} ${adminElegido.apellido}`}
          subtitulo="Solo vos y este admin ven esta conversación."
          nombreOtro={adminElegido.nombre}
          mensajes={mensajes}
          cargando={cargando}
          error={error}
          onEnviar={handleEnviar}
        />
      ) : (
        <div className="bg-white rounded-xl shadow border border-gray-200 p-6">
          <p className="text-gray-600 text-sm">
            Elegí un admin o el Grupo Galpón Vial para ver o empezar la conversación.
          </p>
        </div>
      )}
    </div>
  );
}
