import { useState } from "react";
import TiposLubricantePanel from "./TiposLubricantePanel";
import EditarLubricantePanel from "./EditarLubricantePanel";

type Pestana = "tipos" | "cargas";

/** Eliminar/Editar Lubricante: pestaña de tipos (la lista) y pestaña de cargas (Agregar Lubricante). */
export default function EliminarEditarLubricantePanel() {
  const [pestana, setPestana] = useState<Pestana>("tipos");
  const [cantidadTipos, setCantidadTipos] = useState<number | null>(null);

  const tabCls = (activa: boolean) =>
    `px-1 pb-2 -mb-px text-sm font-medium border-b-2 transition-colors ${
      activa ? "border-[#0062e3] text-[#0062e3]" : "border-transparent text-gray-500 hover:text-gray-700"
    }`;

  return (
    <div className="space-y-4">
      <div className="flex gap-6 border-b border-gray-300">
        <button type="button" onClick={() => setPestana("tipos")} className={tabCls(pestana === "tipos")}>
          Tipos de lubricante{cantidadTipos !== null ? ` (${cantidadTipos})` : ""}
        </button>
        <button type="button" onClick={() => setPestana("cargas")} className={tabCls(pestana === "cargas")}>
          Cargas
        </button>
      </div>
      {pestana === "tipos" ? <TiposLubricantePanel onCantidad={setCantidadTipos} /> : <EditarLubricantePanel />}
    </div>
  );
}
