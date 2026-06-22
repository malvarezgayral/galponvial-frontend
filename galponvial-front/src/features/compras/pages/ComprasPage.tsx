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
        <div className="flex flex-row gap-6 items-start">
          <div className="bg-white rounded-lg shadow p-6 w-full max-w-xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Suministro</h2>
            <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); alert('Suministro enviado'); }}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha *</label>
                <input type="date" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">N° de Suministro *</label>
                <input type="text" placeholder="Ingrese el número de suministro" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Lugar de Emisión</label>
                <input type="text" value="Lobería" readOnly className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Jurisdicción *</label>
                <input type="text" placeholder="Ingrese la jurisdicción" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Unidad Ejecutora *</label>
                <input type="text" placeholder="Ingrese la unidad ejecutora" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Dependencia Solicitante *</label>
                <input type="text" placeholder="Ingrese la dependencia solicitante" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Unidad *</label>
                <input type="text" placeholder="Ingrese la unidad" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Observaciones</label>
                <textarea placeholder="Ingrese observaciones adicionales..." rows={4} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
              </div>
              <div className="flex gap-4 pt-2">
                <button type="submit" className="flex-1 px-6 py-3 bg-[#378AFE] text-white font-medium rounded-lg hover:bg-[#0962DE] transition-colors">Registrar Suministro</button>
                <button type="button" className="flex-1 px-6 py-3 bg-gray-300 text-gray-800 font-medium rounded-lg hover:bg-gray-400 transition-colors">Limpiar</button>
              </div>
              <p className="text-sm text-gray-500">* Campos obligatorios</p>
            </form>
          </div>
          <div className="bg-white rounded-lg shadow p-6 flex-1">
            
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-3 py-2 text-center text-sm font-semibold text-gray-700">Cantidad</th>
                  <th className="border border-gray-300 px-3 py-2 text-center text-sm font-semibold text-gray-700">Descripción</th>
                  <th className="border border-gray-300 px-3 py-2 text-center text-sm font-semibold text-gray-700">C. Unitario</th>
                  <th className="border border-gray-300 px-3 py-2 text-center text-sm font-semibold text-gray-700">C. Estimado</th>
                </tr>
              </thead>
              <tbody>
                {[1,2,3,4,5].map((i) => (
                  <tr key={i}>
                    <td className="border border-gray-300 px-2 py-1"><input type="text" className="w-full focus:outline-none text-sm" /></td>
                    <td className="border border-gray-300 px-2 py-1"><input type="text" className="w-full focus:outline-none text-sm" /></td>
                    <td className="border border-gray-300 px-2 py-1"><input type="text" className="w-full focus:outline-none text-sm" /></td>
                    <td className="border border-gray-300 px-2 py-1"><input type="text" className="w-full focus:outline-none text-sm" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
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
