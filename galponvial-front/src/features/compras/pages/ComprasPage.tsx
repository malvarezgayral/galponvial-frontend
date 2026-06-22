import { useState } from "react";
import { PresupuestoForm } from "../../proveedores/components/PresupuestoForm";

const MESES = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];

const ComprasPage = () => {
  const [vistaActiva, setVistaActiva] = useState<"presupuestos" | "suministro" | "historial" | "historial-presupuestos">("presupuestos");

  return (
    <div className="p-6">
      <div className="flex flex-row gap-3 mb-6">
        <button onClick={() => setVistaActiva("presupuestos")} style={{ backgroundColor: "#0062e3" }} className="px-4 py-2 rounded font-medium text-white transition-colors hover:opacity-90">Presupuestos</button>
        <button onClick={() => setVistaActiva("suministro")} style={{ backgroundColor: "#0062e3" }} className="px-4 py-2 rounded font-medium text-white transition-colors hover:opacity-90">Suministro</button>
        <button onClick={() => setVistaActiva("historial-presupuestos")} style={{ backgroundColor: "#0062e3" }} className="px-4 py-2 rounded font-medium text-white transition-colors hover:opacity-90">Historial de Presupuestos</button>
        <button onClick={() => setVistaActiva("historial")} style={{ backgroundColor: "#0062e3" }} className="px-4 py-2 rounded font-medium text-white transition-colors hover:opacity-90">Historial de Suministros</button>
      </div>
      {vistaActiva === "presupuestos" && (
        <div className="flex flex-col gap-6">
          <div className="flex flex-row gap-6 items-start">
            <PresupuestoForm numero={1} />
            <PresupuestoForm numero={2} />
          </div>
          <div className="flex flex-row gap-6 items-start">
            <PresupuestoForm numero={3} />
          </div>
        </div>
      )}
      {vistaActiva === "suministro" && (
        <div className="text-gray-500 italic">Suministro — próximamente.</div>
      )}
      {vistaActiva === "historial-presupuestos" && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Historial de Presupuestos</h2>
          <div className="space-y-4">
            {[2026, 2025, 2024].map((anio) => (
              <div key={anio}>
                <h3 className="text-lg font-bold text-gray-700 mb-2">{anio}</h3>
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
                  {MESES.map((mes) => (
                    <button key={mes} className="border border-gray-300 rounded px-3 py-2 text-sm text-gray-600 hover:bg-blue-50 hover:border-blue-400 transition-colors">{mes}</button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {vistaActiva === "historial" && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Historial de Suministros</h2>
          <h3 className="text-lg font-bold text-gray-700 mb-2">2026</h3>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
            {MESES.map((mes) => (
              <button key={mes} className="border border-gray-300 rounded px-3 py-2 text-sm text-gray-600 hover:bg-blue-50 hover:border-blue-400 transition-colors">{mes}</button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ComprasPage;
