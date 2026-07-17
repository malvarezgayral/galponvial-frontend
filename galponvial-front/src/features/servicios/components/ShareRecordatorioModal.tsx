import { useState } from 'react';

interface Persona {
  id: string;
  nombre: string;
  email: string;
  rol: 'Propietario' | 'Puede editar' | 'Puede ver';
}

interface ShareRecordatorioModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Datos mock — reemplazar por fetch al backend cuando exista el endpoint
const MOCK_PERSONAS: Persona[] = [
  {
    id: '1',
    nombre: 'Javier Schmitt',
    email: 'jvschmitt07@hotmail.com',
    rol: 'Propietario',
  },
];

export const ShareRecordatorioModal = ({
  isOpen,
  onClose,
}: ShareRecordatorioModalProps) => {
  const [personas, setPersonas] = useState<Persona[]>(MOCK_PERSONAS);
  const [inputValue, setInputValue] = useState('');

  if (!isOpen) return null;

  const handleEnviar = () => {
    if (!inputValue.trim()) return;
    const nueva: Persona = {
      id: Date.now().toString(),
      nombre: inputValue,
      email: inputValue,
      rol: 'Puede ver',
    };
    setPersonas((prev) => [...prev, nueva]);
    setInputValue('');
  };

  const handleCambiarRol = (id: string, rol: string) => {
    if (rol === 'Quitar acceso') {
      setPersonas((prev) => prev.filter((p) => p.id !== id));
      return;
    }
    setPersonas((prev) =>
      prev.map((p) => (p.id === id ? { ...p, rol: rol as Persona['rol'] } : p))
    );
  };

  const handleCopiarEnlace = () => {
    navigator.clipboard.writeText(window.location.href);
  };

  return (
    <div className="fixed inset-0 bg-black/45 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-1">
          <p className="font-medium text-base">Compartir recordatorio</p>
          <button
            onClick={onClose}
            className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="flex gap-2 mb-4 mt-4">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleEnviar()}
            placeholder="Agregar por nombre o email"
            className="flex-1 border border-[var(--color-border-light)] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#378AFE]"
          />
          <button
            onClick={handleEnviar}
            className="bg-[#378AFE] text-white rounded-lg px-4 font-medium text-sm hover:bg-[#0962DE] cursor-pointer"
          >
            Enviar
          </button>
        </div>

        <p className="text-sm font-medium text-[var(--color-text-secondary)] mb-2">
          Personas con acceso
        </p>

        <div className="max-h-60 overflow-y-auto">
          {personas.map((persona) => (
            <div
              key={persona.id}
              className="flex items-center gap-3 py-2 border-b border-[var(--color-border-light)] last:border-0"
            >
              <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-xs font-medium text-[#0962DE]">
                {persona.nombre
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .slice(0, 2)
                  .toUpperCase()}
              </div>
              <div className="flex-1">
                <p className="text-sm">{persona.nombre}</p>
                <p className="text-xs text-[var(--color-text-secondary)]">
                  {persona.email}
                </p>
              </div>
              {persona.rol === 'Propietario' ? (
                <span className="text-sm text-[var(--color-text-secondary)]">
                  Propietario
                </span>
              ) : (
                <select
                  value={persona.rol}
                  onChange={(e) => handleCambiarRol(persona.id, e.target.value)}
                  className="text-sm text-[var(--color-text-secondary)] bg-transparent outline-none cursor-pointer"
                >
                  <option>Puede editar</option>
                  <option>Puede ver</option>
                  <option>Quitar acceso</option>
                </select>
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center mt-5 pt-4 border-t border-[var(--color-border-light)]">
          <button
            onClick={handleCopiarEnlace}
            className="flex items-center gap-2 border border-[var(--color-border-light)] rounded-lg px-3 py-2 text-sm font-medium hover:bg-gray-50 cursor-pointer"
          >
            Copiar enlace
          </button>
          <button
            onClick={onClose}
            className="bg-[#378AFE] text-white rounded-lg px-5 py-2 font-medium hover:bg-[#0962DE] cursor-pointer"
          >
            Listo
          </button>
        </div>
      </div>
    </div>
  );
};
