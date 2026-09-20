import { useState, useMemo } from "react";
import type { Tab } from "../types";
import { useNotificaciones } from "../hooks/useNotificaciones";
import { marcarComoLeida } from "../services/notificacionesService";
import { useAdminPermissions } from "@/features/usuarios/hooks/useAdminPermissions";
import { ValidPermissions } from "@/features/usuarios/types";

const TABS: { key: Tab; label: string }[] = [
  { key: "service", label: "Service" },
  { key: "reparacion", label: "Reparación" },
  { key: "compras", label: "Compras" },
  { key: "incidentes", label: "Incidentes" },
  { key: "personal", label: "Personal" },
  { key: "recordatorio", label: "Recordatorios" },
  { key: "combustible", label: "Combustible" },
  { key: "proveedores", label: "Proveedores" },
  { key: "lubricentro", label: "Lubricentro" },
  { key: "privada", label: "Privado" },
  { key: "almacen", label: "Almacén" },
];

// Tabs visibles para un admin acotado a Almacén (sin acceso global all:read/all:write)
const TABS_ALMACEN: Tab[] = ["almacen", "recordatorio", "privada"];

export default function NotificacionesPage() {
  const { hasFullAccess, hasPermission, isSuperAdmin } = useAdminPermissions();

  const esAdminAcotadoAlmacen = useMemo(() => {
    if (hasFullAccess()) return false;
    return (
      hasPermission(ValidPermissions.ALMACEN_TALLER_READ) ||
      hasPermission(ValidPermissions.ALMACEN_COMUN_READ) ||
      hasPermission(ValidPermissions.ALMACEN_TALLER_WRITE) ||
      hasPermission(ValidPermissions.ALMACEN_COMUN_WRITE)
    );
  }, [hasFullAccess, hasPermission]);

  const tabsVisibles = useMemo(() => {
    const base = esAdminAcotadoAlmacen
      ? TABS.filter((t) => TABS_ALMACEN.includes(t.key))
      : TABS;
    // Personal es confidencial: solo la ve el superadmin
    return isSuperAdmin() ? base : base.filter((t) => t.key !== "personal");
  }, [esAdminAcotadoAlmacen, isSuperAdmin]);

  const [tab, setTab] = useState<Tab>(
    esAdminAcotadoAlmacen ? "almacen" : "service",
  );
  const { notificaciones, loading, error } = useNotificaciones(tab);
  const labelActual = tabsVisibles.find((t) => t.key === tab)?.label ?? "";

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Notificaciones</h1>
        <div className="flex flex-wrap gap-3 mt-4">
          {tabsVisibles.map((t) => (
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
