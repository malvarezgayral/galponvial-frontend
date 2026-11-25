import { useEffect, useState } from "react";
import { useAdminPermissions } from "../../usuarios/hooks/useAdminPermissions";
import {
  lubricanteEntradaService,
  type LubricanteTipoItem,
} from "../services/lubricanteEntradaService";

const thCls = "px-3 py-3 text-left font-semibold text-gray-600";
const inputCls =
  "w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";

/** Usa el mensaje del back si viene (por ejemplo, "Ya existe el tipo ..."). */
const mensajeError = (err: unknown, porDefecto: string): string => {
  const msg = (err as { response?: { data?: { message?: unknown } } })?.response?.data?.message;
  if (Array.isArray(msg)) return msg.join("\n");
  if (typeof msg === "string" && msg.trim() !== "") return msg;
  return porDefecto;
};

/** "  15  W 40 " pasa a "15 W 40", igual que en el back. */
const normalizar = (s: string) => s.trim().replace(/\s+/g, " ");

/** "3 cargas · 1 salida", o "" si no se usa. */
const textoUso = (t: LubricanteTipoItem): string => {
  const partes: string[] = [];
  if (t.usoCargas > 0) partes.push(`${t.usoCargas} ${t.usoCargas === 1 ? "carga" : "cargas"}`);
  if (t.usoSalidas > 0) partes.push(`${t.usoSalidas} ${t.usoSalidas === 1 ? "salida" : "salidas"}`);
  return partes.join(" · ");
};

interface Props {
  onCantidad?: (n: number) => void;
}

export default function TiposLubricantePanel({ onCantidad }: Props) {
  const { isSuperAdmin } = useAdminPermissions();
  const esSuper = isSuperAdmin();
  const [tipos, setTipos] = useState<LubricanteTipoItem[]>([]);
  const [cargando, setCargando] = useState(true);
  const [nuevo, setNuevo] = useState("");
  const [agregando, setAgregando] = useState(false);
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [borrador, setBorrador] = useState("");
  const [guardando, setGuardando] = useState(false);

  const recargar = async () => {
    const lista = await lubricanteEntradaService.obtenerTiposDetalle();
    setTipos(lista);
    onCantidad?.(lista.length);
  };

  useEffect(() => {
    recargar()
      .catch((err) => {
        console.error("Error al cargar los tipos de lubricante:", err);
        alert("No se pudo cargar la lista de tipos de lubricante.");
      })
      .finally(() => setCargando(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const agregar = async () => {
    const nombre = normalizar(nuevo);
    if (nombre === "") return alert("Escribí el nombre del lubricante.");
    try {
      setAgregando(true);
      await lubricanteEntradaService.crearTipo(nombre);
      setNuevo("");
      await recargar();
    } catch (err) {
      console.error("Error al agregar el tipo de lubricante:", err);
      alert(mensajeError(err, "No se pudo agregar el tipo de lubricante."));
    } finally {
      setAgregando(false);
    }
  };

  const empezarEdicion = (t: LubricanteTipoItem) => {
    setEditandoId(t.id);
    setBorrador(t.nombre);
  };

  const cancelar = () => {
    setEditandoId(null);
    setBorrador("");
  };

  const guardar = async (t: LubricanteTipoItem) => {
    const nombre = normalizar(borrador);
    if (nombre === "") return alert("El nombre no puede quedar vacío.");
    if (nombre === t.nombre) return cancelar();
    const uso = textoUso(t);
    if (uso !== "") {
      const ok = window.confirm(
        `Vas a cambiar "${t.nombre}" por "${nombre}".\nTambién se cambia en ${uso}.\n¿Seguimos?`,
      );
      if (!ok) return;
    }
    try {
      setGuardando(true);
      await lubricanteEntradaService.actualizarTipo(t.id, nombre);
      await recargar();
      cancelar();
    } catch (err) {
      console.error("Error al editar el tipo de lubricante:", err);
      alert(mensajeError(err, "No se pudo guardar el cambio."));
    } finally {
      setGuardando(false);
    }
  };

  const eliminar = async (t: LubricanteTipoItem) => {
    if (!t.puedeEliminar) {
      alert(`No se puede eliminar "${t.nombre}" porque lo usan ${textoUso(t)}.`);
      return;
    }
    const ok = window.confirm(`¿Eliminar "${t.nombre}" de la lista de lubricantes?\nNo se puede deshacer.`);
    if (!ok) return;
    try {
      await lubricanteEntradaService.eliminarTipo(t.id);
      if (editandoId === t.id) cancelar();
      await recargar();
    } catch (err) {
      console.error("Error al eliminar el tipo de lubricante:", err);
      alert(mensajeError(err, "No se pudo eliminar el tipo de lubricante."));
    }
  };

  if (cargando) return <p className="text-sm text-gray-500">Cargando tipos de lubricante...</p>;

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <input
          type="text"
          maxLength={100}
          placeholder="Nombre del lubricante nuevo"
          value={nuevo}
          onChange={(e) => setNuevo(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") agregar();
          }}
          className={`${inputCls} max-w-xs`}
        />
        <button
          type="button"
          onClick={agregar}
          disabled={agregando}
          className="px-4 py-1.5 text-sm font-medium text-white bg-[#0062e3] rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {agregando ? "Agregando..." : "Agregar tipo"}
        </button>
        <span className="text-xs text-gray-500">Se ordena solo, alfabéticamente.</span>
      </div>

      <div className="bg-white rounded-xl shadow border border-gray-200 overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className={thCls}>Lubricante</th>
              <th className={thCls}>En uso</th>
              <th className={thCls}>Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {tipos.length === 0 && (
              <tr>
                <td colSpan={3} className="px-3 py-6 text-center text-gray-500">
                  Todavía no hay tipos de lubricante. Agregá el primero arriba.
                </td>
              </tr>
            )}
            {tipos.map((t) =>
              editandoId === t.id ? (
                <tr key={t.id} className="bg-blue-50">
                  <td className="px-3 py-2">
                    <input
                      type="text"
                      maxLength={100}
                      value={borrador}
                      autoFocus
                      onChange={(e) => setBorrador(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") guardar(t);
                        if (e.key === "Escape") cancelar();
                      }}
                      className={`${inputCls} max-w-xs`}
                    />
                  </td>
                  <td className="px-3 py-2">{textoUso(t) || <span className="text-gray-400">—</span>}</td>
                  <td className="px-3 py-2">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => guardar(t)}
                        disabled={guardando}
                        className="px-3 py-1 text-xs font-medium text-white bg-[#0062e3] rounded hover:bg-blue-700 disabled:opacity-50"
                      >
                        {guardando ? "Guardando..." : "Guardar"}
                      </button>
                      <button
                        type="button"
                        onClick={cancelar}
                        disabled={guardando}
                        className="px-3 py-1 text-xs font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded hover:bg-gray-200"
                      >
                        Cancelar
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-3 py-2">{t.nombre}</td>
                  <td className="px-3 py-2">{textoUso(t) || <span className="text-gray-400">—</span>}</td>
                  <td className="px-3 py-2">
                    <div className="flex gap-2">
                      {t.puedeEditar && (
                        <button
                          type="button"
                          onClick={() => empezarEdicion(t)}
                          disabled={editandoId !== null}
                          className="px-3 py-1 text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded hover:bg-blue-100 disabled:opacity-50"
                        >
                          Editar
                        </button>
                      )}
                      {esSuper && (
                        <button
                          type="button"
                          onClick={() => eliminar(t)}
                          title={t.puedeEliminar ? undefined : `Lo usan ${textoUso(t)}`}
                          className={
                            t.puedeEliminar
                              ? "px-3 py-1 text-xs font-medium text-red-700 bg-red-50 border border-red-200 rounded hover:bg-red-100"
                              : "px-3 py-1 text-xs font-medium text-gray-400 bg-gray-100 border border-gray-200 rounded cursor-not-allowed"
                          }
                        >
                          Eliminar
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ),
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
