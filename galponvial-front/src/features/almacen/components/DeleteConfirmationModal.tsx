import React from 'react';
import { Button } from '@/shared/ui/Button';

export interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title?: string;
  message?: string;
  loading?: boolean;
}

export const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = '¿Eliminar artículo?',
  message = 'Esta acción no se puede deshacer.',
  loading = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all">
      
      <div className="w-full max-w-md bg-white rounded-lg shadow-2xl transform transition-all scale-100">
        <div className="p-6">
          <h3 className="mb-2 text-xl font-bold text-gray-900">
            {title}
          </h3>
          <p className="mb-6 text-gray-600">
            {message}
          </p>
          
          <div className="flex justify-end gap-3">
            <Button 
              variant="secondary" 
              onClick={onClose} 
              disabled={loading}
              type="button"
            >
              Cancelar
            </Button>
            
            <Button 
              variant="primary" 
              onClick={onConfirm} 
              isLoading={loading}
              className="bg-red-600 border-red-600 hover:bg-red-700 text-white shadow-md hover:shadow-lg"
              type="button"
            >
              Eliminar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};