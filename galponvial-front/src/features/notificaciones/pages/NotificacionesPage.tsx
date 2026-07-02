import { useState } from "react";

interface Notificacion {
  id: number;
  tipo: "service" | "reparacion" | "compras";
  titulo: string;
  mensaje: string;
  fecha: string;
}

type Tab = "service" | "reparacion" | "compras";

const TABS: { key: Tab; label: string }[] = [
  { key: "service", label: "Service" },
  { key: "reparacion", label: "Reparación" },
  { key: "compras", label: "Compras" },
];

const NOTIFICACIONES: Notificacion[] = [];

export default function NotificacionesPage() {
  const [tab, setTab] = useState<Tab>("service");

  const notificacionesDelTab = NOTIFICACIONES.filter((n) => n.tipo === tab);
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
        {notificacionesDelTab.length === 0 ? (
          <p className="text-gray-400 text-sm">
            Todavía no hay notificaciones de {labelActual}.
          </p>
        ) : (
          <ul className="divide-y divide-gray-100">
            {notificacionesDelTab.map((n) => (
              <li key={n.id} className="py-3">
                <p className="font-semibold text-gray-900">{n.titulo}</p>
                <p className="text-sm text-gray-600">{n.mensaje}</p>
                <p className="text-xs text-gray-400 mt-1">{n.fecha}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
