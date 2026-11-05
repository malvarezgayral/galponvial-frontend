// galponvial-front/src/features/privado/components/MensajesBandeja.tsx
import { useCallback, useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import {
  eliminarMensaje,
  enviarMensajeA,
  enviarMensajePrivado,
  getBandeja,
  getChatAdmins,
  marcarMensajeLeido,
  type ChatAdmin,
  type MensajeBandeja,
} from "../services/privadoService";
import { REFRESCAR_CHAT_NO_LEIDOS } from "../hooks/useChatNoLeidos";
import { REFRESCAR_NO_LEIDAS } from "@/features/notificaciones/hooks/useNoLeidas";

type Filtro = "recibidos" | "enviados";

const MAX_ASUNTO = 150;
const MAX_TEXTO = 2000;

const formatearFecha = (iso: string) =>
  new Date(iso).toLocaleString("es-AR", { dateStyle: "short", timeStyle: "short" });

const nombre = (m: MensajeBandeja) => `${m.nombreOtro} ${m.apellidoOtro}`.trim();

const refrescarGlobitos = () => {
  window.dispatchEvent(new Event(REFRESCAR_CHAT_NO_LEIDOS));
  window.dispatchEvent(new Event(REFRESCAR_NO_LEIDAS));
};

// Mensajes puntuales: superadmin <-> un admin (sin respuestas en hilo; eso es el Chat)
export default function MensajesBandeja({ superAdmin }: { superAdmin: boolean }) {
  const [mensajes, setMensajes] = useState<MensajeBandeja[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtro, setFiltro] = useState<Filtro>("recibidos");
  const [seleccionadoId, setSeleccionadoId] = useState<number | null>(null);
  const [componiendo, setComponiendo] = useState(false);

  const [admins, setAdmins] = useState<ChatAdmin[]>([]);
  const [para, setPara] = useState("");
  const [asunto, setAsunto] = useState("");
  const [texto, setTexto] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [aviso, setAviso] = useState<string | null>(null);

  const cargar = useCallback(() => {
    setCargando(true);
    setError(null);
    return getBandeja()
      .then(setMensajes)
      .catch(() => setError("No se pudieron cargar los mensajes."))
      .finally(() => setCargando(false));
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  useEffect(() => {
    if (!superAdmin) return;
    getChatAdmins()
      .then(setAdmins)
      .catch(() => setAdmins([]));
  }, [superAdmin]);

  const visibles = useMemo(
    () => mensajes.filter((m) => (filtro === "recibidos" ? m.recibido : !m.recibido)),
    [mensajes, filtro],
  );
  const sinLeer = useMemo(() => mensajes.filter((m) => m.recibido && !m.leido).length, [mensajes]);
  const seleccionado = mensajes.find((m) => m.id === seleccionadoId) ?? null;

  const abrir = (m: MensajeBandeja) => {
    setComponiendo(false);
    setSeleccionadoId(m.id);
    if (m.recibido && !m.leido) {
      setMensajes((prev) => prev.map((x) => (x.id === m.id ? { ...x, leido: true } : x)));
      marcarMensajeLeido(m.id)
        .catch(() => undefined)
        .finally(refrescarGlobitos);
    }
  };

  const nuevo = () => {
    setSeleccionadoId(null);
    setComponiendo(true);
    setAviso(null);
  };

  const handleEnviar = (e: FormEvent) => {
    e.preventDefault();
    const a = asunto.trim();
    const t = texto.trim();
    if (superAdmin && !para) {
      setAviso("Elegí a qué admin se lo mandás.");
      return;
    }
    if (!a || !t) {
      setAviso("Completá el asunto y el mensaje.");
      return;
    }
    setEnviando(true);
    setAviso(null);
    const envio = superAdmin
      ? enviarMensajeA(Number(para), a, t).then((m) => m.id)
      : enviarMensajePrivado(a, t).then((m) => m.id);
    envio
      .then((id) => {
        setAsunto("");
        setTexto("");
        setPara("");
        setComponiendo(false);
        setFiltro("enviados");
        return cargar().then(() => setSeleccionadoId(id));
      })
      .catch(() => setAviso("No se pudo enviar el mensaje. Probá de nuevo."))
      .finally(() => setEnviando(false));
  };

  const handleEliminar = (m: MensajeBandeja) => {
    if (!window.confirm("¿Eliminar este mensaje? Se quita solo de tu lista.")) return;
    eliminarMensaje(m.id)
      .then(() => {
        setMensajes((prev) => prev.filter((x) => x.id !== m.id));
        setSeleccionadoId(null);
        refrescarGlobitos();
      })
      .catch(() => window.alert("No se pudo eliminar el mensaje."));
  };

  const filtros: { key: Filtro; label: string }[] = [
    { key: "recibidos", label: "Recibidos" },
    { key: "enviados", label: "Enviados" },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2">
          {filtros.map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => {
                setFiltro(f.key);
                setSeleccionadoId(null);
              }}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${
                filtro === f.key
                  ? "bg-[#0062e3] text-white"
                  : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              {f.label}
              {f.key === "recibidos" && sinLeer > 0 && (
                <span className="ml-2 inline-flex items-center justify-center min-w-[20px] h-5 px-1 rounded-full bg-red-600 text-white text-xs font-bold">
                  {sinLeer}
                </span>
              )}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={nuevo}
          className="px-5 py-2 rounded-lg bg-[#0062e3] text-white font-medium hover:bg-[#004fb8] transition-colors"
        >
          Nuevo mensaje
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[340px_minmax(0,1fr)] gap-4 items-start">
        <div className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden">
          {cargando ? (
            <p className="text-gray-400 text-sm p-4">Cargando mensajes…</p>
          ) : error ? (
            <p className="text-red-500 text-sm p-4">{error}</p>
          ) : visibles.length === 0 ? (
            <p className="text-gray-400 text-sm p-4">
              {filtro === "recibidos" ? "No tenés mensajes recibidos." : "Todavía no enviaste mensajes."}
            </p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {visibles.map((m) => {
                const activo = m.id === seleccionadoId;
                const sinLeerEste = m.recibido && !m.leido;
                return (
                  <li key={m.id}>
                    <button
                      type="button"
                      onClick={() => abrir(m)}
                      className={`w-full text-left px-4 py-3 flex flex-col gap-0.5 transition-colors ${
                        activo ? "bg-blue-50" : "hover:bg-gray-50"
                      }`}
                    >
                      <span className="flex justify-between gap-2 text-sm">
                        <span className={`truncate ${sinLeerEste ? "font-bold text-gray-900" : "font-medium text-gray-700"}`}>
                          {sinLeerEste && <span className="inline-block w-2 h-2 rounded-full bg-[#0062e3] mr-2 align-middle" />}
                          {m.recibido ? nombre(m) : `Para: ${nombre(m)}`}
                        </span>
                        <span className="text-xs text-gray-500 whitespace-nowrap">{formatearFecha(m.fecha)}</span>
                      </span>
                      <span className={`text-sm truncate ${activo ? "text-[#0062e3] font-semibold" : "text-gray-900 font-semibold"}`}>
                        {m.asunto}
                      </span>
                      <span className="text-xs text-gray-500 truncate">{m.texto}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {componiendo ? (
          <form onSubmit={handleEnviar} className="bg-white rounded-xl shadow border border-gray-200 p-6 space-y-4">
            <h2 className="text-lg font-bold text-gray-900">
              {superAdmin ? "Nuevo mensaje para un admin" : "Nuevo mensaje para el superadmin"}
            </h2>
            {superAdmin && (
              <div className="flex flex-col gap-1">
                <label htmlFor="bandeja-para" className="text-sm font-semibold text-gray-700">
                  Para
                </label>
                <select
                  id="bandeja-para"
                  value={para}
                  onChange={(e) => setPara(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 bg-white"
                >
                  <option value="">Elegí un admin</option>
                  {admins.map((a) => (
                    <option key={a.dni} value={a.dni}>
                      {a.nombre} {a.apellido}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <div className="flex flex-col gap-1">
              <label htmlFor="bandeja-asunto" className="text-sm font-semibold text-gray-700">
                Asunto
              </label>
              <input
                id="bandeja-asunto"
                type="text"
                value={asunto}
                maxLength={MAX_ASUNTO}
                onChange={(e) => setAsunto(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="bandeja-texto" className="text-sm font-semibold text-gray-700">
                Mensaje
              </label>
              <textarea
                id="bandeja-texto"
                rows={6}
                value={texto}
                maxLength={MAX_TEXTO}
                onChange={(e) => setTexto(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 resize-y"
              />
              <span className="text-xs text-gray-500 self-end">
                {texto.length}/{MAX_TEXTO}
              </span>
            </div>
            {aviso && <p className="text-sm font-medium text-red-600">{aviso}</p>}
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setComponiendo(false)}
                className="px-5 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={enviando}
                className="px-5 py-2 rounded-lg bg-[#0062e3] text-white font-medium hover:bg-[#004fb8] disabled:opacity-50 transition-colors"
              >
                {enviando ? "Enviando…" : "Enviar"}
              </button>
            </div>
          </form>
        ) : seleccionado ? (
          <article className="bg-white rounded-xl shadow border border-gray-200 p-6 space-y-4">
            <div className="flex flex-wrap justify-between items-start gap-3">
              <div>
                <h2 className="text-xl font-bold text-gray-900 break-words">{seleccionado.asunto}</h2>
                <p className="text-sm text-gray-600">
                  {seleccionado.recibido ? "De " : "Para "}
                  <span className="font-semibold text-gray-900">{nombre(seleccionado)}</span>
                  {" · "}
                  {formatearFecha(seleccionado.fecha)}
                  {!seleccionado.recibido && (seleccionado.leido ? " · Leído" : " · Sin leer")}
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleEliminar(seleccionado)}
                className="px-4 py-2 rounded-lg border border-red-300 text-red-700 font-semibold hover:bg-red-50"
              >
                Eliminar
              </button>
            </div>
            <hr className="border-gray-200" />
            <p className="text-gray-800 whitespace-pre-line break-words leading-relaxed">{seleccionado.texto}</p>
          </article>
        ) : (
          <div className="bg-white rounded-xl shadow border border-gray-200 p-6">
            <p className="text-gray-600 text-sm">Elegí un mensaje de la lista o tocá "Nuevo mensaje".</p>
          </div>
        )}
      </div>
    </div>
  );
}
