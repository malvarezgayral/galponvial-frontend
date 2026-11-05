// galponvial-front/src/features/privado/pages/PrivadoPage.tsx
import { useState } from "react";
import { useAdminPermissions } from "@/features/usuarios/hooks/useAdminPermissions";
import ChatAdmin from "../components/ChatAdmin";
import ChatSuperadmin from "../components/ChatSuperadmin";
import MensajesBandeja from "../components/MensajesBandeja";

type Vista = "chat" | "mensajes";

// Privado: Chat (conversacion) y Mensajes (mensajes puntuales), siempre superadmin <-> un admin
export default function PrivadoPage() {
  const { isSuperAdmin } = useAdminPermissions();
  const superAdmin = isSuperAdmin();
  const [vista, setVista] = useState<Vista>(superAdmin ? "chat" : "mensajes");

  const botones: { key: Vista; label: string }[] = [
    { key: "chat", label: "Chat" },
    { key: "mensajes", label: "Mensajes" },
  ];

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Privado</h1>
        <p className="text-sm text-gray-600 mt-1">
          {superAdmin
            ? "Solo vos y cada admin ven lo que se escriben."
            : "Solo vos y el superadmin ven estos mensajes."}
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

      {vista === "chat" && (superAdmin ? <ChatSuperadmin /> : <ChatAdmin />)}
      {vista === "mensajes" && <MensajesBandeja superAdmin={superAdmin} />}
    </div>
  );
}
