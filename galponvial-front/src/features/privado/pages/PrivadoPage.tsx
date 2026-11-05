// galponvial-front/src/features/privado/pages/PrivadoPage.tsx
import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useAdminPermissions } from "@/features/usuarios/hooks/useAdminPermissions";
import {
  enviarMensajePrivado,
  getMisMensajesPrivados,
  type MensajePrivado,
} from "../services/privadoService";

type Vista = "chat" | "mensajes";

const MAX_ASUNTO = 150;
const MAX_TEXTO = 2000;

const formatearFecha = (iso: string) =>
  new Date(iso).toLocaleString("es-AR", { dateStyle: "short", timeStyle: "short" });

export default function PrivadoPage() {
  const { isSuperAdmin } = useAdminPermissions();
  const superAdmin = isSuperAdmin();
  const [vista, setVista] = useState<Vista>("mensajes");
  const [asunto, setAsunto] = useState("");
  const [texto, setTexto] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [aviso, setAviso] = useState<{ ok: boolean; texto: string } | null>(null);
  const [mensajes, setMensajes] = useState<MensajePrivado[]>([]);
  const [cargando, setCargando] = useState(true);
  const [errorLista, setErrorLista] = useState<string | null>(null);

  useEffect(() => {
    if (superAdmin) return;
    setCargando(true);
    setErrorLista(null);
    getMisMensajesPrivados()
      .then(setMensajes)
      .catch(() => setErrorLista("No se pudieron cargar tus mensajes."))
      .finally(() => setCargando(false));
  }, [superAdmin]);

  const handleEnviar = (e: FormEvent) => {
    e.preventDefault();
    const a = asunto.trim();
    const t = texto.trim();
    if (!a || !t) {
      setAviso({ ok: false, texto: "Completá el asunto y el mensaje." });
      return;
    }
    setEnviando(true);
    setAviso(null);
    enviarMensajePrivado(a, t)
      .then((nuevo) => {
        setMensajes((prev) => [nuevo, ...prev]);
        setAsunto("");
        setTexto("");
        setAviso({ ok: true, texto: "Mensaje enviado al superadmin." });
      })
      .catch(() => setAviso({ ok: false, texto: "No se pudo enviar el mensaje. Probá de nuevo." }))
      .finally(() => setEnviando(false));
  };

  const botones: { key: Vista; label: string }[] = [
    { key: "chat", label: "Chat" },
    { key: "mensajes", label: "Mensajes" },
  ];

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Privado</h1>
        <p className="text-sm text-gray-600 mt-1">
          Solo vos y el superadmin ven estos mensajes.
        </p>
        <div className="flex flex-wrap gap-3 mt-4">
          {botones.map((b) => (
            <button
              key={b.key}
              type="button"
              onClick={() => setVista(b.key)}
              className={`px-5 py-2 rounded-lg text-white font-medium transition-colors ${
                vista === b.key ? "bg-[#0062e3]" : "bg-gray-400 hover:bg-gray-500"
              }`}
            >
              {b.label}
            </button>
          ))}
        </div>
      </div>

      {vista === "chat" && (
        <div className="bg-white rounded-xl shadow border border-gray-200 p-6">
          <p className="text-gray-600 text-sm">
            El chat con el superadmin está en preparación. Mientras tanto, podés escribirle desde "Mensajes".
          </p>
        </div>
      )}

      {vista === "mensajes" && superAdmin && (
        <div className="bg-white rounded-xl shadow border border-gray-200 p-6">
          <p className="text-gray-600 text-sm">
            Los mensajes privados que te envían los admin te llegan en Notificaciones, pestaña "Privado".
          </p>
        </div>
      )}

      {vista === "mensajes" && !superAdmin && (
        <>
          <form
            onSubmit={handleEnviar}
            className="bg-white rounded-xl shadow border border-gray-200 p-6 space-y-4"
          >
            <h2 className="text-lg font-bold text-gray-900">Nuevo mensaje para el superadmin</h2>
            <div className="flex flex-col gap-1">
              <label htmlFor="privado-asunto" className="text-sm font-semibold text-gray-700">
                Asunto
              </label>
              <input
                id="privado-asunto"
                type="text"
                value={asunto}
                maxLength={MAX_ASUNTO}
                onChange={(e) => setAsunto(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="privado-texto" className="text-sm font-semibold text-gray-700">
                Mensaje
              </label>
              <textarea
                id="privado-texto"
                rows={4}
                value={texto}
                maxLength={MAX_TEXTO}
                onChange={(e) => setTexto(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 resize-y"
              />
              <span className="text-xs text-gray-500 self-end">
                {texto.length}/{MAX_TEXTO}
              </span>
            </div>
            {aviso && (
              <p className={`text-sm font-medium ${aviso.ok ? "text-green-700" : "text-red-600"}`}>
                {aviso.texto}
              </p>
            )}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={enviando}
                className="px-5 py-2 rounded-lg bg-[#0062e3] text-white font-medium hover:bg-[#004fb8] disabled:opacity-50 transition-colors"
              >
                {enviando ? "Enviando…" : "Enviar al superadmin"}
              </button>
            </div>
          </form>

          <div className="bg-white rounded-xl shadow border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-3">Mis mensajes enviados</h2>
            {cargando ? (
              <p className="text-gray-400 text-sm">Cargando mensajes…</p>
            ) : errorLista ? (
              <p className="text-red-500 text-sm">{errorLista}</p>
            ) : mensajes.length === 0 ? (
              <p className="text-gray-400 text-sm">Todavía no enviaste ningún mensaje.</p>
            ) : (
              <ul className="divide-y divide-gray-100">
                {mensajes.map((m) => (
                  <li key={m.id} className="py-3 flex justify-between items-start gap-4">
                    <div className="min-w-0">
                      <p className="font-bold text-[var(--color-navbar-nav)]">{m.asunto}</p>
                      <p className="text-sm text-gray-800 whitespace-pre-line break-words">{m.texto}</p>
                      <p className="text-xs text-gray-500 mt-1">{formatearFecha(m.fecha)}</p>
                    </div>
                    <span
                      className={`text-xs font-bold px-2 py-1 rounded-full whitespace-nowrap ${
                        m.leido ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {m.leido ? "Leído" : "Sin leer"}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  );
}
