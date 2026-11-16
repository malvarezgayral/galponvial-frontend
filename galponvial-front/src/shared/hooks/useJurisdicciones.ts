import { useEffect, useState } from 'react';
import {
  jurisdiccionesService,
  type JurisdiccionConDependencias,
} from '@/services/jurisdiccionesService';

export {
  dependenciasPorId,
  dependenciasPorNombre,
} from '@/services/jurisdiccionesService';

// Se piden una sola vez por sesión del navegador y se comparten entre pantallas
let cache: JurisdiccionConDependencias[] | null = null;
let pendiente: Promise<JurisdiccionConDependencias[]> | null = null;

export function useJurisdicciones() {
  const [jurisdicciones, setJurisdicciones] = useState<JurisdiccionConDependencias[]>(
    cache ?? [],
  );
  const [loading, setLoading] = useState(cache === null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (cache) return;
    let activo = true;
    if (!pendiente) pendiente = jurisdiccionesService.getAll();
    pendiente
      .then((lista) => {
        cache = lista;
        if (activo) setJurisdicciones(lista);
      })
      .catch((err) => {
        pendiente = null;
        if (activo)
          setError(err instanceof Error ? err.message : 'Error al cargar jurisdicciones');
      })
      .finally(() => {
        if (activo) setLoading(false);
      });
    return () => {
      activo = false;
    };
  }, []);

  return { jurisdicciones, loading, error };
}
