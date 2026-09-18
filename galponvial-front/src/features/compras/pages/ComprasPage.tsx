import { useEffect, useState } from "react";
import { useAppStore } from "@/app/stores/appStore";
import { proveedoresService, type Proveedor } from "../../proveedores/services/proveedoresService";
import { PresupuestoForm } from "../components/PresupuestoForm";
import {
  presupuestoService,
  type Presupuesto,
} from "../services/presupuestoService";
import {
  suministroService,
  type Suministro,
  type CreateSuministroPayload,
  type SuministroItem,
} from "../services/suministroService";
import {
  ordenCompraService,
  type OrdenCompra,
  type CreateOrdenCompraPayload,
} from "../services/ordenCompraService";

type Vista = "presupuestos" | "suministro" | "historial-presupuestos" | "historial";

const itemVacio = (): SuministroItem => ({
  cantidad: "",
  descripcion: "",
  costoUnitario: undefined,
  costoEstimado: undefined,
});

const suministroFormVacio = (fecha: string): CreateSuministroPayload => ({
  fecha,
  numeroSuministro: "",
  id_proveedor: undefined,
  producto: "",
  agente: "",
  jurisdiccion: "",
  unidadEjecutora: "",
  dependenciaSolicitante: "",
  unidad: "",
  observaciones: "",
  id_presupuesto: undefined,
  items: [itemVacio()],
});

const ordenCompraFormVacio: CreateOrdenCompraPayload = {
  numeroOrden: "",
  id_suministro: undefined,
  id_proveedor: undefined,
  tipoFactura: undefined,
  numeroFactura: "",
  monto: undefined,
  fechaEntrega: "",
  estado: "pendiente",
  unidad: "",
};

export default function ComprasPage() {
  const { user } = useAppStore();
  const puedeEliminar = user?.rol === "superadmin";
  const todayString = new Date().toISOString().split("T")[0];

  const [vista, setVista] = useState<Vista>("presupuestos");
  const [cargando, setCargando] = useState(false);

  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [presupuestos, setPresupuestos] = useState<Presupuesto[]>([]);
  const [suministros, setSuministros] = useState<Suministro[]>([]);
  const [ordenesCompra, setOrdenesCompra] = useState<OrdenCompra[]>([]);

  const [suministroForm, setSuministroForm] = useState<CreateSuministroPayload>(
    suministroFormVacio(todayString)
  );
  const [guardandoSuministro, setGuardandoSuministro] = useState(false);

  const [mostrarFormOrden, setMostrarFormOrden] = useState(false);
  const [ordenForm, setOrdenForm] = useState<CreateOrdenCompraPayload>(ordenCompraFormVacio);
  const [guardandoOrden, setGuardandoOrden] = useState(false);

  const [filtroProveedorPresupuesto, setFiltroProveedorPresupuesto] = useState("");
  const [filtroFechaPresupuesto, setFiltroFechaPresupuesto] = useState("");
  const [filtroDesdePresupuesto, setFiltroDesdePresupuesto] = useState("");
  const [filtroHastaPresupuesto, setFiltroHastaPresupuesto] = useState("");
  const [filtroUnidadPresupuesto, setFiltroUnidadPresupuesto] = useState("");

  const [filtroNumOrden, setFiltroNumOrden] = useState("");
  const [filtroNumSuministro, setFiltroNumSuministro] = useState("");
  const [filtroProveedorOrden, setFiltroProveedorOrden] = useState("");
  const [filtroTipoFactura, setFiltroTipoFactura] = useState("");
  const [filtroEstadoOrden, setFiltroEstadoOrden] = useState("");
  const [filtroUnidadOrden, setFiltroUnidadOrden] = useState("");

  const cargarDatos = async () => {
    try {
      setCargando(true);
      const [proveedoresData, presupuestosData, suministrosData, ordenesData] =
        await Promise.all([
          proveedoresService.getAll(),
          presupuestoService.getAll(),
          suministroService.getAll(),
          ordenCompraService.getAll(),
        ]);
      setProveedores(proveedoresData);
      setPresupuestos(presupuestosData);
      setSuministros(suministrosData);
      setOrdenesCompra(ordenesData);
    } catch (err) {
      console.error(err);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const nombreProveedor = (p: Proveedor | null) => p?.nombre || "-";

  const handleChangeSuministro = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setSuministroForm((prev) => ({
      ...prev,
      [name]:
        name === "id_proveedor" || name === "id_presupuesto"
          ? value
            ? Number(value)
            : undefined
          : value,
    }));
  };

  const handleChangeItem = (
    index: number,
    campo: keyof SuministroItem,
    valor: string
  ) => {
    setSuministroForm((prev) => {
      const items = [...(prev.items || [])];
      items[index] = {
        ...items[index],
        [campo]:
          campo === "costoUnitario" || campo === "costoEstimado"
            ? valor
              ? Number(valor)
              : undefined
            : valor,
      };
      return { ...prev, items };
    });
  };

  const agregarItem = () => {
    setSuministroForm((prev) => ({
      ...prev,
      items: [...(prev.items || []), itemVacio()],
    }));
  };

  const quitarItem = (index: number) => {
    setSuministroForm((prev) => ({
      ...prev,
      items: (prev.items || []).filter((_, i) => i !== index),
    }));
  };

  const handleSubmitSuministro = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setGuardandoSuministro(true);
      await suministroService.create(suministroForm);
      setSuministroForm(suministroFormVacio(todayString));
      await cargarDatos();
      alert("Suministro registrado correctamente.");
    } catch (err) {
      alert("No se pudo registrar el suministro.");
      console.error(err);
    } finally {
      setGuardandoSuministro(false);
    }
  };

  const handleLimpiarSuministro = () => {
    setSuministroForm(suministroFormVacio(todayString));
  };

  const handleChangeOrden = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setOrdenForm((prev) => ({
      ...prev,
      [name]:
        name === "id_suministro" || name === "id_proveedor"
          ? value
            ? Number(value)
            : undefined
          : name === "monto"
          ? value
            ? Number(value)
            : undefined
          : value,
    }));
  };

  const handleSubmitOrden = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setGuardandoOrden(true);
      await ordenCompraService.create(ordenForm);
      setOrdenForm(ordenCompraFormVacio);
      setMostrarFormOrden(false);
      await cargarDatos();
      alert("Orden de compra registrada correctamente.");
    } catch (err) {
      alert("No se pudo registrar la orden de compra.");
      console.error(err);
    } finally {
      setGuardandoOrden(false);
    }
  };

  const handleEliminarPresupuesto = async (id: number) => {
    if (!confirm("¿Eliminar este presupuesto?")) return;
    try {
      await presupuestoService.remove(id);
      await cargarDatos();
    } catch (err) {
      alert("No se pudo eliminar el presupuesto.");
      console.error(err);
    }
  };

  const handleEliminarOrden = async (id: number) => {
    if (!confirm("¿Eliminar esta orden de compra?")) return;
    try {
      await ordenCompraService.remove(id);
      await cargarDatos();
    } catch (err) {
      alert("No se pudo eliminar la orden de compra.");
      console.error(err);
    }
  };

  const presupuestosFiltrados = presupuestos.filter((p) => {
    if (
      filtroProveedorPresupuesto &&
      String(p.proveedor?.id || "") !== filtroProveedorPresupuesto
    )
      return false;
    if (filtroFechaPresupuesto && p.fechaSolicitud !== filtroFechaPresupuesto)
      return false;
    if (filtroDesdePresupuesto && p.fechaSolicitud < filtroDesdePresupuesto)
      return false;
    if (filtroHastaPresupuesto && p.fechaSolicitud > filtroHastaPresupuesto)
      return false;
    if (
      filtroUnidadPresupuesto &&
      !p.unidad.toLowerCase().includes(filtroUnidadPresupuesto.toLowerCase())
    )
      return false;
    return true;
  });

  const ordenesFiltradas = ordenesCompra.filter((o) => {
    if (
      filtroNumOrden &&
      !o.numeroOrden.toLowerCase().includes(filtroNumOrden.toLowerCase())
    )
      return false;
    if (
      filtroNumSuministro &&
      !(o.suministro?.numeroSuministro || "")
        .toLowerCase()
        .includes(filtroNumSuministro.toLowerCase())
    )
      return false;
    if (
      filtroProveedorOrden &&
      String(o.proveedor?.id || "") !== filtroProveedorOrden
    )
      return false;
    if (filtroTipoFactura && o.tipoFactura !== filtroTipoFactura) return false;
    if (filtroEstadoOrden && o.estado !== filtroEstadoOrden) return false;
    if (
      filtroUnidadOrden &&
      !(o.unidad || "").toLowerCase().includes(filtroUnidadOrden.toLowerCase())
    )
      return false;
    return true;
  });

  const limpiarFiltrosPresupuestos = () => {
    setFiltroProveedorPresupuesto("");
    setFiltroFechaPresupuesto("");
    setFiltroDesdePresupuesto("");
    setFiltroHastaPresupuesto("");
    setFiltroUnidadPresupuesto("");
  };

  const limpiarFiltrosOrdenes = () => {
    setFiltroNumOrden("");
    setFiltroNumSuministro("");
    setFiltroProveedorOrden("");
    setFiltroTipoFactura("");
    setFiltroEstadoOrden("");
    setFiltroUnidadOrden("");
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Compras</h1>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setVista("presupuestos")}
            className={`px-4 py-2 rounded font-medium text-white transition-colors ${
              vista === "presupuestos" ? "bg-[#0062e3]" : "bg-gray-400 hover:bg-gray-500"
            }`}
          >
            Presupuestos
          </button>
          <button
            onClick={() => setVista("suministro")}
            className={`px-4 py-2 rounded font-medium text-white transition-colors ${
              vista === "suministro" ? "bg-[#0062e3]" : "bg-gray-400 hover:bg-gray-500"
            }`}
          >
            Suministro
          </button>
          <button
            onClick={() => setVista("historial-presupuestos")}
            className={`px-4 py-2 rounded font-medium text-white transition-colors ${
              vista === "historial-presupuestos" ? "bg-[#0062e3]" : "bg-gray-400 hover:bg-gray-500"
            }`}
          >
            Historial de Presupuestos
          </button>
          <button
            onClick={() => setVista("historial")}
            className={`px-4 py-2 rounded font-medium text-white transition-colors ${
              vista === "historial" ? "bg-[#0062e3]" : "bg-gray-400 hover:bg-gray-500"
            }`}
          >
            Historial de Compras
          </button>
        </div>
      </div>

      {cargando && <p className="text-gray-400">Cargando datos...</p>}

      {vista === "presupuestos" && (
        <div className="flex flex-col gap-6">
          <div className="flex flex-col lg:flex-row gap-6 items-stretch">
            <PresupuestoForm numero={1} onCreado={cargarDatos} />
            <PresupuestoForm numero={2} onCreado={cargarDatos} />
          </div>
          <div className="flex flex-col lg:flex-row gap-6 items-stretch">
            <PresupuestoForm numero={3} onCreado={cargarDatos} />
          </div>
        </div>
      )}

      {vista === "suministro" && (
        <div className="flex flex-col xl:flex-row gap-6 items-start">
          <div className="bg-white rounded-lg shadow p-6 w-full max-w-xl flex flex-col">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Suministro</h2>
            <form onSubmit={handleSubmitSuministro} className="flex flex-col flex-1">
              <div className="space-y-5 flex-1">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fecha *</label>
                  <input
                    type="date"
                    name="fecha"
                    value={suministroForm.fecha}
                    onChange={handleChangeSuministro}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">N° de Suministro *</label>
                  <input
                    type="text"
                    name="numeroSuministro"
                    value={suministroForm.numeroSuministro}
                    onChange={handleChangeSuministro}
                    placeholder="Ingrese el número de suministro"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Lugar de Emisión</label>
                  <input type="text" value="Lobería" readOnly className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Proveedor</label>
                  <select
                    name="id_proveedor"
                    value={suministroForm.id_proveedor ?? ""}
                    onChange={handleChangeSuministro}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">— Sin proveedor asignado —</option>
                    {proveedores.map((p) => (
                      <option key={p.id} value={p.id}>{p.nombre}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Presupuesto asociado</label>
                  <select
                    name="id_presupuesto"
                    value={suministroForm.id_presupuesto ?? ""}
                    onChange={handleChangeSuministro}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">— Sin presupuesto asociado —</option>
                    {presupuestos.map((p) => (
                      <option key={p.id} value={p.id}>
                        #{p.id} — {p.producto} ({nombreProveedor(p.proveedor)})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Producto</label>
                  <input
                    type="text"
                    name="producto"
                    value={suministroForm.producto}
                    onChange={handleChangeSuministro}
                    placeholder="Ingrese el producto"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Agente</label>
                  <input
                    type="text"
                    name="agente"
                    value={suministroForm.agente}
                    onChange={handleChangeSuministro}
                    placeholder="Ingrese el agente"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Jurisdicción</label>
                  <input
                    type="text"
                    name="jurisdiccion"
                    value={suministroForm.jurisdiccion}
                    onChange={handleChangeSuministro}
                    placeholder="Ingrese la jurisdicción"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Unidad Ejecutora</label>
                  <input
                    type="text"
                    name="unidadEjecutora"
                    value={suministroForm.unidadEjecutora}
                    onChange={handleChangeSuministro}
                    placeholder="Ingrese la unidad ejecutora"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Dependencia Solicitante</label>
                  <input
                    type="text"
                    name="dependenciaSolicitante"
                    value={suministroForm.dependenciaSolicitante}
                    onChange={handleChangeSuministro}
                    placeholder="Ingrese la dependencia solicitante"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Unidad *</label>
                  <input
                    type="text"
                    name="unidad"
                    value={suministroForm.unidad}
                    onChange={handleChangeSuministro}
                    placeholder="Ingrese la unidad"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Observaciones</label>
                  <textarea
                    name="observaciones"
                    value={suministroForm.observaciones}
                    onChange={handleChangeSuministro}
                    placeholder="Ingrese observaciones adicionales..."
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none flex-1"
                  />
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-auto">* Campos obligatorios</p>
              <div className="flex gap-4 mt-2">
                <button
                  type="submit"
                  disabled={guardandoSuministro}
                  className="flex-1 px-6 py-3 bg-[#378AFE] text-white font-medium rounded-lg hover:bg-[#0962DE] transition-colors disabled:opacity-50"
                >
                  {guardandoSuministro ? "Guardando..." : "Registrar Suministro"}
                </button>
                <button
                  type="button"
                  onClick={handleLimpiarSuministro}
                  className="flex-1 px-6 py-3 bg-gray-300 text-gray-800 font-medium rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Limpiar
                </button>
              </div>
            </form>
          </div>
          <div className="bg-white rounded-lg shadow p-6 flex-1 flex flex-col w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-700">Ítems del Suministro</h3>
              <button
                type="button"
                onClick={agregarItem}
                className="px-3 py-1.5 bg-[#378AFE] text-white text-sm font-medium rounded-lg hover:bg-[#0962DE] transition-colors"
              >
                + Agregar ítem
              </button>
            </div>
            <div className="flex flex-col flex-1 border border-gray-300 rounded overflow-x-auto">
              <div className="grid grid-cols-5 bg-gray-100 min-w-[600px]">
                <div className="border-b border-r border-gray-300 px-3 py-2 text-center text-sm font-semibold text-gray-700">Cantidad</div>
                <div className="border-b border-r border-gray-300 px-3 py-2 text-center text-sm font-semibold text-gray-700">Descripción</div>
                <div className="border-b border-r border-gray-300 px-3 py-2 text-center text-sm font-semibold text-gray-700">C. Unitario</div>
                <div className="border-b border-r border-gray-300 px-3 py-2 text-center text-sm font-semibold text-gray-700">C. Estimado</div>
                <div className="border-b border-gray-300 px-3 py-2 text-center text-sm font-semibold text-gray-700"></div>
              </div>
              {(suministroForm.items || []).map((item, i) => (
                <div key={i} className="grid grid-cols-5 min-w-[600px]">
                  <div className="border-b border-r border-gray-300 px-2 py-1">
                    <input
                      type="text"
                      value={item.cantidad || ""}
                      onChange={(e) => handleChangeItem(i, "cantidad", e.target.value)}
                      className="w-full focus:outline-none text-sm"
                    />
                  </div>
                  <div className="border-b border-r border-gray-300 px-2 py-1">
                    <input
                      type="text"
                      value={item.descripcion || ""}
                      onChange={(e) => handleChangeItem(i, "descripcion", e.target.value)}
                      className="w-full focus:outline-none text-sm"
                    />
                  </div>
                  <div className="border-b border-r border-gray-300 px-2 py-1">
                    <input
                      type="number"
                      value={item.costoUnitario ?? ""}
                      onChange={(e) => handleChangeItem(i, "costoUnitario", e.target.value)}
                      className="w-full focus:outline-none text-sm"
                    />
                  </div>
                  <div className="border-b border-r border-gray-300 px-2 py-1">
                    <input
                      type="number"
                      value={item.costoEstimado ?? ""}
                      onChange={(e) => handleChangeItem(i, "costoEstimado", e.target.value)}
                      className="w-full focus:outline-none text-sm"
                    />
                  </div>
                  <div className="border-b border-gray-300 px-2 py-1 flex items-center justify-center">
                    <button
                      type="button"
                      onClick={() => quitarItem(i)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-2">
              Los ítems se guardan junto con el suministro al hacer clic en "Registrar Suministro".
            </p>
          </div>
        </div>
      )}

      {vista === "historial-presupuestos" && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Historial de Presupuestos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Proveedor</label>
              <select
                value={filtroProveedorPresupuesto}
                onChange={(e) => setFiltroProveedorPresupuesto(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todos</option>
                {proveedores.map((p) => (
                  <option key={p.id} value={p.id}>{p.nombre}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
              <input
                type="date"
                value={filtroFechaPresupuesto}
                onChange={(e) => setFiltroFechaPresupuesto(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Período — Desde</label>
              <input
                type="date"
                value={filtroDesdePresupuesto}
                onChange={(e) => setFiltroDesdePresupuesto(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Período — Hasta</label>
              <input
                type="date"
                value={filtroHastaPresupuesto}
                onChange={(e) => setFiltroHastaPresupuesto(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Unidad</label>
              <input
                type="text"
                placeholder="Ingrese la unidad"
                value={filtroUnidadPresupuesto}
                onChange={(e) => setFiltroUnidadPresupuesto(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="flex gap-4 mt-6 mb-6">
            <button
              type="button"
              onClick={limpiarFiltrosPresupuestos}
              className="px-6 py-2 bg-gray-300 text-gray-800 font-medium rounded-lg hover:bg-gray-400 transition-colors"
            >
              Limpiar filtros
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-3 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">Proveedor</th>
                  <th className="px-3 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">Producto</th>
                  <th className="px-3 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">Precio</th>
                  <th className="px-3 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">Unidad</th>
                  <th className="px-3 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">Área Municipio</th>
                  <th className="px-3 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">F. Solicitud</th>
                  <th className="px-3 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">F. Entrega</th>
                  <th className="px-3 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">Estado</th>
                  {puedeEliminar && (
                    <th className="px-3 py-3 text-right font-semibold text-gray-600 whitespace-nowrap">Acciones</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {presupuestosFiltrados.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-3 py-2">{nombreProveedor(p.proveedor)}</td>
                    <td className="px-3 py-2">{p.producto}</td>
                    <td className="px-3 py-2">${Number(p.precio).toFixed(2)}</td>
                    <td className="px-3 py-2">{p.unidad}</td>
                    <td className="px-3 py-2">{p.areaMunicipio}</td>
                    <td className="px-3 py-2">{p.fechaSolicitud}</td>
                    <td className="px-3 py-2">{p.fechaEntrega}</td>
                    <td className="px-3 py-2 capitalize">{p.estado}</td>
                    {puedeEliminar && (
                      <td className="px-3 py-2 text-right">
                        <button
                          onClick={() => handleEliminarPresupuesto(p.id)}
                          className="text-red-600 hover:text-red-800 text-sm font-medium border border-red-200 rounded px-3 py-1 hover:bg-red-50 transition-colors"
                        >
                          Eliminar
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
                {presupuestosFiltrados.length === 0 && (
                  <tr>
                    <td colSpan={9} className="px-3 py-6 text-center text-gray-400">
                      No se encontraron presupuestos con los filtros aplicados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {vista === "historial" && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Historial de Compras</h2>
            <button
              type="button"
              onClick={() => setMostrarFormOrden((prev) => !prev)}
              className="px-4 py-2 bg-[#378AFE] text-white text-sm font-medium rounded-lg hover:bg-[#0962DE] transition-colors"
            >
              {mostrarFormOrden ? "✕ Cerrar" : "+ Nueva Orden de Compra"}
            </button>
          </div>

          {mostrarFormOrden && (
            <form
              onSubmit={handleSubmitOrden}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">N° de Orden *</label>
                <input
                  type="text"
                  name="numeroOrden"
                  value={ordenForm.numeroOrden}
                  onChange={handleChangeOrden}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Suministro</label>
                <select
                  name="id_suministro"
                  value={ordenForm.id_suministro ?? ""}
                  onChange={handleChangeOrden}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">— Sin suministro asociado —</option>
                  {suministros.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.numeroSuministro || `#${s.id}`}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Proveedor</label>
                <select
                  name="id_proveedor"
                  value={ordenForm.id_proveedor ?? ""}
                  onChange={handleChangeOrden}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">— Sin proveedor asignado —</option>
                  {proveedores.map((p) => (
                    <option key={p.id} value={p.id}>{p.nombre}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Factura</label>
                <select
                  name="tipoFactura"
                  value={ordenForm.tipoFactura ?? ""}
                  onChange={handleChangeOrden}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Seleccionar...</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">N° de Factura</label>
                <input
                  type="text"
                  name="numeroFactura"
                  value={ordenForm.numeroFactura}
                  onChange={handleChangeOrden}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Monto</label>
                <input
                  type="number"
                  name="monto"
                  value={ordenForm.monto ?? ""}
                  onChange={handleChangeOrden}
                  placeholder="$ 0.00"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de entrega</label>
                <input
                  type="date"
                  name="fechaEntrega"
                  value={ordenForm.fechaEntrega}
                  onChange={handleChangeOrden}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                <select
                  name="estado"
                  value={ordenForm.estado}
                  onChange={handleChangeOrden}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="pendiente">Pendiente</option>
                  <option value="entregado">Entregado</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Unidad</label>
                <input
                  type="text"
                  name="unidad"
                  value={ordenForm.unidad}
                  onChange={handleChangeOrden}
                  placeholder="Ingrese la unidad"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="md:col-span-2 lg:col-span-3 flex gap-4 mt-2">
                <button
                  type="submit"
                  disabled={guardandoOrden}
                  className="px-6 py-2 bg-[#378AFE] text-white font-medium rounded-lg hover:bg-[#0962DE] transition-colors disabled:opacity-50"
                >
                  {guardandoOrden ? "Guardando..." : "Registrar Orden de Compra"}
                </button>
              </div>
            </form>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">N° de Orden de Compra</label>
              <input
                type="text"
                placeholder="Ingrese número de orden de compra"
                value={filtroNumOrden}
                onChange={(e) => setFiltroNumOrden(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">N° de Suministro</label>
              <input
                type="text"
                placeholder="Ingrese número de suministro"
                value={filtroNumSuministro}
                onChange={(e) => setFiltroNumSuministro(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Proveedor</label>
              <select
                value={filtroProveedorOrden}
                onChange={(e) => setFiltroProveedorOrden(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todos</option>
                {proveedores.map((p) => (
                  <option key={p.id} value={p.id}>{p.nombre}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Factura</label>
              <select
                value={filtroTipoFactura}
                onChange={(e) => setFiltroTipoFactura(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todas</option>
                <option value="B">B</option>
                <option value="C">C</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
              <select
                value={filtroEstadoOrden}
                onChange={(e) => setFiltroEstadoOrden(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todos</option>
                <option value="pendiente">Pendiente</option>
                <option value="entregado">Entregado</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Unidad</label>
              <input
                type="text"
                placeholder="Ingrese la unidad"
                value={filtroUnidadOrden}
                onChange={(e) => setFiltroUnidadOrden(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="flex gap-4 mt-6 mb-6">
            <button
              type="button"
              onClick={limpiarFiltrosOrdenes}
              className="px-6 py-2 bg-gray-300 text-gray-800 font-medium rounded-lg hover:bg-gray-400 transition-colors"
            >
              Limpiar filtros
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-3 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">N° Orden</th>
                  <th className="px-3 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">Suministro</th>
                  <th className="px-3 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">Proveedor</th>
                  <th className="px-3 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">Factura</th>
                  <th className="px-3 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">Monto</th>
                  <th className="px-3 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">F. Entrega</th>
                  <th className="px-3 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">Estado</th>
                  <th className="px-3 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">Unidad</th>
                  {puedeEliminar && (
                    <th className="px-3 py-3 text-right font-semibold text-gray-600 whitespace-nowrap">Acciones</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {ordenesFiltradas.map((o) => (
                  <tr key={o.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-3 py-2">{o.numeroOrden}</td>
                    <td className="px-3 py-2">{o.suministro?.numeroSuministro || "-"}</td>
                    <td className="px-3 py-2">{nombreProveedor(o.proveedor)}</td>
                    <td className="px-3 py-2">
                      {o.tipoFactura ? `${o.tipoFactura} ${o.numeroFactura || ""}` : "-"}
                    </td>
                    <td className="px-3 py-2">{o.monto != null ? `$${Number(o.monto).toFixed(2)}` : "-"}</td>
                    <td className="px-3 py-2">{o.fechaEntrega || "-"}</td>
                    <td className="px-3 py-2 capitalize">{o.estado}</td>
                    <td className="px-3 py-2">{o.unidad || "-"}</td>
                    {puedeEliminar && (
                      <td className="px-3 py-2 text-right">
                        <button
                          onClick={() => handleEliminarOrden(o.id)}
                          className="text-red-600 hover:text-red-800 text-sm font-medium border border-red-200 rounded px-3 py-1 hover:bg-red-50 transition-colors"
                        >
                          Eliminar
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
                {ordenesFiltradas.length === 0 && (
                  <tr>
                    <td colSpan={9} className="px-3 py-6 text-center text-gray-400">
                      No se encontraron órdenes de compra con los filtros aplicados.
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
