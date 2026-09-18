import { useEffect, useState } from "react";
import { useAdminPermissions } from "../../usuarios/hooks/useAdminPermissions";
import { vehiculosService } from "../../vehiculos/services/vehiculosService";
import type { Vehiculo } from "../../vehiculos/types";
import {
  reparacionService,
  type Reparacion,
  type CreateReparacionPayload,
  type TallerTipo,
} from "../services/reparacionService";

const TALLERES: TallerTipo[] = [
  "Taller 1 (General)",
  "Taller 2 (Vial)",
  "Taller 3 (Pintura)",
];

interface FilaNueva {
  id: number;
  id_vehiculo: number;
  descripcion: string;
  taller: TallerTipo;
  fecha_entrada: string;
  fecha_salida: string;
  observaciones: string;
}

const filaNuevaVacia = (id: number): FilaNueva => ({
  id,
  id_vehiculo: 0,
  descripcion: "",
  taller: "Taller 1 (General)",
  fecha_entrada: "",
  fecha_salida: "",
  observaciones: "",
});

type Vista = "registro" | "listado" | "historial";

export default function ReparacionPage() {
  const { isAdmin, isSuperAdmin } = useAdminPermissions();

  const [vista, setVista] = useState<Vista>("registro");
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [reparaciones, setReparaciones] = useState<Reparacion[]>([]);
  const [cargando, setCargando] = useState(false);
  const [guardandoTodo, setGuardandoTodo] = useState(false);

  const [filas, setFilas] = useState<FilaNueva[]>([filaNuevaVacia(1)]);

  const [filaEditando, setFilaEditando] = useState<number | null>(null);
  const [borrador, setBorrador] = useState<Reparacion | null>(null);

  const [filtroUnidad, setFiltroUnidad] = useState("");
  const [filtroModelo, setFiltroModelo] = useState("");
  const [filtroMarca, setFiltroMarca] = useState("");
  const [filtroFechaDesde, setFiltroFechaDesde] = useState("");
  const [filtroFechaHasta, setFiltroFechaHasta] = useState("");
  const [filtrosAplicados, setFiltrosAplicados] = useState({
    unidad: "",
    modelo: "",
    marca: "",
    fechaDesde: "",
    fechaHasta: "",
  });

  const cargarDatos = async () => {
    try {
      setCargando(true);
      const [vehiculosData, reparacionesData] = await Promise.all([
        vehiculosService.getAll(),
        reparacionService.getAll(),
      ]);
      setVehiculos(vehiculosData);
      setReparaciones(reparacionesData);
    } catch (err) {
      console.error(err);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const nombreVehiculo = (r: Reparacion) =>
    r.vehiculo?.nombre || r.vehiculo?.codigo || `Vehículo #${r.vehiculo?.id_vehiculo}`;

  const marcasDisponibles = Array.from(
    new Set(vehiculos.map((v) => v.marca).filter(Boolean))
  );
  const modelosDisponibles = Array.from(
    new Set(vehiculos.map((v) => v.modelo).filter(Boolean))
  );

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
    f.id_vehiculo > 0 && f.descripcion.trim() !== "" && f.fecha_entrada !== "";

  const handleGuardarTodo = async () => {
    const filasAGuardar = filas.filter(filaCompleta);
    if (filasAGuardar.length === 0) {
      alert("Completá al menos una fila con Unidad, Descripción y Fecha de entrada antes de guardar.");
      return;
    }
    try {
      setGuardandoTodo(true);
      for (const f of filasAGuardar) {
        const payload: CreateReparacionPayload = {
          id_vehiculo: f.id_vehiculo,
          descripcion: f.descripcion,
          taller: f.taller,
          fecha_entrada: f.fecha_entrada,
          fecha_salida: f.fecha_salida || undefined,
          observaciones: f.observaciones || undefined,
        };
        await reparacionService.create(payload);
      }
      const idsGuardados = new Set(filasAGuardar.map((f) => f.id));
      const restantes = filas.filter((f) => !idsGuardados.has(f.id));
      setFilas(restantes.length > 0 ? restantes : [filaNuevaVacia(1)]);
      await cargarDatos();
      alert(`Se registraron ${filasAGuardar.length} reparación(es) correctamente.`);
    } catch (err) {
      alert("Ocurrió un error al guardar. Revisá las filas e intentá de nuevo.");
      console.error(err);
    } finally {
      setGuardandoTodo(false);
    }
  };

  const iniciarEdicion = (r: Reparacion) => {
    setFilaEditando(r.id);
    setBorrador({ ...r });
  };

  const cancelarEdicion = () => {
    setFilaEditando(null);
    setBorrador(null);
  };

  const updateBorrador = <K extends keyof Reparacion>(campo: K, valor: Reparacion[K]) => {
    setBorrador((prev: Reparacion | null) => (prev ? { ...prev, [campo]: valor } : prev));
  };

  const guardarEdicion = async () => {
    if (filaEditando === null || !borrador) return;
    try {
      await reparacionService.update(filaEditando, {
        descripcion: borrador.descripcion,
        taller: borrador.taller as TallerTipo,
        fecha_entrada: borrador.fecha_entrada,
        fecha_salida: borrador.fecha_salida || undefined,
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
    if (!confirm("¿Eliminar esta reparación?")) return;
    try {
      await reparacionService.remove(id);
      await cargarDatos();
    } catch (err) {
      alert("No se pudo eliminar la reparación.");
      console.error(err);
    }
  };

  const buscarHistorial = () => {
    setFiltrosAplicados({
      unidad: filtroUnidad,
      modelo: filtroModelo,
      marca: filtroMarca,
      fechaDesde: filtroFechaDesde,
      fechaHasta: filtroFechaHasta,
    });
  };

  const limpiarFiltros = () => {
    setFiltroUnidad("");
    setFiltroModelo("");
    setFiltroMarca("");
    setFiltroFechaDesde("");
    setFiltroFechaHasta("");
    setFiltrosAplicados({ unidad: "", modelo: "", marca: "", fechaDesde: "", fechaHasta: "" });
  };

  const historialFiltrado = reparaciones.filter((r) => {
    if (
      filtrosAplicados.unidad &&
      !nombreVehiculo(r).toLowerCase().includes(filtrosAplicados.unidad.toLowerCase())
    )
      return false;
    if (filtrosAplicados.modelo && r.vehiculo?.modelo !== filtrosAplicados.modelo) return false;
    if (filtrosAplicados.marca && r.vehiculo?.marca !== filtrosAplicados.marca) return false;
    if (filtrosAplicados.fechaDesde && r.fecha_entrada < filtrosAplicados.fechaDesde) return false;
    if (filtrosAplicados.fechaHasta && r.fecha_entrada > filtrosAplicados.fechaHasta) return false;
    return true;
  });

  const inputClass =
    "border border-gray-300 rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-36";

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Reparación</h1>

        <div className="flex flex-wrap gap-3 mt-4">
          <button
            onClick={() => setVista("registro")}
            className={`px-5 py-2 rounded-lg text-white font-medium transition-colors ${
              vista === "registro" ? "bg-[#0062e3]" : "bg-gray-400 hover:bg-gray-500"
            }`}
          >
            Registro de Reparaciones
          </button>
          <button
            onClick={() => setVista("listado")}
            className={`px-5 py-2 rounded-lg text-white font-medium transition-colors ${
              vista === "listado" ? "bg-[#0062e3]" : "bg-gray-400 hover:bg-gray-500"
            }`}
          >
            Listado de Reparaciones
          </button>
          <button
            onClick={() => setVista("historial")}
            className={`px-5 py-2 rounded-lg text-white font-medium transition-colors ${
              vista === "historial" ? "bg-[#0062e3]" : "bg-gray-400 hover:bg-gray-500"
            }`}
          >
            Historial de Reparaciones
          </button>
        </div>
      </div>

      {vista === "registro" && (
        <>
          <div className="bg-white rounded-xl shadow border border-gray-200 overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-3 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">Unidad</th>
                  <th className="px-3 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">Descripción del trabajo</th>
                  <th className="px-3 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">Taller</th>
                  <th className="px-3 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">Fecha de entrada</th>
                  <th className="px-3 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">Fecha de salida</th>
                  <th className="px-3 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">Observaciones</th>
                  <th className="px-3 py-3 text-right font-semibold text-gray-600 whitespace-nowrap"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filas.map((fila) => (
                  <tr key={fila.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-3 py-2">
                      <select
                        value={fila.id_vehiculo || ""}
                        onChange={(e) => actualizarFila(fila.id, "id_vehiculo", Number(e.target.value))}
                        className={inputClass}
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
                      <textarea
                        placeholder="Describa el trabajo..."
                        value={fila.descripcion}
                        onChange={(e) => actualizarFila(fila.id, "descripcion", e.target.value)}
                        rows={2}
                        className={`${inputClass} w-64 resize-none`}
                      />
                    </td>
                    <td className="px-3 py-2">
                      <select
                        value={fila.taller}
                        onChange={(e) => actualizarFila(fila.id, "taller", e.target.value)}
                        className={inputClass}
                      >
                        {TALLERES.map((t) => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-3 py-2">
                      <input
                        type="date"
                        value={fila.fecha_entrada}
                        onChange={(e) => actualizarFila(fila.id, "fecha_entrada", e.target.value)}
                        className={inputClass}
                      />
                    </td>
                    <td className="px-3 py-2">
                      <input
                        type="date"
                        value={fila.fecha_salida}
                        onChange={(e) => actualizarFila(fila.id, "fecha_salida", e.target.value)}
                        className={inputClass}
                      />
                    </td>
                    <td className="px-3 py-2">
                      <input
                        type="text"
                        placeholder="Observaciones..."
                        value={fila.observaciones}
                        onChange={(e) => actualizarFila(fila.id, "observaciones", e.target.value)}
                        className={`${inputClass} w-44`}
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
          </div>

          <div className="flex gap-3">
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
        </>
      )}

      {vista === "listado" && (
        <div className="bg-white rounded-xl shadow border border-gray-200 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-3 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">Unidad</th>
                <th className="px-3 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">Descripción del trabajo</th>
                <th className="px-3 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">Taller</th>
                <th className="px-3 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">Fecha de entrada</th>
                <th className="px-3 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">Fecha de salida</th>
                <th className="px-3 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">Observaciones</th>
                <th className="px-3 py-3 text-right font-semibold text-gray-600 whitespace-nowrap">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {cargando && (
                <tr>
                  <td colSpan={7} className="px-3 py-6 text-center text-gray-400">Cargando...</td>
                </tr>
              )}
              {!cargando && reparaciones.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-3 py-6 text-center text-gray-400">
                    No hay reparaciones cargadas.
                  </td>
                </tr>
              )}
              {!cargando && reparaciones.map((r) => {
                const editando = filaEditando === r.id && borrador !== null;
                const mostrado = editando ? borrador! : r;

                return (
                  <tr
                    key={r.id}
                    className={`border-b border-gray-100 last:border-0 ${editando ? "bg-blue-50" : ""}`}
                  >
                    <td className="px-3 py-2">{nombreVehiculo(mostrado)}</td>
                    <td className="px-3 py-2">
                      {editando ? (
                        <textarea
                          value={mostrado.descripcion}
                          onChange={(e) => updateBorrador("descripcion", e.target.value)}
                          rows={2}
                          className={`${inputClass} w-64 resize-none`}
                        />
                      ) : (
                        mostrado.descripcion
                      )}
                    </td>
                    <td className="px-3 py-2">
                      {editando ? (
                        <select
                          value={mostrado.taller}
                          onChange={(e) => updateBorrador("taller", e.target.value as TallerTipo)}
                          className={inputClass}
                        >
                          {TALLERES.map((t) => (
                            <option key={t} value={t}>{t}</option>
                          ))}
                        </select>
                      ) : (
                        mostrado.taller
                      )}
                    </td>
                    <td className="px-3 py-2">
                      {editando ? (
                        <input
                          type="date"
                          value={mostrado.fecha_entrada}
                          onChange={(e) => updateBorrador("fecha_entrada", e.target.value)}
                          className={inputClass}
                        />
                      ) : (
                        mostrado.fecha_entrada
                      )}
                    </td>
                    <td className="px-3 py-2">
                      {editando ? (
                        <input
                          type="date"
                          value={mostrado.fecha_salida || ""}
                          onChange={(e) => updateBorrador("fecha_salida", e.target.value)}
                          className={inputClass}
                        />
                      ) : (
                        mostrado.fecha_salida || "-"
                      )}
                    </td>
                    <td className="px-3 py-2">
                      {editando ? (
                        <input
                          type="text"
                          value={mostrado.observaciones || ""}
                          onChange={(e) => updateBorrador("observaciones", e.target.value)}
                          className={`${inputClass} w-44`}
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
                            {isAdmin() && (
                              <button
                                onClick={() => iniciarEdicion(r)}
                                className="text-blue-600 hover:text-blue-800 text-sm font-medium border border-blue-200 rounded px-3 py-1 hover:bg-blue-50 transition-colors"
                              >
                                Editar
                              </button>
                            )}
                            {isSuperAdmin() && (
                              <button
                                onClick={() => handleEliminar(r.id)}
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

      {vista === "historial" && (
        <div className="bg-white rounded-xl shadow border border-gray-200 p-6">
          <div className="flex flex-wrap gap-4 items-end">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-600">Unidad</label>
              <input
                type="text"
                placeholder="Buscar por unidad"
                value={filtroUnidad}
                onChange={(e) => setFiltroUnidad(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-48"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-600">Modelo</label>
              <select
                value={filtroModelo}
                onChange={(e) => setFiltroModelo(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-48 text-gray-500"
              >
                <option value="">— Seleccionar —</option>
                {modelosDisponibles.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-600">Marca</label>
              <select
                value={filtroMarca}
                onChange={(e) => setFiltroMarca(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-48 text-gray-500"
              >
                <option value="">— Seleccionar —</option>
                {marcasDisponibles.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-600">Desde</label>
              <input
                type="date"
                value={filtroFechaDesde}
                onChange={(e) => setFiltroFechaDesde(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-40"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-600">Hasta</label>
              <input
                type="date"
                value={filtroFechaHasta}
                onChange={(e) => setFiltroFechaHasta(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-40"
              />
            </div>
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

          <div className="bg-white rounded-xl shadow border border-gray-200 overflow-x-auto mt-4">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-3 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">Unidad</th>
                  <th className="px-3 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">Descripción del trabajo</th>
                  <th className="px-3 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">Taller</th>
                  <th className="px-3 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">Fecha de entrada</th>
                  <th className="px-3 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">Fecha de salida</th>
                  <th className="px-3 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">Observaciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {historialFiltrado.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-3 py-2">{nombreVehiculo(r) || "—"}</td>
                    <td className="px-3 py-2">{r.descripcion || "—"}</td>
                    <td className="px-3 py-2">{r.taller || "—"}</td>
                    <td className="px-3 py-2">{r.fecha_entrada || "—"}</td>
                    <td className="px-3 py-2">{r.fecha_salida || "—"}</td>
                    <td className="px-3 py-2">{r.observaciones || "—"}</td>
                  </tr>
                ))}
                {historialFiltrado.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-3 py-6 text-center text-gray-400">
                      No se encontraron reparaciones con los filtros aplicados.
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
