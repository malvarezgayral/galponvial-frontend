import { useState } from "react";

interface ToggleViewProps {
  entity: "almacén" | "vehículos";
  onChange?: (value: "admin" | "view") => void;
}

const ToggleView = ({ entity, onChange }: ToggleViewProps) => {
  const [active, setActive] = useState<"admin" | "view">("view");

  const handleToggle = (value: "admin" | "view") => {
    if (value === active) return;
    setActive(value);
    onChange?.(value);
  };

  return (
    <div
      className="
        relative
        w-[562px] h-[63px]
        bg-gray-200
        rounded-xl
        p-1
        flex
        items-center
      "
    >
      {/* SLIDER */}
      <div
        className={`
    absolute top-1 bottom-1
    rounded-lg
    bg-[#9BE29B]
    transition-all duration-300 ease-out

    w-[calc(50%-0.25rem)]
    ${active === "admin" ? "left-1" : "left-[calc(50%+0.115rem)]"}
  `}
      />

      {/* ADMIN */}
      <button
        onClick={() => handleToggle("admin")}
        className={`
          relative z-10
          w-1/2 h-full
          text-lg font-medium
          transition-colors
          ${
            active === "admin"
              ? "text-green-900"
              : "text-gray-600 hover:text-gray-800"
          }
        `}
      >
        Administrar {entity}
      </button>

      {/* VIEW */}
      <button
        onClick={() => handleToggle("view")}
        className={`
          relative z-10
          w-1/2 h-full
          text-lg font-medium
          transition-colors
          ${
            active === "view"
              ? "text-green-900"
              : "text-gray-600 hover:text-gray-800"
          }
        `}
      >
        Visualizar {entity}
      </button>
    </div>
  );
};

export default ToggleView;
