import { useEffect, useState } from "react";
import { useAppStore } from "@/app/stores/appStore";
import { vehiculosService } from "../../vehiculos/services/vehiculosService";
import type { Vehiculo } from "../../vehiculos/types";
import {
  lubricanteService,
  type Lubricante,
  type CreateLubricantePayload,
} from "../services/lubricanteService";

const formVacio: CreateLubricantePayload = {
  id_vehiculo: 0,
  fecha: "",
  ordenRetiro: "",
  cantidad: 0,
  tipo: "",
  observaciones: "",
};

type Vista = "lubricantes" | "listado-lubricantes" | "historial-lubricantes";

export default function DepoCombustiblePage() {
  const { user } = useAppStore();
  const permisosUsuario = (user && "permisos" in user ? user.permisos : []) as unknown as string[];
  const puedeEscribir = permisosUsuario.includes("lubricentro:write");
  const puedeEliminar = user?.rol === "superadmin";

  const [vista, setVista] = useState<Vista>("lubricantes");
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [lubricantes, setLubricantes] = useState<Lubricante[]>([]);
  const [cargando, setCargando] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [formData, setFormData] = useState<CreateLubricantePayload>(formVacio);

  const [filtroDesde, setFiltroDesde] = useState("");
  const [filtroHasta, setFiltroHasta] = useState("");
  const [filtroOrden, setFiltroOrden] = useState("");
  const [filtroUnidad, setFiltroUnidad] = useState("");
  const [filtroTipo, setFiltroTipo] = useState("");

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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "id_vehiculo" || name === "cantidad" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!puedeEscribir) return;
    if (!formData.id_vehiculo) {
      alert("Seleccioná una unidad.");
      return;
    }
    try {
      setGuardando(true);
      await lubricanteService.create(formData);
      setFormData(formVacio);
      await cargarDatos();
      setVista("listado-lubricantes");
    } catch (err) {
      alert("No se pudo registrar el lubricante.");
      console.error(err);
    } finally {
      setGuardando(false);
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

  const historialFiltrado = lubricantes.filter((l) => {
    if (filtroDesde && l.fecha < filtroDesde) return false;
    if (filtroHasta && l.fecha > filtroHasta) return false;
    if (
      filtroOrden &&
      !(l.ordenRetiro || "").toLowerCase().includes(filtroOrden.toLowerCase())
    )
      return false;
    if (
      filtroUnidad &&
      !nombreVehiculo(l).toLowerCase().includes(filtroUnidad.toLowerCase())
    )
      return false;
    if (filtroTipo && !l.tipo.toLowerCase().includes(filtroTipo.toLowerCase()))
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha *</label>
              <input
                type="date"
                name="fecha"
                value={formData.fecha}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                N° Orden de Retiro
              </label>
              <input
                type="text"
                name="ordenRetiro"
                value={formData.ordenRetiro}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cantidad *</label>
              <input
                type="number"
                name="cantidad"
                min={0}
                value={formData.cantidad}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de lubricante *
              </label>
              <input
                type="text"
                name="tipo"
                value={formData.tipo}
                onChange={handleChange}
                required
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
              {guardando ? "Guardando..." : "Registrar Lubricante"}
            </button>
          </form>
        </div>
      )}

      {vista === "listado-lubricantes" && (
        <div className="bg-white rounded-xl shadow border border-gray-200 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-3 py-3 text-left font-semibold text-gray-600">Fecha</th>
                <th className="px-3 py-3 text-left font-semibold text-gray-600">N° Orden</th>
                <th className="px-3 py-3 text-left font-semibold text-gray-600">Unidad</th>
                <th className="px-3 py-3 text-left font-semibold text-gray-600">Cantidad</th>
                <th className="px-3 py-3 text-left font-semibold text-gray-600">Tipo</th>
                <th className="px-3 py-3 text-left font-semibold text-gray-600">Observaciones</th>
                {puedeEliminar && (
                  <th className="px-3 py-3 text-right font-semibold text-gray-600">Acciones</th>
                )}
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
              {!cargando && lubricantes.map((l) => (
                <tr key={l.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-3 py-2">{l.fecha}</td>
                  <td className="px-3 py-2">{l.ordenRetiro || "-"}</td>
                  <td className="px-3 py-2">{nombreVehiculo(l)}</td>
                  <td className="px-3 py-2">{l.cantidad}</td>
                  <td className="px-3 py-2">{l.tipo}</td>
                  <td className="px-3 py-2">{l.observaciones || "-"}</td>
                  {puedeEliminar && (
                    <td className="px-3 py-2 text-right">
                      <button
                        onClick={() => handleEliminar(l.id)}
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

      {vista === "historial-lubricantes" && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl shadow border border-gray-200 p-4">
            <div className="flex flex-wrap gap-4 items-end">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-500">Periodo desde</label>
                <input
                  type="date"
                  value={filtroDesde}
                  onChange={(e) => setFiltroDesde(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-1.5 text-sm w-40"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-500">Periodo hasta</label>
                <input
                  type="date"
                  value={filtroHasta}
                  onChange={(e) => setFiltroHasta(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-1.5 text-sm w-40"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-500">N° Orden de Retiro</label>
                <input
                  type="text"
                  value={filtroOrden}
                  onChange={(e) => setFiltroOrden(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-1.5 text-sm w-44"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-500">Unidad</label>
                <input
                  type="text"
                  value={filtroUnidad}
                  onChange={(e) => setFiltroUnidad(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-1.5 text-sm w-48"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-500">Tipo</label>
                <input
                  type="text"
                  value={filtroTipo}
                  onChange={(e) => setFiltroTipo(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-1.5 text-sm w-44"
                />
              </div>
              <button
                onClick={() => {
                  setFiltroDesde("");
                  setFiltroHasta("");
                  setFiltroOrden("");
                  setFiltroUnidad("");
                  setFiltroTipo("");
                }}
                className="px-5 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm font-medium rounded-lg shadow transition-colors"
              >
                Limpiar filtros
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow border border-gray-200 overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-3 py-3 text-left font-semibold text-gray-600">Fecha</th>
                  <th className="px-3 py-3 text-left font-semibold text-gray-600">N° Orden</th>
                  <th className="px-3 py-3 text-left font-semibold text-gray-600">Unidad</th>
                  <th className="px-3 py-3 text-left font-semibold text-gray-600">Cantidad</th>
                  <th className="px-3 py-3 text-left font-semibold text-gray-600">Tipo</th>
                  <th className="px-3 py-3 text-left font-semibold text-gray-600">Observaciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {historialFiltrado.map((l) => (
                  <tr key={l.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-3 py-2">{l.fecha}</td>
                    <td className="px-3 py-2">{l.ordenRetiro || "-"}</td>
                    <td className="px-3 py-2">{nombreVehiculo(l)}</td>
                    <td className="px-3 py-2">{l.cantidad}</td>
                    <td className="px-3 py-2">{l.tipo}</td>
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
