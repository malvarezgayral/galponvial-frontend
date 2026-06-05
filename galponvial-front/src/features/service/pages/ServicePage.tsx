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
});

const SI_NO = ["SI", "NO"];

export default function ServicePage() {
  const [filas, setFilas] = useState<FilaService[]>([
    { id: 1, ...filaVacia() },
  ]);

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

  return (
    <div className="space-y-6">
      {/* Título */}
      <h1 className="text-3xl font-bold text-gray-800">Service</h1>

      {/* Header */}
      <div className="mb-6 flex items-center gap-4">
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow transition-colors">
          Registro de Service
        </button>
      </div>

      {/* Tabla */}
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
              <th className="px-3 py-3 text-center font-semibold text-gray-600 whitespace-nowrap">Eliminar</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filas.map((fila) => (
              <tr key={fila.id} className="hover:bg-gray-50 transition-colors">
                {/* Vehículo */}
                <td className="px-3 py-2">
                  <input
                    type="text"
                    placeholder="Ingrese vehículo"
                    value={fila.vehiculo}
                    onChange={(e) => actualizarFila(fila.id, "vehiculo", e.target.value)}
                    className="border border-gray-300 rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-36"
                  />
                </td>

                {/* Fecha */}
                <td className="px-3 py-2">
                  <input
                    type="date"
                    value={fila.fecha}
                    onChange={(e) => actualizarFila(fila.id, "fecha", e.target.value)}
                    className="border border-gray-300 rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-36"
                  />
                </td>

                {/* SI/NO columns */}
                <td className="px-3 py-2">{selectSiNo(fila.id, "aceiteMotor", fila.aceiteMotor)}</td>
                <td className="px-3 py-2">{selectSiNo(fila.id, "aceiteCaja", fila.aceiteCaja)}</td>
                <td className="px-3 py-2">{selectSiNo(fila.id, "aceiteDiferencial", fila.aceiteDiferencial)}</td>
                <td className="px-3 py-2">{selectSiNo(fila.id, "aceiteTransmision", fila.aceiteTransmision)}</td>
                <td className="px-3 py-2">{selectSiNo(fila.id, "filtroMotorAceite", fila.filtroMotorAceite)}</td>
                <td className="px-3 py-2">{selectSiNo(fila.id, "filtroAire", fila.filtroAire)}</td>
                <td className="px-3 py-2">{selectSiNo(fila.id, "filtroGasoil", fila.filtroGasoil)}</td>
                <td className="px-3 py-2">{selectSiNo(fila.id, "filtroTransmision", fila.filtroTransmision)}</td>

                {/* Eliminar */}
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
    </div>
  );
}
