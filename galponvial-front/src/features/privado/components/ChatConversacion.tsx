// galponvial-front/src/features/privado/components/ChatConversacion.tsx
import { useEffect, useRef, useState } from "react";
import type { FormEvent, KeyboardEvent } from "react";
import type { ChatMensaje } from "../services/privadoService";

interface Props {
  titulo: string;
  subtitulo?: string;
  nombreOtro: string;
  mensajes: ChatMensaje[];
  cargando: boolean;
  error: string | null;
  onEnviar: (texto: string) => Promise<void>;
}

const MAX_TEXTO = 2000;

const formatearFecha = (iso: string) =>
  new Date(iso).toLocaleString("es-AR", { dateStyle: "short", timeStyle: "short" });

export default function ChatConversacion({
  titulo,
  subtitulo,
  nombreOtro,
  mensajes,
  cargando,
  error,
  onEnviar,
}: Props) {
  const [texto, setTexto] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [errorEnvio, setErrorEnvio] = useState<string | null>(null);
  const contenedorRef = useRef<HTMLDivElement>(null);

  // Siempre mostrar el ultimo mensaje
  useEffect(() => {
    const c = contenedorRef.current;
    if (c) c.scrollTop = c.scrollHeight;
  }, [mensajes.length]);

  const enviar = () => {
    const t = texto.trim();
    if (!t || enviando) return;
    setEnviando(true);
    setErrorEnvio(null);
    onEnviar(t)
      .then(() => setTexto(""))
      .catch(() => setErrorEnvio("No se pudo enviar. Probá de nuevo."))
      .finally(() => setEnviando(false));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    enviar();
  };

  // Enter envia; Shift+Enter hace salto de linea
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      enviar();
    }
  };

  return (
    <div className="bg-white rounded-xl shadow border border-gray-200 flex flex-col h-[560px] min-w-0">
      <div className="px-5 py-4 border-b border-gray-200">
        <h2 className="text-lg font-bold text-gray-900">{titulo}</h2>
        {subtitulo && <p className="text-sm text-gray-600">{subtitulo}</p>}
      </div>

      <div ref={contenedorRef} className="flex-1 overflow-y-auto bg-gray-50 px-5 py-4 space-y-3">
        {cargando ? (
          <p className="text-gray-400 text-sm">Cargando conversación…</p>
        ) : error ? (
          <p className="text-red-500 text-sm">{error}</p>
        ) : mensajes.length === 0 ? (
          <p className="text-gray-400 text-sm">Todavía no hay mensajes. Escribí el primero.</p>
        ) : (
          mensajes.map((m) => (
            <div key={m.id} className={`flex ${m.mio ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[75%] flex flex-col ${m.mio ? "items-end" : "items-start"}`}>
                <div
                  className={`px-4 py-2 rounded-2xl text-sm whitespace-pre-line break-words ${
                    m.mio
                      ? "bg-[#0062e3] text-white rounded-br-sm"
                      : "bg-white border border-gray-200 text-gray-800 rounded-bl-sm"
                  }`}
                >
                  {m.texto}
                </div>
                <span className="text-xs text-gray-500 mt-1">
                  {m.mio ? "" : `${nombreOtro} · `}
                  {formatearFecha(m.fecha)}
                  {m.mio ? (m.leido ? " · Leído" : " · Enviado") : ""}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      <form onSubmit={handleSubmit} className="border-t border-gray-200 px-5 py-3 flex gap-3 items-end">
        <div className="flex-1 flex flex-col gap-1">
          <label htmlFor="chat-texto" className="sr-only">
            Mensaje
          </label>
          <textarea
            id="chat-texto"
            rows={2}
            value={texto}
            maxLength={MAX_TEXTO}
            onChange={(e) => setTexto(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Escribí un mensaje… (Enter envía, Shift+Enter salto de línea)"
            className="border border-gray-300 rounded-lg px-3 py-2 resize-none"
          />
          {errorEnvio && <p className="text-sm text-red-600">{errorEnvio}</p>}
        </div>
        <button
          type="submit"
          disabled={enviando || !texto.trim()}
          className="px-5 py-2 rounded-lg bg-[#0062e3] text-white font-medium hover:bg-[#004fb8] disabled:opacity-50 transition-colors"
        >
          {enviando ? "Enviando…" : "Enviar"}
        </button>
      </form>
    </div>
  );
}
