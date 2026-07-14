import { useMemo, useState } from "react";

interface FilaLubricante {
  id: number;
  fecha: string;
  ordenRetiro: string;
  unidad: string;
  cantidad: number;
  tipo: string;
  observaciones: string;
}

const filaLubricanteVacia = (): Omit<FilaLubricante, "id"> => ({
  fecha: "",
  ordenRetiro: "",
  unidad: "",
  cantidad: 0,
  tipo: "",
  observaciones: "",
});

interface FiltrosHistorial {
  periodoDesde: string;
  periodoHasta: string;
  ordenRetiro: string;
  unidad: string;
  cantidad: string;
  tipo: string;
}

const filtrosVacios: FiltrosHistorial = {
  periodoDesde: "",
  periodoHasta: "",
  ordenRetiro: "",
  unidad: "",
  cantidad: "",
  tipo: "",
};

type Vista =
  | "historial-combustible"
  | "lubricantes"
  | "historial-lubricantes";

export default function DepoCombustiblePage() {
  const [filasLubricantes, setFilasLubricantes] = useState<FilaLubricante[]>([
    { id: 1, ...filaLubricanteVacia() },
  ]);
  const [vista, setVista] = useState<Vista>("lubricantes");
  const [filtros, setFiltros] = useState<FiltrosHistorial>(filtrosVacios);
  const [filtrosAplicados, setFiltrosAplicados] =
    useState<FiltrosHistorial>(filtrosVacios);

  const actualizarFilaLubricante = (
    id: number,
    campo: keyof Omit<FilaLubricante, "id">,
    valor: string | number,
  ) => {
    setFilasLubricantes((prev) =>
      prev.map((fila) =>
        fila.id === id ? { ...fila, [campo]: valor } : fila
      ),
    );
  };

  const agregarFilaLubricante = () => {
    const nuevoId =
      filasLubricantes.length > 0
        ? Math.max(...filasLubricantes.map((f) => f.id)) + 1
        : 1;
    setFilasLubricantes((prev) => [
      ...prev,
      { id: nuevoId, ...filaLubricanteVacia() },
    ]);
  };

  const eliminarFilaLubricante = (id: number) => {
    if (filasLubricantes.length === 1) return;
    setFilasLubricantes((prev) => prev.filter((fila) => fila.id !== id));
  };

  const actualizarFiltro = (
    campo: keyof FiltrosHistorial,
    valor: string,
  ) => {
    setFiltros((prev) => ({ ...prev, [campo]: valor }));
  };

  const buscarHistorial = () => {
    setFiltrosAplicados(filtros);
  };

  const limpiarFiltros = () => {
    setFiltros(filtrosVacios);
    setFiltrosAplicados(filtrosVacios);
  };

  const registrosGuardados = useMemo(
    () =>
      filasLubricantes.filter(
        (fila) =>
          fila.fecha !== "" ||
          fila.ordenRetiro !== "" ||
          fila.unidad !== "" ||
          fila.tipo !== "" ||
          fila.observaciones !== "" ||
          fila.cantidad > 0,
      ),
    [filasLubricantes],
  );

  const historialFiltrado = useMemo(() => {
    return registrosGuardados.filter((fila) => {
      if (
        filtrosAplicados.periodoDesde &&
        fila.fecha &&
        fila.fecha < filtrosAplicados.periodoDesde
      ) {
        return false;
      }
      if (
        filtrosAplicados.periodoHasta &&
        fila.fecha &&
        fila.fecha > filtrosAplicados.periodoHasta
      ) {
        return false;
      }
      if (
        filtrosAplicados.ordenRetiro &&
        !fila.ordenRetiro
          .toLowerCase()
          .includes(filtrosAplicados.ordenRetiro.toLowerCase())
      ) {
        return false;
      }
      if (
        filtrosAplicados.unidad &&
        !fila.unidad.toLowerCase().includes(filtrosAplicados.unidad.toLowerCase())
      ) {
        return false;
      }
      if (
        filtrosAplicados.cantidad !== "" &&
        fila.cantidad !== Number(filtrosAplicados.cantidad)
      ) {
        return false;
      }
      if (
        filtrosAplicados.tipo &&
        !fila.tipo.toLowerCase().includes(filtrosAplicados.tipo.toLowerCase())
      ) {
        return false;
      }
      return true;
    });
  }, [registrosGuardados, filtrosAplicados]);

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Lubricentro</h1>

        <div className="flex flex-wrap gap-3 mt-4">

          <button
            onClick={() => setVista("lubricantes")}
            className={`px-5 py-2 rounded-lg text-white font-medium transition-colors ${
              vista === "lubricantes" ? "bg-[#0062e3]" : "bg-gray-400 hover:bg-gray-500"
            }`}
          >
            Lubricantes
          </button>

          <button
            onClick={() => setVista("historial-lubricantes")}
            className={`px-5 py-2 rounded-lg text-white font-medium transition-colors ${
              vista === "historial-lubricantes" ? "bg-[#0062e3]" : "bg-gray-400 hover:bg-gray-500"
            }`}
          >
            Historial Lubricantes
          </button>
        </div>
      </div>


      {vista === "lubricantes" && (
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
                <th className="px-3 py-3 text-center font-semibold text-gray-600">Eliminar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filasLubricantes.map((fila) => (
                <tr key={fila.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-3 py-2">
                    <input
                      type="date"
                      value={fila.fecha}
                      onChange={(e) => actualizarFilaLubricante(fila.id, "fecha", e.target.value)}
                      className="border border-gray-300 rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-36"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="text"
                      placeholder="N° Orden"
                      value={fila.ordenRetiro}
                      onChange={(e) => actualizarFilaLubricante(fila.id, "ordenRetiro", e.target.value)}
                      className="border border-gray-300 rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-36"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="text"
                      placeholder="Unidad"
                      value={fila.unidad}
                      onChange={(e) => actualizarFilaLubricante(fila.id, "unidad", e.target.value)}
                      className="border border-gray-300 rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-40"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="number"
                      min={0}
                      value={fila.cantidad}
                      onChange={(e) => actualizarFilaLubricante(fila.id, "cantidad", Math.max(0, Number(e.target.value)))}
                      className="border border-gray-300 rounded-md px-2 py-1.5 text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-500 w-24"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="text"
                      placeholder="Tipo de lubricante"
                      value={fila.tipo}
                      onChange={(e) => actualizarFilaLubricante(fila.id, "tipo", e.target.value)}
                      className="border border-gray-300 rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-40"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <textarea
                      placeholder="Observaciones..."
                      value={fila.observaciones}
                      onChange={(e) => actualizarFilaLubricante(fila.id, "observaciones", e.target.value)}
                      rows={1}
                      className="border border-gray-300 rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-48 resize-y min-h-[36px]"
                    />
                  </td>
                  <td className="px-3 py-2 text-center">
                    <button
                      onClick={() => eliminarFilaLubricante(fila.id)}
                      disabled={filasLubricantes.length === 1}
                      title="Eliminar fila"
                      className="w-7 h-7 rounded-md bg-red-100 hover:bg-red-200 text-red-600 flex items-center justify-center mx-auto transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    >✕</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="p-4">
            <button
              onClick={agregarFilaLubricante}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow transition-colors"
            >
              <span className="text-lg leading-none">+</span> Agregar Registro
            </button>
          </div>
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
                  value={filtros.periodoDesde}
                  max={filtros.periodoHasta || undefined}
                  onChange={(e) => actualizarFiltro("periodoDesde", e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-40"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-500">Periodo hasta</label>
                <input
                  type="date"
                  value={filtros.periodoHasta}
                  min={filtros.periodoDesde || undefined}
                  onChange={(e) => actualizarFiltro("periodoHasta", e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-40"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-500">N° Orden de Retiro</label>
                <input
                  type="text"
                  placeholder="Buscar por N° orden"
                  value={filtros.ordenRetiro}
                  onChange={(e) => actualizarFiltro("ordenRetiro", e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-44"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-500">Unidad</label>
                <input
                  type="text"
                  placeholder="Buscar por unidad"
                  value={filtros.unidad}
                  onChange={(e) => actualizarFiltro("unidad", e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-48"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-500">Cantidad</label>
                <input
                  type="number"
                  placeholder="Ej: 5"
                  value={filtros.cantidad}
                  onChange={(e) => actualizarFiltro("cantidad", e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-28"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-500">Tipo</label>
                <input
                  type="text"
                  placeholder="Tipo de lubricante"
                  value={filtros.tipo}
                  onChange={(e) => actualizarFiltro("tipo", e.target.value)}
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
              <tbody className="divide-y divide-gray-100">
                {historialFiltrado.map((fila) => (
                  <tr key={fila.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-3 py-2">{fila.fecha || "-"}</td>
                    <td className="px-3 py-2">{fila.ordenRetiro || "-"}</td>
                    <td className="px-3 py-2">{fila.unidad || "-"}</td>
                    <td className="px-3 py-2">{fila.cantidad}</td>
                    <td className="px-3 py-2">{fila.tipo || "-"}</td>
                    <td className="px-3 py-2">{fila.observaciones || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
