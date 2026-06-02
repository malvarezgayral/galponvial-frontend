import { useState } from "react";

interface FilaCombustible {
  id: number;
  fecha: string;
  vehiculo: string;
  agente: string;
  comprobante: string;
  ingreso: number;
  egreso: number;
  stock: number;
  direccion: string;
  observaciones: string;
}
interface FilaLubricante {
  id: number;
  fecha: string;
  ordenRetiro: string;
  unidad: string;
  cantidad: number;
  tipo: string;
  observaciones: string;
}

const filaVacia = (): Omit<FilaCombustible, "id" | "stock"> => ({
  fecha: "",
  vehiculo: "",
  agente: "",
  comprobante: "",
  ingreso: 0,
  egreso: 0,
  direccion: "",
  observaciones: "",
});

const filaLubricanteVacia = (): Omit<FilaLubricante, "id"> => ({
  fecha: "",
  ordenRetiro: "",
  unidad: "",
  cantidad: 0,
  tipo: "",
  observaciones: "",
});

// Opciones placeholder — reemplazar con datos reales cuando estén disponibles
const AGENTES: string[] = [];
const DIRECCIONES: string[] = [];
type Vista = "combustible" | "lubricantes";

export default function DepoCombustiblePage() {
  const [filas, setFilas] = useState<FilaCombustible[]>([
    { id: 1, ...filaVacia(), stock: 0 },
  ]);

  const [filasLubricantes, setFilasLubricantes] = useState<FilaLubricante[]>([
  { id: 1, ...filaLubricanteVacia() },
]);
  const [vista, setVista] = useState<Vista>("combustible");

  const actualizarFila = (
    id: number,
    campo: keyof Omit<FilaCombustible, "id" | "stock">,
    valor: string | number,
  ) => {
    setFilas((prev) =>
      prev.map((fila) => {
        if (fila.id !== id) return fila;
        const actualizada = { ...fila, [campo]: valor };
        actualizada.stock = actualizada.ingreso - actualizada.egreso;
        return actualizada;
      }),
    );
  };

  const actualizarFilaLubricante = (
  id: number,
  campo: keyof Omit<FilaLubricante, "id">,
  valor: string | number,
) => {
  setFilasLubricantes((prev) =>
    prev.map((fila) =>
      fila.id === id
        ? { ...fila, [campo]: valor }
        : fila
    ),
  );
};

  const incrementar = (id: number, campo: "ingreso" | "egreso") => {
    setFilas((prev) =>
      prev.map((fila) => {
        if (fila.id !== id) return fila;
        const actualizada = { ...fila, [campo]: fila[campo] + 1 };
        actualizada.stock = actualizada.ingreso - actualizada.egreso;
        return actualizada;
      }),
    );
  };

  const decrementar = (id: number, campo: "ingreso" | "egreso") => {
    setFilas((prev) =>
      prev.map((fila) => {
        if (fila.id !== id) return fila;
        const nuevoValor = Math.max(0, fila[campo] - 1);
        const actualizada = { ...fila, [campo]: nuevoValor };
        actualizada.stock = actualizada.ingreso - actualizada.egreso;
        return actualizada;
      }),
    );
  };

  const agregarFila = () => {
    const nuevoId = filas.length > 0 ? Math.max(...filas.map((f) => f.id)) + 1 : 1;
    setFilas((prev) => [...prev, { id: nuevoId, ...filaVacia(), stock: 0 }]);
  };

  const agregarFilaLubricante = () => {
  const nuevoId =
    filasLubricantes.length > 0
      ? Math.max(...filasLubricantes.map((f) => f.id)) + 1
      : 1;

  setFilasLubricantes((prev) => [
    ...prev,
    {
      id: nuevoId,
      ...filaLubricanteVacia(),
    },
  ]);
};

  const eliminarFila = (id: number) => {
    if (filas.length === 1) return;
    setFilas((prev) => prev.filter((f) => f.id !== id));
  };
  const eliminarFilaLubricante = (id: number) => {
  if (filasLubricantes.length === 1) return;

  setFilasLubricantes((prev) =>
    prev.filter((fila) => fila.id !== id),
  );
};

  return (
    <div className="space-y-6">
      {/* Header */}
      {/* Header */}
{/* Header */}
<div className="mb-6">
  <h1 className="text-3xl font-bold text-gray-900">
    Depósito
  </h1>

  <div className="flex gap-3 mt-4">
    <button
      onClick={() => setVista("combustible")}
      className={`px-5 py-2 rounded-lg text-white font-medium transition-colors ${
        vista === "combustible"
          ? "bg-[#0062e3]"
          : "bg-gray-400 hover:bg-gray-500"
      }`}
    >
      Combustible
    </button>

    <button
      onClick={() => setVista("lubricantes")}
      className={`px-5 py-2 rounded-lg text-white font-medium transition-colors ${
        vista === "lubricantes"
          ? "bg-[#0062e3]"
          : "bg-gray-400 hover:bg-gray-500"
      }`}
    >
      Lubricantes
    </button>
  </div>
</div>
{vista === "combustible" && (
  <>

      {/* Tabla */}
      <div className="bg-white rounded-xl shadow border border-gray-200 overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-3 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">
                Fecha
              </th>
              <th className="px-3 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">
                Vehículo
              </th>
              <th className="px-3 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">
                Agente
              </th>
              <th className="px-3 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">
                Comprobante
              </th>
              <th className="px-3 py-3 text-center font-semibold text-gray-600 whitespace-nowrap">
                Ingreso Cant.
              </th>
              <th className="px-3 py-3 text-center font-semibold text-gray-600 whitespace-nowrap">
                Egreso Cant.
              </th>
              <th className="px-3 py-3 text-center font-semibold text-gray-600 whitespace-nowrap">
                Stock
              </th>
              <th className="px-3 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">
                Dirección
              </th>
              <th className="px-3 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">
                Observaciones
              </th>
              <th className="px-3 py-3 text-center font-semibold text-gray-600 whitespace-nowrap">
                Eliminar Registro
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filas.map((fila) => (
              <tr key={fila.id} className="hover:bg-gray-50 transition-colors">
                {/* Fecha */}
                <td className="px-3 py-2">
                  <input
                    type="date"
                    value={fila.fecha}
                    onChange={(e) => actualizarFila(fila.id, "fecha", e.target.value)}
                    className="border border-gray-300 rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-36"
                  />
                </td>

                {/* Vehículo */}
                <td className="px-3 py-2">
                  <input
                    type="text"
                    placeholder="Patente / N°"
                    value={fila.vehiculo}
                    onChange={(e) => actualizarFila(fila.id, "vehiculo", e.target.value)}
                    className="border border-gray-300 rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-32"
                  />
                </td>

                {/* Agente */}
                <td className="px-3 py-2">
                  <select
                    value={fila.agente}
                    onChange={(e) => actualizarFila(fila.id, "agente", e.target.value)}
                    className="border border-gray-300 rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-40 text-gray-500"
                  >
                    <option value="">— Seleccionar —</option>
                    {AGENTES.map((a) => (
                      <option key={a} value={a}>
                        {a}
                      </option>
                    ))}
                  </select>
                </td>

                {/* Comprobante */}
                <td className="px-3 py-2">
                  <input
                    type="text"
                    placeholder="Nro. comprobante"
                    value={fila.comprobante}
                    onChange={(e) =>
                      actualizarFila(fila.id, "comprobante", e.target.value)
                    }
                    className="border border-gray-300 rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-36"
                  />
                </td>

                {/* Ingreso cantidad */}
                <td className="px-3 py-2">
                  <div className="flex items-center justify-center gap-1">
                    <button
                      onClick={() => decrementar(fila.id, "ingreso")}
                      className="w-7 h-7 rounded-md bg-gray-200 hover:bg-gray-300 font-bold text-gray-700 flex items-center justify-center transition-colors"
                    >
                      −
                    </button>
                    <input
                      type="number"
                      min={0}
                      value={fila.ingreso}
                      onChange={(e) =>
                        actualizarFila(fila.id, "ingreso", Math.max(0, Number(e.target.value)))
                      }
                      className="border border-gray-300 rounded-md px-2 py-1.5 text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-500 w-16"
                    />
                    <button
                      onClick={() => incrementar(fila.id, "ingreso")}
                      className="w-7 h-7 rounded-md bg-blue-100 hover:bg-blue-200 font-bold text-blue-700 flex items-center justify-center transition-colors"
                    >
                      +
                    </button>
                  </div>
                </td>

                {/* Egreso cantidad */}
                <td className="px-3 py-2">
                  <div className="flex items-center justify-center gap-1">
                    <button
                      onClick={() => decrementar(fila.id, "egreso")}
                      className="w-7 h-7 rounded-md bg-gray-200 hover:bg-gray-300 font-bold text-gray-700 flex items-center justify-center transition-colors"
                    >
                      −
                    </button>
                    <input
                      type="number"
                      min={0}
                      value={fila.egreso}
                      onChange={(e) =>
                        actualizarFila(fila.id, "egreso", Math.max(0, Number(e.target.value)))
                      }
                      className="border border-gray-300 rounded-md px-2 py-1.5 text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-500 w-16"
                    />
                    <button
                      onClick={() => incrementar(fila.id, "egreso")}
                      className="w-7 h-7 rounded-md bg-red-100 hover:bg-red-200 font-bold text-red-700 flex items-center justify-center transition-colors"
                    >
                      +
                    </button>
                  </div>
                </td>

                {/* Stock (calculado) */}
                <td className="px-3 py-2 text-center">
                  <span
                    className={`inline-block px-3 py-1.5 rounded-md font-semibold text-sm min-w-[3rem] ${
                      fila.stock > 0
                        ? "bg-green-100 text-green-700"
                        : fila.stock < 0
                        ? "bg-red-100 text-red-700"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {fila.stock}
                  </span>
                </td>

                {/* Dirección */}
                <td className="px-3 py-2">
                  <select
                    value={fila.direccion}
                    onChange={(e) => actualizarFila(fila.id, "direccion", e.target.value)}
                    className="border border-gray-300 rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-40 text-gray-500"
                  >
                    <option value="">— Seleccionar —</option>
                    {DIRECCIONES.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </td>

                {/* Observaciones */}
                <td className="px-3 py-2">
                  <textarea
                    placeholder="Observaciones..."
                    value={fila.observaciones}
                    onChange={(e) =>
                      actualizarFila(fila.id, "observaciones", e.target.value)
                    }
                    rows={1}
                    className="border border-gray-300 rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-48 resize-y min-h-[36px]"
                  />
                </td>

                {/* Eliminar fila */}
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

      {/* Botón agregar fila */}
      <button
        onClick={agregarFila}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow transition-colors"
      >
        <span className="text-lg leading-none">+</span> Agregar Registro
      </button>
        </>
)}
{vista === "lubricantes" && (
  <div className="bg-white rounded-xl shadow border border-gray-200 overflow-x-auto">
    <table className="min-w-full text-sm">
      <thead>
        <tr className="bg-gray-50 border-b border-gray-200">
          <th className="px-3 py-3 text-left font-semibold text-gray-600">
            Fecha
          </th>

          <th className="px-3 py-3 text-left font-semibold text-gray-600">
            N° Orden de Retiro
          </th>

          <th className="px-3 py-3 text-left font-semibold text-gray-600">
            Unidad
          </th>

          <th className="px-3 py-3 text-left font-semibold text-gray-600">
            Cantidad
          </th>

          <th className="px-3 py-3 text-left font-semibold text-gray-600">
            Tipo
          </th>

          <th className="px-3 py-3 text-left font-semibold text-gray-600">
            Observaciones
          </th>

          <th className="px-3 py-3 text-center font-semibold text-gray-600">
            Eliminar
          </th>
        </tr>
      </thead>

     <tbody className="divide-y divide-gray-100">
  {filasLubricantes.map((fila) => (
    <tr key={fila.id} className="hover:bg-gray-50 transition-colors">

      {/* Fecha */}
      <td className="px-3 py-2">
        <input
          type="date"
          value={fila.fecha}
          onChange={(e) =>
            actualizarFilaLubricante(
              fila.id,
              "fecha",
              e.target.value
            )
          }
          className="border border-gray-300 rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-36"
        />
      </td>

      {/* N° Orden de Retiro */}
<td className="px-3 py-2">
  <input
    type="text"
    placeholder="N° Orden"
    value={fila.ordenRetiro}
    onChange={(e) =>
      actualizarFilaLubricante(
        fila.id,
        "ordenRetiro",
        e.target.value
      )
    }
    className="border border-gray-300 rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-36"
  />
</td>

{/* Unidad */}
<td className="px-3 py-2">
  <input
    type="text"
    placeholder="Unidad"
    value={fila.unidad}
    onChange={(e) =>
      actualizarFilaLubricante(
        fila.id,
        "unidad",
        e.target.value
      )
    }
    className="border border-gray-300 rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-40"
  />
</td>

{/* Cantidad */}
<td className="px-3 py-2">
  <input
    type="number"
    min={0}
    value={fila.cantidad}
    onChange={(e) =>
      actualizarFilaLubricante(
        fila.id,
        "cantidad",
        Math.max(0, Number(e.target.value))
      )
    }
    className="border border-gray-300 rounded-md px-2 py-1.5 text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-500 w-24"
  />
</td>

{/* Tipo */}
<td className="px-3 py-2">
  <input
    type="text"
    placeholder="Tipo de lubricante"
    value={fila.tipo}
    onChange={(e) =>
      actualizarFilaLubricante(
        fila.id,
        "tipo",
        e.target.value
      )
    }
    className="border border-gray-300 rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-40"
  />
</td>

{/* Observaciones */}
<td className="px-3 py-2">
  <textarea
    placeholder="Observaciones..."
    value={fila.observaciones}
    onChange={(e) =>
      actualizarFilaLubricante(
        fila.id,
        "observaciones",
        e.target.value
      )
    }
    rows={1}
    className="border border-gray-300 rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-48 resize-y min-h-[36px]"
  />
</td>

{/* Eliminar */}
<td className="px-3 py-2 text-center">
  <button
    onClick={() => eliminarFilaLubricante(fila.id)}
    disabled={filasLubricantes.length === 1}
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

<div className="p-4">
  <button
    onClick={agregarFilaLubricante}
    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow transition-colors"
  >
    <span className="text-lg leading-none">+</span>
    Agregar Registro
  </button>
</div>

</div>
)}
    </div>
  );
}