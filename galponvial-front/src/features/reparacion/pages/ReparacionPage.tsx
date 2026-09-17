import { useEffect, useState } from "react";
import { useAppStore } from "@/app/stores/appStore";
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

const formVacio: CreateReparacionPayload = {
  id_vehiculo: 0,
  descripcion: "",
  taller: "Taller 1 (General)",
  fecha_entrada: "",
  fecha_salida: "",
  observaciones: "",
};

type Vista = "registro" | "listado" | "historial";

export default function ReparacionPage() {
  const { user } = useAppStore();
  const puedeEliminar = user?.rol === "superadmin";

  const [vista, setVista] = useState<Vista>("registro");
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [reparaciones, setReparaciones] = useState<Reparacion[]>([]);
  const [cargando, setCargando] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [formData, setFormData] = useState<CreateReparacionPayload>(formVacio);

  const [filtroUnidad, setFiltroUnidad] = useState("");
  const [filtroFechaDesde, setFiltroFechaDesde] = useState("");
  const [filtroFechaHasta, setFiltroFechaHasta] = useState("");

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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "id_vehiculo" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.id_vehiculo) {
      alert("Seleccioná una unidad.");
      return;
    }
    try {
      setGuardando(true);
      await reparacionService.create(formData);
      setFormData(formVacio);
      await cargarDatos();
      setVista("listado");
    } catch (err) {
      alert("No se pudo registrar la reparación.");
      console.error(err);
    } finally {
      setGuardando(false);
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

  const nombreVehiculo = (r: Reparacion) =>
    r.vehiculo?.nombre || r.vehiculo?.codigo || `Vehículo #${r.vehiculo?.id_vehiculo}`;

  const reparacionesFiltradas = reparaciones.filter((r) => {
    if (
      filtroUnidad &&
      !nombreVehiculo(r).toLowerCase().includes(filtroUnidad.toLowerCase())
    ) {
      return false;
    }
    if (filtroFechaDesde && r.fecha_entrada < filtroFechaDesde) return false;
    if (filtroFechaHasta && r.fecha_entrada > filtroFechaHasta) return false;
    return true;
  });

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
        <div className="bg-white rounded-xl shadow border border-gray-200 p-6 max-w-lg">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Unidad *</label>
              <select
                name="id_vehiculo"
                value={formData.id_vehiculo || ""}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">— Seleccionar unidad —</option>
                {vehiculos.map((v) => (
                  <option key={v.id_vehiculo} value={v.id_vehiculo}>
                    {v.nombre} {v.codigo ? `(${v.codigo})` : ""}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descripción del trabajo *
              </label>
              <textarea
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                rows={3}
                required
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Taller *</label>
              <select
                name="taller"
                value={formData.taller}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {TALLERES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha de entrada *
              </label>
              <input
                type="date"
                name="fecha_entrada"
                value={formData.fecha_entrada}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha de salida
              </label>
              <input
                type="date"
                name="fecha_salida"
                value={formData.fecha_salida}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Observaciones
              </label>
              <textarea
                name="observaciones"
                value={formData.observaciones}
                onChange={handleChange}
                rows={2}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              disabled={guardando}
              className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow transition-colors disabled:opacity-50"
            >
              {guardando ? "Guardando..." : "Registrar Reparación"}
            </button>
          </form>
        </div>
      )}

      {vista === "listado" && (
        <div className="bg-white rounded-xl shadow border border-gray-200 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-3 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">Unidad</th>
                <th className="px-3 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">Descripción</th>
                <th className="px-3 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">Taller</th>
                <th className="px-3 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">Fecha entrada</th>
                <th className="px-3 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">Fecha salida</th>
                <th className="px-3 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">Observaciones</th>
                {puedeEliminar && (
                  <th className="px-3 py-3 text-right font-semibold text-gray-600 whitespace-nowrap">Acciones</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
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
              {!cargando && reparaciones.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-3 py-2">{nombreVehiculo(r)}</td>
                  <td className="px-3 py-2">{r.descripcion}</td>
                  <td className="px-3 py-2">{r.taller}</td>
                  <td className="px-3 py-2">{r.fecha_entrada}</td>
                  <td className="px-3 py-2">{r.fecha_salida || "-"}</td>
                  <td className="px-3 py-2">{r.observaciones || "-"}</td>
                  {puedeEliminar && (
                    <td className="px-3 py-2 text-right">
                      <button
                        onClick={() => handleEliminar(r.id)}
                        className="text-red-600 hover:text-red-800 text-sm font-medium border border-red-200 rounded px-3 py-1 hover:bg-red-50 transition-colors"
                      >
                        Eliminar
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {vista === "historial" && (
        <div className="bg-white rounded-xl shadow border border-gray-200 p-6">
          <div className="flex flex-wrap gap-4 items-end mb-4">
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
              onClick={() => {
                setFiltroUnidad("");
                setFiltroFechaDesde("");
                setFiltroFechaHasta("");
              }}
              className="px-5 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm font-medium rounded-lg shadow transition-colors"
            >
              Limpiar filtros
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-3 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">Unidad</th>
                  <th className="px-3 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">Descripción</th>
                  <th className="px-3 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">Taller</th>
                  <th className="px-3 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">Fecha entrada</th>
                  <th className="px-3 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">Fecha salida</th>
                  <th className="px-3 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">Observaciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {reparacionesFiltradas.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-3 py-2">{nombreVehiculo(r)}</td>
                    <td className="px-3 py-2">{r.descripcion}</td>
                    <td className="px-3 py-2">{r.taller}</td>
                    <td className="px-3 py-2">{r.fecha_entrada}</td>
                    <td className="px-3 py-2">{r.fecha_salida || "-"}</td>
                    <td className="px-3 py-2">{r.observaciones || "-"}</td>
                  </tr>
                ))}
                {reparacionesFiltradas.length === 0 && (
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
