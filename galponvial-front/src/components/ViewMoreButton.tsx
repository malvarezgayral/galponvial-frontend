import { Link } from "react-router-dom";

interface ActionButtonProps {
  text: string;
  to: string;
}

const ViewButton = ({ text, to }: ActionButtonProps) => {
  return (
    <Link
      to={to}
      className="
        inline-flex items-center justify-center
        w-70 h-17.5
        bg-orange-500
        border-4 border-black
        rounded-full

        text-black text-xl font-bold tracking-wide
        no-underline

        transition-all duration-300 ease-out

        hover:bg-orange-400
        hover:-translate-y-0.5
        hover:shadow-[0_8px_0_#000]

        active:translate-y-0
        active:shadow-[0_4px_0_#000]
      "
    >
      {text}
    </Link>
  );
};

export default ViewButton;
