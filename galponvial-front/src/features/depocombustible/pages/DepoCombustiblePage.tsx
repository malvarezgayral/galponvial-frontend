import { useEffect, useState } from "react";
import { useAppStore } from "@/app/stores/appStore";
import { useAdminPermissions } from "../../usuarios/hooks/useAdminPermissions";
import { vehiculosService } from "../../vehiculos/services/vehiculosService";
import type { Vehiculo } from "../../vehiculos/types";
import {
  lubricanteService,
  type Lubricante,
  type CreateLubricantePayload,
} from "../services/lubricanteService";

interface FilaNueva {
  id: number;
  id_vehiculo: number;
  fecha: string;
  ordenRetiro: string;
  cantidad: number;
  tipo: string;
  observaciones: string;
}

const filaNuevaVacia = (id: number): FilaNueva => ({
  id,
  id_vehiculo: 0,
  fecha: "",
  ordenRetiro: "",
  cantidad: 0,
  tipo: "",
  observaciones: "",
});

type Vista = "lubricantes" | "listado-lubricantes" | "historial-lubricantes";

export default function DepoCombustiblePage() {
  const { user } = useAppStore();
  const { isSuperAdmin } = useAdminPermissions();
  const permisosUsuario = (user && "permisos" in user ? user.permisos : []) as unknown as string[];
  const puedeEscribir = permisosUsuario.includes("lubricentro:write");

  const [vista, setVista] = useState<Vista>("lubricantes");
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [lubricantes, setLubricantes] = useState<Lubricante[]>([]);
  const [cargando, setCargando] = useState(false);
  const [guardandoTodo, setGuardandoTodo] = useState(false);

  const [filas, setFilas] = useState<FilaNueva[]>([filaNuevaVacia(1)]);

  const [filaEditando, setFilaEditando] = useState<number | null>(null);
  const [borrador, setBorrador] = useState<Lubricante | null>(null);

  const [filtroDesde, setFiltroDesde] = useState("");
  const [filtroHasta, setFiltroHasta] = useState("");
  const [filtroOrden, setFiltroOrden] = useState("");
  const [filtroUnidad, setFiltroUnidad] = useState("");
  const [filtroCantidad, setFiltroCantidad] = useState("");
  const [filtroTipo, setFiltroTipo] = useState("");
  const [filtrosAplicados, setFiltrosAplicados] = useState({
    desde: "",
    hasta: "",
    orden: "",
    unidad: "",
    cantidad: "",
    tipo: "",
  });

  const cargarDatos = async () => {
    try {
      setCargando(true);
      const [vehiculosData, lubricantesData] = await Promise.all([
        vehiculosService.getAll(),
        lubricanteService.getAll(),
      ]);
      setVehiculos(vehiculosData);
      setLubricantes(lubricantesData);
    } catch (err) {
      console.error(err);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const nombreVehiculo = (l: Lubricante) =>
    l.vehiculo?.nombre || l.vehiculo?.codigo || `Vehículo #${l.vehiculo?.id_vehiculo}`;

  const agregarFila = () => {
    const nuevoId = filas.length > 0 ? Math.max(...filas.map((f) => f.id)) + 1 : 1;
    setFilas((prev) => [...prev, filaNuevaVacia(nuevoId)]);
  };

  const actualizarFila = (
    id: number,
    campo: keyof Omit<FilaNueva, "id">,
    valor: string | number
  ) => {
    setFilas((prev) =>
      prev.map((fila) => (fila.id === id ? { ...fila, [campo]: valor } : fila))
    );
  };

  const eliminarFilaNueva = (id: number) => {
    if (filas.length === 1) return;
    setFilas((prev) => prev.filter((fila) => fila.id !== id));
  };

  const filaCompleta = (f: FilaNueva) =>
    f.id_vehiculo > 0 && f.fecha !== "" && f.tipo.trim() !== "" && f.cantidad > 0;

  const handleGuardarTodo = async () => {
    if (!puedeEscribir) return;
    const filasAGuardar = filas.filter(filaCompleta);
    if (filasAGuardar.length === 0) {
      alert("Completá al menos una fila con Unidad, Fecha, Cantidad y Tipo antes de guardar.");
      return;
    }
    try {
      setGuardandoTodo(true);
      for (const f of filasAGuardar) {
        const payload: CreateLubricantePayload = {
          id_vehiculo: f.id_vehiculo,
          fecha: f.fecha,
          ordenRetiro: f.ordenRetiro || undefined,
          cantidad: f.cantidad,
          tipo: f.tipo,
          observaciones: f.observaciones || undefined,
        };
        await lubricanteService.create(payload);
      }
      const idsGuardados = new Set(filasAGuardar.map((f) => f.id));
      const restantes = filas.filter((f) => !idsGuardados.has(f.id));
      setFilas(restantes.length > 0 ? restantes : [filaNuevaVacia(1)]);
      await cargarDatos();
      alert(`Se registraron ${filasAGuardar.length} lubricante(s) correctamente.`);
    } catch (err) {
      alert("Ocurrió un error al guardar. Revisá las filas e intentá de nuevo.");
      console.error(err);
    } finally {
      setGuardandoTodo(false);
    }
  };

  const iniciarEdicion = (l: Lubricante) => {
    setFilaEditando(l.id);
    setBorrador({ ...l });
  };

  const cancelarEdicion = () => {
    setFilaEditando(null);
    setBorrador(null);
  };

  const updateBorrador = <K extends keyof Lubricante>(campo: K, valor: Lubricante[K]) => {
    setBorrador((prev: Lubricante | null) => (prev ? { ...prev, [campo]: valor } : prev));
  };

  const guardarEdicion = async () => {
    if (filaEditando === null || !borrador || !puedeEscribir) return;
    try {
      await lubricanteService.update(filaEditando, {
        fecha: borrador.fecha,
        ordenRetiro: borrador.ordenRetiro || undefined,
        cantidad: borrador.cantidad,
        tipo: borrador.tipo,
        observaciones: borrador.observaciones || undefined,
      });
      setFilaEditando(null);
      setBorrador(null);
      await cargarDatos();
    } catch (err) {
      alert("No se pudo guardar la edición.");
      console.error(err);
    }
  };

  const handleEliminar = async (id: number) => {
    if (!confirm("¿Eliminar este registro de lubricante?")) return;
    try {
      await lubricanteService.remove(id);
      await cargarDatos();
    } catch (err) {
      alert("No se pudo eliminar el registro.");
      console.error(err);
    }
  };

  const buscarHistorial = () => {
    setFiltrosAplicados({
      desde: filtroDesde,
      hasta: filtroHasta,
      orden: filtroOrden,
      unidad: filtroUnidad,
      cantidad: filtroCantidad,
      tipo: filtroTipo,
    });
  };

  const limpiarFiltros = () => {
    setFiltroDesde("");
    setFiltroHasta("");
    setFiltroOrden("");
    setFiltroUnidad("");
    setFiltroCantidad("");
    setFiltroTipo("");
    setFiltrosAplicados({ desde: "", hasta: "", orden: "", unidad: "", cantidad: "", tipo: "" });
  };

  const historialFiltrado = lubricantes.filter((l) => {
    if (filtrosAplicados.desde && l.fecha < filtrosAplicados.desde) return false;
    if (filtrosAplicados.hasta && l.fecha > filtrosAplicados.hasta) return false;
    if (
      filtrosAplicados.orden &&
      !(l.ordenRetiro || "").toLowerCase().includes(filtrosAplicados.orden.toLowerCase())
    )
      return false;
    if (
      filtrosAplicados.unidad &&
      !nombreVehiculo(l).toLowerCase().includes(filtrosAplicados.unidad.toLowerCase())
    )
      return false;
    if (filtrosAplicados.cantidad !== "" && l.cantidad !== Number(filtrosAplicados.cantidad))
      return false;
    if (filtrosAplicados.tipo && !l.tipo.toLowerCase().includes(filtrosAplicados.tipo.toLowerCase()))
      return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Lubricentro</h1>

        <div className="flex flex-wrap gap-3 mt-4">
          {puedeEscribir && (
            <button
              onClick={() => setVista("lubricantes")}
              className={`px-5 py-2 rounded-lg text-white font-medium transition-colors ${
                vista === "lubricantes" ? "bg-[#0062e3]" : "bg-gray-400 hover:bg-gray-500"
              }`}
            >
              Registro de Lubricantes
            </button>
          )}
          <button
            onClick={() => setVista("listado-lubricantes")}
            className={`px-5 py-2 rounded-lg text-white font-medium transition-colors ${
              vista === "listado-lubricantes" ? "bg-[#0062e3]" : "bg-gray-400 hover:bg-gray-500"
            }`}
          >
            Listado de Lubricantes
          </button>
          <button
            onClick={() => setVista("historial-lubricantes")}
            className={`px-5 py-2 rounded-lg text-white font-medium transition-colors ${
              vista === "historial-lubricantes" ? "bg-[#0062e3]" : "bg-gray-400 hover:bg-gray-500"
            }`}
          >
            Historial de Lubricantes
          </button>
        </div>

        {!puedeEscribir && (
          <p className="text-sm text-gray-500 italic mt-3">
            Tu perfil solo tiene permiso de visualización en Lubricentro.
          </p>
        )}
      </div>

      {vista === "lubricantes" && puedeEscribir && (
        <div className="bg-white rounded-xl shadow border border-gray-200 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-3 py-3 text-left font-semibold text-gray-600">Fecha</th>
                <th className="px-3 py-3 text-left font-semibold text-gray-600">N° Orden de Retiro</th>
                <th className="px-3 py-3 text-left font-semibold text-gray-600">Unidad</th>
                <th className="px-3 py-3 text-left font-semibold text-gray-600">Cantidad</th>
                <th className="px-3 py-3 text-left font-semibold text-gray-600">Tipo</th>
                <th className="px-3 py-3 text-left font-semibold text-gray-600">Observaciones</th>
                <th className="px-3 py-3 text-right font-semibold text-gray-600"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filas.map((fila) => (
                <tr key={fila.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-3 py-2">
                    <input
                      type="date"
                      value={fila.fecha}
                      onChange={(e) => actualizarFila(fila.id, "fecha", e.target.value)}
                      className="border border-gray-300 rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-36"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="text"
                      placeholder="N° Orden"
                      value={fila.ordenRetiro}
                      onChange={(e) => actualizarFila(fila.id, "ordenRetiro", e.target.value)}
                      className="border border-gray-300 rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-36"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <select
                      value={fila.id_vehiculo || ""}
                      onChange={(e) => actualizarFila(fila.id, "id_vehiculo", Number(e.target.value))}
                      className="border border-gray-300 rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-40"
                    >
                      <option value="">— Seleccionar —</option>
                      {vehiculos.map((v) => (
                        <option key={v.id_vehiculo} value={v.id_vehiculo}>
                          {v.nombre} {v.codigo ? `(${v.codigo})` : ""}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="number"
                      min={0}
                      value={fila.cantidad}
                      onChange={(e) => actualizarFila(fila.id, "cantidad", Math.max(0, Number(e.target.value)))}
                      className="border border-gray-300 rounded-md px-2 py-1.5 text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-500 w-24"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="text"
                      placeholder="Tipo de lubricante"
                      value={fila.tipo}
                      onChange={(e) => actualizarFila(fila.id, "tipo", e.target.value)}
                      className="border border-gray-300 rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-40"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <textarea
                      placeholder="Observaciones..."
                      value={fila.observaciones}
                      onChange={(e) => actualizarFila(fila.id, "observaciones", e.target.value)}
                      rows={1}
                      className="border border-gray-300 rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-48 resize-y min-h-[36px]"
                    />
                  </td>
                  <td className="px-3 py-2 text-right">
                    {filas.length > 1 && (
                      <button
                        onClick={() => eliminarFilaNueva(fila.id)}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        ✕
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="p-4 flex gap-3">
            <button
              onClick={agregarFila}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow transition-colors"
            >
              <span className="text-lg leading-none">+</span> Agregar Registro
            </button>
            <button
              onClick={handleGuardarTodo}
              disabled={guardandoTodo}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg shadow transition-colors disabled:opacity-50"
            >
              {guardandoTodo ? "Guardando..." : "Guardar todo"}
            </button>
          </div>
        </div>
      )}

      {vista === "listado-lubricantes" && (
        <div className="bg-white rounded-xl shadow border border-gray-200 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-3 py-3 text-left font-semibold text-gray-600">Fecha</th>
                <th className="px-3 py-3 text-left font-semibold text-gray-600">N° Orden de Retiro</th>
                <th className="px-3 py-3 text-left font-semibold text-gray-600">Unidad</th>
                <th className="px-3 py-3 text-left font-semibold text-gray-600">Cantidad</th>
                <th className="px-3 py-3 text-left font-semibold text-gray-600">Tipo</th>
                <th className="px-3 py-3 text-left font-semibold text-gray-600">Observaciones</th>
                <th className="px-3 py-3 text-right font-semibold text-gray-600">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {cargando && (
                <tr>
                  <td colSpan={7} className="px-3 py-6 text-center text-gray-400">Cargando...</td>
                </tr>
              )}
              {!cargando && lubricantes.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-3 py-6 text-center text-gray-400">
                    Todavía no hay lubricantes cargados.
                  </td>
                </tr>
              )}
              {!cargando && lubricantes.map((l) => {
                const editando = filaEditando === l.id && borrador !== null;
                const mostrado = editando ? borrador! : l;

                return (
                  <tr
                    key={l.id}
                    className={`hover:bg-gray-50 transition-colors ${editando ? "bg-blue-50" : ""}`}
                  >
                    <td className="px-3 py-2">
                      {editando ? (
                        <input
                          type="date"
                          value={mostrado.fecha}
                          onChange={(e) => updateBorrador("fecha", e.target.value)}
                          className="border border-blue-300 rounded-md px-2 py-1.5 text-sm w-36"
                        />
                      ) : (
                        mostrado.fecha || "-"
                      )}
                    </td>
                    <td className="px-3 py-2">
                      {editando ? (
                        <input
                          type="text"
                          value={mostrado.ordenRetiro || ""}
                          onChange={(e) => updateBorrador("ordenRetiro", e.target.value)}
                          className="border border-blue-300 rounded-md px-2 py-1.5 text-sm w-36"
                        />
                      ) : (
                        mostrado.ordenRetiro || "-"
                      )}
                    </td>
                    <td className="px-3 py-2">{nombreVehiculo(mostrado)}</td>
                    <td className="px-3 py-2">
                      {editando ? (
                        <input
                          type="number"
                          min={0}
                          value={mostrado.cantidad}
                          onChange={(e) =>
                            updateBorrador("cantidad", Math.max(0, Number(e.target.value)))
                          }
                          className="border border-blue-300 rounded-md px-2 py-1.5 text-sm text-center w-24"
                        />
                      ) : (
                        mostrado.cantidad
                      )}
                    </td>
                    <td className="px-3 py-2">
                      {editando ? (
                        <input
                          type="text"
                          value={mostrado.tipo}
                          onChange={(e) => updateBorrador("tipo", e.target.value)}
                          className="border border-blue-300 rounded-md px-2 py-1.5 text-sm w-40"
                        />
                      ) : (
                        mostrado.tipo || "-"
                      )}
                    </td>
                    <td className="px-3 py-2">
                      {editando ? (
                        <textarea
                          value={mostrado.observaciones || ""}
                          onChange={(e) => updateBorrador("observaciones", e.target.value)}
                          rows={1}
                          className="border border-blue-300 rounded-md px-2 py-1.5 text-sm w-48 resize-y min-h-[36px]"
                        />
                      ) : (
                        mostrado.observaciones || "-"
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
                            {puedeEscribir && (
                              <button
                                onClick={() => iniciarEdicion(l)}
                                className="text-blue-600 hover:text-blue-800 text-sm font-medium border border-blue-200 rounded px-3 py-1 hover:bg-blue-50 transition-colors"
                              >
                                Editar
                              </button>
                            )}
                            {isSuperAdmin() && (
                              <button
                                onClick={() => handleEliminar(l.id)}
                                className="text-red-600 hover:text-red-800 text-sm font-medium border border-red-200 rounded px-3 py-1 hover:bg-red-50 transition-colors"
                              >
                                Eliminar
                              </button>
                            )}
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

      {vista === "historial-lubricantes" && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl shadow border border-gray-200 p-4">
            <div className="flex flex-wrap gap-4 items-end">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-500">Periodo desde</label>
                <input
                  type="date"
                  value={filtroDesde}
                  max={filtroHasta || undefined}
                  onChange={(e) => setFiltroDesde(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-40"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-500">Periodo hasta</label>
                <input
                  type="date"
                  value={filtroHasta}
                  min={filtroDesde || undefined}
                  onChange={(e) => setFiltroHasta(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-40"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-500">N° Orden de Retiro</label>
                <input
                  type="text"
                  placeholder="Buscar por N° orden"
                  value={filtroOrden}
                  onChange={(e) => setFiltroOrden(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-44"
                />
              </div>
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
                <label className="text-xs font-medium text-gray-500">Cantidad</label>
                <input
                  type="number"
                  placeholder="Ej: 5"
                  value={filtroCantidad}
                  onChange={(e) => setFiltroCantidad(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-28"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-500">Tipo</label>
                <input
                  type="text"
                  placeholder="Tipo de lubricante"
                  value={filtroTipo}
                  onChange={(e) => setFiltroTipo(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-44"
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
                  <th className="px-3 py-3 text-left font-semibold text-gray-600">Fecha</th>
                  <th className="px-3 py-3 text-left font-semibold text-gray-600">N° Orden de Retiro</th>
                  <th className="px-3 py-3 text-left font-semibold text-gray-600">Unidad</th>
                  <th className="px-3 py-3 text-left font-semibold text-gray-600">Cantidad</th>
                  <th className="px-3 py-3 text-left font-semibold text-gray-600">Tipo</th>
                  <th className="px-3 py-3 text-left font-semibold text-gray-600">Observaciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {historialFiltrado.map((l) => (
                  <tr key={l.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-3 py-2">{l.fecha || "-"}</td>
                    <td className="px-3 py-2">{l.ordenRetiro || "-"}</td>
                    <td className="px-3 py-2">{nombreVehiculo(l)}</td>
                    <td className="px-3 py-2">{l.cantidad}</td>
                    <td className="px-3 py-2">{l.tipo || "-"}</td>
                    <td className="px-3 py-2">{l.observaciones || "-"}</td>
                  </tr>
                ))}
                {historialFiltrado.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-3 py-6 text-center text-gray-400">
                      No se encontraron lubricantes con los filtros aplicados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
