import React from 'react';

interface ServicioCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
}

export const ServicioCard: React.FC<ServicioCardProps> = ({
  title,
  description,
  icon,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className="
        w-full max-w-sm p-8
        h-full
        bg-white rounded-3xl
        border-2 border-[var(--color-border-light)]
        transition-all duration-300 ease-in-out
        cursor-pointer
        hover:border-[#378AFE]
        hover:shadow-lg
        hover:scale-105
        active:scale-100
        focus:outline-none
        focus:ring-2
        focus:ring-[#378AFE]
        focus:ring-offset-2
      "
    >
      <div className="flex flex-col items-center gap-4">
        {/* Icono */}
        <div
          className="
            w-20 h-20
            flex items-center justify-center
            rounded-2xl
            bg-[#88BAFF]
            text-white
            transition-all duration-300
            group-hover:bg-[#378AFE]
          "
        >
          {icon}
        </div>

        {/* Título */}
        <h3 className="text-xl font-bold text-[var(--color-text-primary)] text-center">
          {title}
        </h3>

        {/* Descripción */}
        <p className="text-sm text-[var(--color-text-secondary)] text-center">
          {description}
        </p>
      </div>
    </button>
  );
};
