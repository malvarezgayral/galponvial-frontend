import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface ToggleViewProps {
  entity: "almacén" | "vehículos";
  adminUrl: string;
  viewUrl: string;
  defaultView?: "admin" | "view";
}

const ToggleView = ({
  entity,
  adminUrl,
  viewUrl,
  defaultView = "view",
}: ToggleViewProps) => {
  const [active, setActive] = useState<"admin" | "view">(defaultView);
  const navigate = useNavigate();

  const handleToggle = (value: "admin" | "view") => {
    if (value === active) return;

    setActive(value);
    navigate(value === "admin" ? adminUrl : viewUrl);
  };

  return (
    <div
      className="
        relative
        w-140.5 h-15.75
        bg-gray-200
        rounded-xl
        p-1
        flex
        items-center
      "
    >
      <div
        className={`absolute top-1 bottom-1
                    rounded-lg bg-[#9BE29B]
                    transition-all duration-300 ease-out
                    w-[calc(50%-0.25rem)]
        ${active === "admin" ? "left-1" : "left-[calc(50%+0rem)]"}
                    `}
      />

      <button
        onClick={() => handleToggle("admin")}
        className={`
          relative z-10
          w-1/2 h-full
          text-lg font-medium
          transition-colors
          cursor-pointer
          ${
            active === "admin"
              ? "text-green-900"
              : "text-gray-600 hover:text-gray-800"
          }
        `}
      >
        Administrar {entity}
      </button>

      <button
        onClick={() => handleToggle("view")}
        className={`
          relative z-10
          w-1/2 h-full
          text-lg font-medium
          transition-colors
          cursor-pointer
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
