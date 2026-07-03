import { useState } from "react";

interface FilaService {
  id: number;
  vehiculo: string;
  fecha: string;
  aceiteMotor: string;
  aceiteCaja: string;
  aceiteDiferencial: string;
  aceiteTransmision: string;
  filtroTransmision: string;
  filtroMotorAceite: string;
  filtroAire: string;
  filtroGasoil: string;
  aceiteHidraulico: string;
  filtroHidraulico: string;
  correasAuxiliares: string;
  aceiteTande: string;
  regulacionValvulas: string;
  cambioDamper: string;
  proximoService: string;
  cuentaHora: string;
  stock: string;
  observaciones: string;
}

const filaVacia = (): Omit<FilaService, "id"> => ({
  vehiculo: "",
  fecha: "",
  aceiteMotor: "",
  aceiteCaja: "",
  aceiteDiferencial: "",
  aceiteTransmision: "",
  filtroTransmision: "",
  filtroMotorAceite: "",
  filtroAire: "",
  filtroGasoil: "",
  aceiteHidraulico: "",
  filtroHidraulico: "",
  correasAuxiliares: "",
  aceiteTande: "",
  regulacionValvulas: "",
  cambioDamper: "",
  proximoService: "",
  cuentaHora: "",
  stock: "",
  observaciones: "",
});

const SI_NO = ["SI", "NO"];
const STOCK_OPCIONES = ["Stock", "Sin stock"];

type Vista = "registro" | "historial";

export default function ServicePage() {
  const [filas, setFilas] = useState<FilaService[]>([
    { id: 1, ...filaVacia() },
  ]);
  const [vista, setVista] = useState<Vista>("registro");

  const agregarFila = () => {
    const nuevoId =
      filas.length > 0 ? Math.max(...filas.map((f) => f.id)) + 1 : 1;
    setFilas((prev) => [...prev, { id: nuevoId, ...filaVacia() }]);
  };

  const actualizarFila = (
    id: number,
    campo: keyof Omit<FilaService, "id">,
    valor: string
  ) => {
    setFilas((prev) =>
      prev.map((fila) => (fila.id === id ? { ...fila, [campo]: valor } : fila))
    );
  };

  const eliminarFila = (id: number) => {
    if (filas.length === 1) return;
    setFilas((prev) => prev.filter((fila) => fila.id !== id));
  };

  const selectSiNo = (
    id: number,
    campo: keyof Omit<FilaService, "id">,
    valor: string
  ) => (
    <select
      value={valor}
      onChange={(e) => actualizarFila(id, campo, e.target.value)}
      className={`border border-gray-300 rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-20 ${
        valor === "SI"
          ? "text-green-600 font-semibold"
          : valor === "NO"
          ? "text-red-500 font-semibold"
          : "text-gray-400"
      }`}
    >
      <option value="">—</option>
      {SI_NO.map((op) => (
        <option key={op} value={op}>
          {op}
        </option>
      ))}
    </select>
  );

  const selectStock = (
    id: number,
    campo: keyof Omit<FilaService, "id">,
    valor: string
  ) => (
    <select
      value={valor}
      onChange={(e) => actualizarFila(id, campo, e.target.value)}
      className={`border border-gray-300 rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-28 ${
        valor === "Stock"
          ? "text-green-600 font-semibold"
          : valor === "Sin stock"
          ? "text-red-500 font-semibold"
          : "text-gray-400"
      }`}
    >
      <option value="">—</option>
      {STOCK_OPCIONES.map((op) => (
        <option key={op} value={op}>
          {op}
        </option>
      ))}
    </select>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Service</h1>

        <div className="flex flex-wrap gap-3 mt-4">
          <button
            onClick={() => setVista("registro")}
            className={`px-5 py-2 rounded-lg text-white font-medium transition-colors ${
              vista === "registro" ? "bg-[#0062e3]" : "bg-gray-400 hover:bg-gray-500"
            }`}
          >
            Registro de Service
          </button>

          <button
            onClick={() => setVista("historial")}
            className={`px-5 py-2 rounded-lg text-white font-medium transition-colors ${
              vista === "historial" ? "bg-[#0062e3]" : "bg-gray-400 hover:bg-gray-500"
            }`}
          >
            Historial de Service
          </button>
        </div>
      </div>

      {/* Vista: Registro */}
      {vista === "registro" && (
        <>
          <div className="bg-white rounded-xl shadow border border-gray-200 overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-3 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">Vehículo</th>
                  <th className="px-3 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">Fecha</th>
                  <th className="px-3 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">Aceite Motor</th>
                  <th className="px-3 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">Aceite Caja</th>
                  <th className="px-3 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">Aceite Diferencial</th>
                  <th className="px-3 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">Aceite Transmisión</th>
                  <th className="px-3 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">Filtro Motor Aceite</th>
                  <th className="px-3 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">Filtro de Aire</th>
                  <th className="px-3 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">Filtro Gasoil</th>
                  <th className="px-3 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">Filtro Transmisión</th>
                  <th className="px-3 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">Aceite Hidráulico</th>
                  <th className="px-3 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">Filtro Hidráulico</th>
                  <th className="px-3 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">Correas Auxiliares</th>
                  <th className="px-3 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">Aceite Tande</th>
                  <th className="px-3 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">Regulación de Válvulas</th>
                  <th className="px-3 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">Cambio de Damper</th>
                  <th className="px-3 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">Próximo Service</th>
                  <th className="px-3 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">Cuenta Hora</th>
                  <th className="px-3 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">Stock</th>
                  <th className="px-3 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">Observaciones</th>
                  <th className="px-3 py-3 text-center font-semibold text-gray-600 whitespace-nowrap">Eliminar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filas.map((fila) => (
                  <tr key={fila.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-3 py-2">
                      <input
                        type="text"
                        placeholder="Ingrese vehículo"
                        value={fila.vehiculo}
                        onChange={(e) => actualizarFila(fila.id, "vehiculo", e.target.value)}
                        className="border border-gray-300 rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-36"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <input
                        type="date"
                        value={fila.fecha}
                        onChange={(e) => actualizarFila(fila.id, "fecha", e.target.value)}
                        className="border border-gray-300 rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-36"
                      />
                    </td>
                    <td className="px-3 py-2">{selectSiNo(fila.id, "aceiteMotor", fila.aceiteMotor)}</td>
                    <td className="px-3 py-2">{selectSiNo(fila.id, "aceiteCaja", fila.aceiteCaja)}</td>
                    <td className="px-3 py-2">{selectSiNo(fila.id, "aceiteDiferencial", fila.aceiteDiferencial)}</td>
                    <td className="px-3 py-2">{selectSiNo(fila.id, "aceiteTransmision", fila.aceiteTransmision)}</td>
                    <td className="px-3 py-2">{selectSiNo(fila.id, "filtroMotorAceite", fila.filtroMotorAceite)}</td>
                    <td className="px-3 py-2">{selectSiNo(fila.id, "filtroAire", fila.filtroAire)}</td>
                    <td className="px-3 py-2">{selectSiNo(fila.id, "filtroGasoil", fila.filtroGasoil)}</td>
                    <td className="px-3 py-2">{selectSiNo(fila.id, "filtroTransmision", fila.filtroTransmision)}</td>
                    <td className="px-3 py-2">{selectSiNo(fila.id, "aceiteHidraulico", fila.aceiteHidraulico)}</td>
                    <td className="px-3 py-2">{selectSiNo(fila.id, "filtroHidraulico", fila.filtroHidraulico)}</td>
                    <td className="px-3 py-2">{selectSiNo(fila.id, "correasAuxiliares", fila.correasAuxiliares)}</td>
                    <td className="px-3 py-2">{selectSiNo(fila.id, "aceiteTande", fila.aceiteTande)}</td>
                    <td className="px-3 py-2">{selectSiNo(fila.id, "regulacionValvulas", fila.regulacionValvulas)}</td>
                    <td className="px-3 py-2">{selectSiNo(fila.id, "cambioDamper", fila.cambioDamper)}</td>
                    <td className="px-3 py-2">
                      <input
                        type="date"
                        value={fila.proximoService}
                        onChange={(e) => actualizarFila(fila.id, "proximoService", e.target.value)}
                        className="border border-gray-300 rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-36"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <input
                        type="text"
                        placeholder="Cuenta hora"
                        value={fila.cuentaHora}
                        onChange={(e) => actualizarFila(fila.id, "cuentaHora", e.target.value)}
                        className="border border-gray-300 rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-28"
                      />
                    </td>
                    <td className="px-3 py-2">{selectStock(fila.id, "stock", fila.stock)}</td>
                    <td className="px-3 py-2">
                      <textarea
                        placeholder="Observaciones"
                        value={fila.observaciones}
                        onChange={(e) => actualizarFila(fila.id, "observaciones", e.target.value)}
                        rows={1}
                        className="border border-gray-300 rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-44 resize-y"
                      />
                    </td>
                    <td className="px-3 py-2 text-center">
                      <button
                        onClick={() => eliminarFila(fila.id)}
                        disabled={filas.length === 1}
                        title="Eliminar fila"
                        className="w-7 h-7 rounded-md bg-red-100 hover:bg-red-200 text-red-600 flex items-center justify-center mx-auto transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button
            onClick={agregarFila}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow transition-colors"
          >
            <span className="text-lg leading-none">+</span> Agregar Registro
          </button>
        </>
      )}

      {/* Vista: Historial */}
      {vista === "historial" && (
        <div className="bg-white rounded-xl shadow border border-gray-200 p-6 text-gray-400 text-sm">
          Historial — en construcción.
        </div>
      )}
    </div>
  );
}
