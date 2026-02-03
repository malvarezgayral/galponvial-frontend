import { useAlmacenStore } from '../store';
import type { Articulo } from '../types';

jest.mock('../services/almacenService');

describe('AlmacenStore - Filters', () => {
  beforeEach(() => {
    // Limpiar el store antes de cada test
    const store = useAlmacenStore.getState();
    store.resetFilters();
  });

  const mockArticulos: Articulo[] = [
    {
      cod: 1,
      cod_proveedor: 'PROV001',
      nombre: 'Tornillo M6',
      modelo: 'M6',
      descripcion: 'Tornillo de acero',
      unidad_tipo: 'pieza',
      stock: 100,
      grupo_id: 1,
    },
    {
      cod: 2,
      cod_proveedor: 'PROV002',
      nombre: 'Tubo PVC',
      modelo: 'PVC-50',
      descripcion: 'Tubo de PVC',
      unidad_tipo: 'metro',
      stock: 50,
      grupo_id: 2,
    },
    {
      cod: 3,
      cod_proveedor: 'PROV003',
      nombre: 'Pintura blanca',
      modelo: 'BL-001',
      descripcion: 'Pintura blanca brillante',
      unidad_tipo: 'litro',
      stock: 25,
      grupo_id: 1,
    },
  ];

  it('should filter by search term (nombre)', () => {
    const store = useAlmacenStore.getState();
    store.setArticulos(mockArticulos);
    store.setFilter('searchTerm', 'tornillo');

    const filtered = useAlmacenStore.getState().filteredArticulos;
    expect(filtered).toHaveLength(1);
    expect(filtered[0].nombre).toBe('Tornillo M6');
  });

  it('should filter by search term (modelo)', () => {
    const store = useAlmacenStore.getState();
    store.setArticulos(mockArticulos);
    store.setFilter('searchTerm', 'PVC');

    const filtered = useAlmacenStore.getState().filteredArticulos;
    expect(filtered).toHaveLength(1);
    expect(filtered[0].nombre).toBe('Tubo PVC');
  });

  it('should filter by search term (codigo)', () => {
    const store = useAlmacenStore.getState();
    store.setArticulos(mockArticulos);
    store.setFilter('searchTerm', '2');

    const filtered = useAlmacenStore.getState().filteredArticulos;
    expect(filtered).toHaveLength(1);
    expect(filtered[0].cod).toBe(2);
  });

  it('should filter by unidad_tipo', () => {
    const store = useAlmacenStore.getState();
    store.setArticulos(mockArticulos);
    store.setFilter('unidad_tipo', 'pieza');

    const filtered = useAlmacenStore.getState().filteredArticulos;
    expect(filtered).toHaveLength(1);
    expect(filtered[0].unidad_tipo).toBe('pieza');
  });

  it('should filter by grupo', () => {
    const store = useAlmacenStore.getState();
    store.setArticulos(mockArticulos);
    store.setFilter('grupo', '1');

    const filtered = useAlmacenStore.getState().filteredArticulos;
    expect(filtered).toHaveLength(2);
    expect(filtered.every((a) => a.grupo_id === 1)).toBe(true);
  });

  it('should filter by stock range', () => {
    const store = useAlmacenStore.getState();
    store.setArticulos(mockArticulos);
    store.setFilter('stockRange', { min: 30, max: 100 });

    const filtered = useAlmacenStore.getState().filteredArticulos;
    expect(filtered).toHaveLength(2);
    expect(filtered.every((a) => a.stock !== undefined && a.stock >= 30 && a.stock <= 100)).toBe(true);
  });

  it('should apply multiple filters together', () => {
    const store = useAlmacenStore.getState();
    store.setArticulos(mockArticulos);
    store.setFilter('unidad_tipo', 'litro');
    store.setFilter('stockRange', { min: 20, max: 30 });

    const filtered = useAlmacenStore.getState().filteredArticulos;
    expect(filtered).toHaveLength(1);
    expect(filtered[0].nombre).toBe('Pintura blanca');
  });

  it('should reset all filters', () => {
    const store = useAlmacenStore.getState();
    store.setArticulos(mockArticulos);
    store.setFilter('unidad_tipo', 'pieza');
    store.setFilter('searchTerm', 'tornillo');
    
    store.resetFilters();

    const filtered = useAlmacenStore.getState().filteredArticulos;
    expect(filtered).toHaveLength(mockArticulos.length);
  });

  it('should handle empty search results', () => {
    const store = useAlmacenStore.getState();
    store.setArticulos(mockArticulos);
    store.setFilter('searchTerm', 'nonexistent');

    const filtered = useAlmacenStore.getState().filteredArticulos;
    expect(filtered).toHaveLength(0);
  });
});
