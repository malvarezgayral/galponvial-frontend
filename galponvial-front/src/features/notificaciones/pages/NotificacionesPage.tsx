import { useState } from "react";
import type { Tab } from "../types";
import { useNotificaciones } from "../hooks/useNotificaciones";
import { marcarComoLeida } from "../services/notificacionesService";

const TABS: { key: Tab; label: string }[] = [
  { key: "service", label: "Service" },
  { key: "reparacion", label: "Reparación" },
  { key: "compras", label: "Compras" },
  { key: "incidentes", label: "Incidentes" },
  { key: "personal", label: "Personal" },
  { key: "recordatorio", label: "Recordatorio" },
  { key: "combustible", label: "Combustible" },
  { key: "proveedores", label: "Proveedores" },
  { key: "lubricentro", label: "Lubricentro" },
  { key: "privada", label: "Privado" },
];

export default function NotificacionesPage() {
  const [tab, setTab] = useState<Tab>("service");
  const { notificaciones, loading, error } = useNotificaciones(tab);
  const labelActual = TABS.find((t) => t.key === tab)?.label ?? "";

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Notificaciones</h1>
        <div className="flex flex-wrap gap-3 mt-4">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-5 py-2 rounded-lg text-white font-medium transition-colors ${
                tab === t.key ? "bg-[#0062e3]" : "bg-gray-400 hover:bg-gray-500"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>
      <div className="bg-white rounded-xl shadow border border-gray-200 p-6">
        {loading ? (
          <p className="text-gray-400 text-sm">Cargando notificaciones…</p>
        ) : error ? (
          <p className="text-red-500 text-sm">{error}</p>
        ) : notificaciones.length === 0 ? (
          <p className="text-gray-400 text-sm">
            Todavía no hay notificaciones de {labelActual}.
          </p>
        ) : (
          <ul className="divide-y divide-gray-100">
            {notificaciones.map((n) => (
              <li
                key={n.id}
                onClick={() => marcarComoLeida(n.id)}
                className={`py-3 flex justify-between items-start cursor-pointer hover:bg-gray-50 -mx-2 px-2 rounded-lg transition-colors ${
                  n.leida ? "opacity-60" : ""
                }`}
              >
                <div>
                  <p className="font-semibold text-gray-900">{n.titulo}</p>
                  <p className="text-sm text-gray-600">{n.mensaje}</p>
                  <p className="text-xs text-gray-400 mt-1">{n.fecha}</p>
                </div>
                {!n.leida && (
                  <span className="w-2 h-2 rounded-full bg-[#0062e3] mt-1.5 flex-shrink-0" />
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
