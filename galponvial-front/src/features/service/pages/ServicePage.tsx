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
const LISTA_FILTROS: string[] = [];
const STOCK_OPCIONES = ["Stock", "Sin stock"];

type Vista = "registro" | "listado" | "historial" | "filtros";

export default function ServicePage() {
  const [filas, setFilas] = useState<FilaService[]>([
    { id: 1, ...filaVacia() },
  ]);
  const [vista, setVista] = useState<Vista>("registro");
  const [filaEditando, setFilaEditando] = useState<number | null>(null);
  const [borrador, setBorrador] = useState<FilaService | null>(null);
  const [filtroUnidad, setFiltroUnidad] = useState("");
  const [filtroMarca, setFiltroMarca] = useState("");
  const [filtroModelo, setFiltroModelo] = useState("");
  const [filtroPeriodoDesde, setFiltroPeriodoDesde] = useState("");
  const [filtroPeriodoHasta, setFiltroPeriodoHasta] = useState("");
  const [unidadFiltros, setUnidadFiltros] = useState("");
  const [listaFiltros, setListaFiltros] = useState("");

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

  const iniciarEdicion = (id: number) => {
    setFilaEditando(id);
    const fila = filas.find((f) => f.id === id);
    if (fila) {
      setBorrador({ ...fila });
    }
  };

  const cancelarEdicion = () => {
    setFilaEditando(null);
    setBorrador(null);
  };

  const guardarEdicion = () => {
    if (filaEditando !== null && borrador) {
      setFilas((prev) =>
        prev.map((f) => (f.id === filaEditando ? borrador : f))
      );
      setFilaEditando(null);
      setBorrador(null);
    }
  };

  const updateBorrador = <K extends keyof FilaService>(
    campo: K,
    valor: FilaService[K]
  ) => {
    setBorrador((prev) => (prev ? { ...prev, [campo]: valor } : prev));
  };

  const buscarHistorial = () => {
    console.log("Buscando con filtros:", {
      filtroUnidad,
      filtroMarca,
      filtroModelo,
      filtroPeriodoDesde,
      filtroPeriodoHasta,
    });
  };

  const limpiarFiltros = () => {
    setFiltroUnidad("");
    setFiltroMarca("");
    setFiltroModelo("");
    setFiltroPeriodoDesde("");
    setFiltroPeriodoHasta("");
  };

  const selectSiNo = (
    id: number,
    campo: keyof Omit<FilaService, "id">,
    valor: string,
    editando: boolean = false
  ) => (
    <select
      value={valor}
      onChange={(e) => 
        editando 
          ? updateBorrador(campo as keyof FilaService, e.target.value as any)
          : actualizarFila(id, campo, e.target.value)
      }
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
    valor: string,
    editando: boolean = false
  ) => (
    <select
      value={valor}
      onChange={(e) =>
        editando
          ? updateBorrador(campo as keyof FilaService, e.target.value as any)
          : actualizarFila(id, campo, e.target.value)
      }
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

  const inputClass = "border border-blue-300 rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-36";

  return (
    <div className="space-y-6">
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
            onClick={() => setVista("listado")}
            className={`px-5 py-2 rounded-lg text-white font-medium transition-colors ${
              vista === "listado" ? "bg-[#0062e3]" : "bg-gray-400 hover:bg-gray-500"
            }`}
          >
            Listado de Service
          </button>

          <button
            onClick={() => setVista("historial")}
            className={`px-5 py-2 rounded-lg text-white font-medium transition-colors ${
              vista === "historial" ? "bg-[#0062e3]" : "bg-gray-400 hover:bg-gray-500"
            }`}
          >
            Historial de Service
          </button>

          <button
            onClick={() => setVista("filtros")}
            className={`px-5 py-2 rounded-lg text-white font-medium transition-colors ${
              vista === "filtros" ? "bg-[#0062e3]" : "bg-gray-400 hover:bg-gray-500"
            }`}
          >
            Filtros
          </button>
        </div>
      </div>

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

      {vista === "listado" && (
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
                <th className="px-3 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">Regulación Válvulas</th>
                <th className="px-3 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">Cambio Damper</th>
                <th className="px-3 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">Próximo Service</th>
                <th className="px-3 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">Cuenta Hora</th>
                <th className="px-3 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">Stock</th>
                <th className="px-3 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">Observaciones</th>
                <th className="px-3 py-3 text-right font-semibold text-gray-600 whitespace-nowrap">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filas.map((fila) => {
                const editando = filaEditando === fila.id && borrador !== null;
                const mostrado = editando ? borrador : fila;

                return (
                  <tr
                    key={fila.id}
                    className={`border-b border-gray-100 last:border-0 ${editando ? "bg-blue-50" : ""}`}
                  >
                    <td className="px-3 py-2">
                      {editando ? (
                        <input
                          type="text"
                          value={mostrado.vehiculo}
                          onChange={(e) => updateBorrador("vehiculo", e.target.value)}
                          className={inputClass}
                        />
                      ) : (
                        mostrado.vehiculo
                      )}
                    </td>
                    <td className="px-3 py-2">
                      {editando ? (
                        <input
                          type="date"
                          value={mostrado.fecha}
                          onChange={(e) => updateBorrador("fecha", e.target.value)}
                          className={inputClass}
                        />
                      ) : (
                        mostrado.fecha
                      )}
                    </td>
                    <td className="px-3 py-2">
                      {editando ? selectSiNo(fila.id, "aceiteMotor", mostrado.aceiteMotor, true) : mostrado.aceiteMotor}
                    </td>
                    <td className="px-3 py-2">
                      {editando ? selectSiNo(fila.id, "aceiteCaja", mostrado.aceiteCaja, true) : mostrado.aceiteCaja}
                    </td>
                    <td className="px-3 py-2">
                      {editando ? selectSiNo(fila.id, "aceiteDiferencial", mostrado.aceiteDiferencial, true) : mostrado.aceiteDiferencial}
                    </td>
                    <td className="px-3 py-2">
                      {editando ? selectSiNo(fila.id, "aceiteTransmision", mostrado.aceiteTransmision, true) : mostrado.aceiteTransmision}
                    </td>
                    <td className="px-3 py-2">
                      {editando ? selectSiNo(fila.id, "filtroMotorAceite", mostrado.filtroMotorAceite, true) : mostrado.filtroMotorAceite}
                    </td>
                    <td className="px-3 py-2">
                      {editando ? selectSiNo(fila.id, "filtroAire", mostrado.filtroAire, true) : mostrado.filtroAire}
                    </td>
                    <td className="px-3 py-2">
                      {editando ? selectSiNo(fila.id, "filtroGasoil", mostrado.filtroGasoil, true) : mostrado.filtroGasoil}
                    </td>
                    <td className="px-3 py-2">
                      {editando ? selectSiNo(fila.id, "filtroTransmision", mostrado.filtroTransmision, true) : mostrado.filtroTransmision}
                    </td>
                    <td className="px-3 py-2">
                      {editando ? selectSiNo(fila.id, "aceiteHidraulico", mostrado.aceiteHidraulico, true) : mostrado.aceiteHidraulico}
                    </td>
                    <td className="px-3 py-2">
                      {editando ? selectSiNo(fila.id, "filtroHidraulico", mostrado.filtroHidraulico, true) : mostrado.filtroHidraulico}
                    </td>
                    <td className="px-3 py-2">
                      {editando ? selectSiNo(fila.id, "correasAuxiliares", mostrado.correasAuxiliares, true) : mostrado.correasAuxiliares}
                    </td>
                    <td className="px-3 py-2">
                      {editando ? selectSiNo(fila.id, "aceiteTande", mostrado.aceiteTande, true) : mostrado.aceiteTande}
                    </td>
                    <td className="px-3 py-2">
                      {editando ? selectSiNo(fila.id, "regulacionValvulas", mostrado.regulacionValvulas, true) : mostrado.regulacionValvulas}
                    </td>
                    <td className="px-3 py-2">
                      {editando ? selectSiNo(fila.id, "cambioDamper", mostrado.cambioDamper, true) : mostrado.cambioDamper}
                    </td>
                    <td className="px-3 py-2">
                      {editando ? (
                        <input
                          type="date"
                          value={mostrado.proximoService}
                          onChange={(e) => updateBorrador("proximoService", e.target.value)}
                          className={inputClass}
                        />
                      ) : (
                        mostrado.proximoService
                      )}
                    </td>
                    <td className="px-3 py-2">
                      {editando ? (
                        <input
                          type="text"
                          value={mostrado.cuentaHora}
                          onChange={(e) => updateBorrador("cuentaHora", e.target.value)}
                          className={inputClass}
                        />
                      ) : (
                        mostrado.cuentaHora
                      )}
                    </td>
                    <td className="px-3 py-2">
                      {editando ? selectStock(fila.id, "stock", mostrado.stock, true) : mostrado.stock}
                    </td>
                    <td className="px-3 py-2">
                      {editando ? (
                        <textarea
                          value={mostrado.observaciones}
                          onChange={(e) => updateBorrador("observaciones", e.target.value)}
                          rows={1}
                          className={`${inputClass} w-44`}
                        />
                      ) : (
                        mostrado.observaciones
                      )}
                    </td>
                    <td className="px-3 py-2 text-right">
                      <div className="flex justify-end gap-2">
                        {editando ? (
                          <>
                            <button
                              onClick={guardarEdicion}
                              className="text-white bg-blue-600 hover:bg-blue-700 text-sm font-medium rounded px-3 py-1 transition-colors"
                            >
                              Guardar
                            </button>
                            <button
                              onClick={cancelarEdicion}
                              className="text-gray-600 hover:text-gray-800 text-sm font-medium border border-gray-300 rounded px-3 py-1 hover:bg-gray-50 transition-colors"
                            >
                              Cancelar
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => iniciarEdicion(fila.id)}
                              className="text-blue-600 hover:text-blue-800 text-sm font-medium border border-blue-200 rounded px-3 py-1 hover:bg-blue-50 transition-colors"
                            >
                              Editar
                            </button>
                            <button
                              onClick={() => eliminarFila(fila.id)}
                              className="text-red-600 hover:text-red-800 text-sm font-medium border border-red-200 rounded px-3 py-1 hover:bg-red-50 transition-colors"
                            >
                              Eliminar
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {vista === "historial" && (
        <>
          <div className="bg-white rounded-xl shadow border border-gray-200 p-4 mb-4">
            <div className="flex flex-wrap gap-4 items-end">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-500">Unidad</label>
                <input
                  type="text"
                  placeholder="Buscar por unidad"
                  value={filtroUnidad}
                  onChange={(e) => setFiltroUnidad(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-48"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-500">Marca</label>
                <select
                  value={filtroMarca}
                  onChange={(e) => setFiltroMarca(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-40"
                >
                  <option value="">Todas</option>
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-500">Modelo</label>
                <select
                  value={filtroModelo}
                  onChange={(e) => setFiltroModelo(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-40"
                >
                  <option value="">Todos</option>
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-500">Período desde</label>
                <input
                  type="date"
                  value={filtroPeriodoDesde}
                  max={filtroPeriodoHasta || undefined}
                  onChange={(e) => setFiltroPeriodoDesde(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-40"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-500">Período hasta</label>
                <input
                  type="date"
                  value={filtroPeriodoHasta}
                  min={filtroPeriodoDesde || undefined}
                  onChange={(e) => setFiltroPeriodoHasta(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-40"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={buscarHistorial}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow transition-colors"
                >
                  Buscar
                </button>
                <button
                  onClick={limpiarFiltros}
                  className="px-5 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm font-medium rounded-lg shadow transition-colors"
                >
                  Limpiar filtros
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow border border-gray-200 overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-3 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">Vehículo</th>
                  <th className="px-3 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">Fecha</th>
                  <th className="px-3 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">Aceite Motor</th>
                  <th className="px-3 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">Aceite Caja</th>
                  <th className="px-3 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">Próximo Service</th>
                  <th className="px-3 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">Stock</th>
                  <th className="px-3 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">Observaciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filas
                  .filter((f) => {
                    if (filtroUnidad && !f.vehiculo.toLowerCase().includes(filtroUnidad.toLowerCase())) {
                      return false;
                    }
                    if (filtroPeriodoDesde && f.fecha && f.fecha < filtroPeriodoDesde) {
                      return false;
                    }
                    if (filtroPeriodoHasta && f.fecha && f.fecha > filtroPeriodoHasta) {
                      return false;
                    }
                    return true;
                  })
                  .map((fila) => (
                    <tr key={fila.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-3 py-2">{fila.vehiculo || "—"}</td>
                      <td className="px-3 py-2">{fila.fecha || "—"}</td>
                      <td className="px-3 py-2">{fila.aceiteMotor || "—"}</td>
                      <td className="px-3 py-2">{fila.aceiteCaja || "—"}</td>
                      <td className="px-3 py-2">{fila.proximoService || "—"}</td>
                      <td className="px-3 py-2">{fila.stock || "—"}</td>
                      <td className="px-3 py-2">{fila.observaciones || "—"}</td>
                    </tr>
                  ))}
                {filas.filter((f) => {
                  if (filtroUnidad && !f.vehiculo.toLowerCase().includes(filtroUnidad.toLowerCase())) return false;
                  if (filtroPeriodoDesde && f.fecha && f.fecha < filtroPeriodoDesde) return false;
                  if (filtroPeriodoHasta && f.fecha && f.fecha > filtroPeriodoHasta) return false;
                  return true;
                }).length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-3 py-6 text-center text-gray-400">
                      No se encontraron registros de Service con los filtros aplicados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {vista === "filtros" && (
        <div className="bg-white rounded-xl shadow border border-gray-200 p-6">
          <div className="flex flex-wrap gap-4 items-end">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-500">Unidad</label>
              <input
                type="text"
                placeholder="Ingrese unidad"
                value={unidadFiltros}
                onChange={(e) => setUnidadFiltros(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-48"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-500">Lista de filtros</label>
              <select
                value={listaFiltros}
                onChange={(e) => setListaFiltros(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-48 text-gray-500"
              >
                <option value="">— Seleccionar —</option>
                {LISTA_FILTROS.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}