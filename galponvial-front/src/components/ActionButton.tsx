type ButtonVariant = "save" | "changes" | "danger";

interface ButtonProps {
  children: React.ReactNode;
  variant?: ButtonVariant;
  onClick?: () => void;
}

const Button = ({ children, variant = "save", onClick }: ButtonProps) => {
  const base =
    "inline-flex items-center justify-center font-semibold rounded-md border-3 transition-colors duration-200 px-4 py-2 cursor-pointer";

  const variants = {
    save:
      "max-w-[100px] w-full bg-blue-600 text-white border-blue-700 hover:bg-blue-500 hover:border-blue-500",

    changes:
      "max-w-[180px] w-full bg-blue-600 text-white border-blue-700 hover:bg-blue-500 hover:border-blue-500",

    danger:
      "max-w-[100px] w-full bg-white text-red-600 border-red-600 hover:bg-red-600 hover:text-white hover:border-red-700",
  };

  return (
    <button onClick={onClick} className={`${base} ${variants[variant]}`}>
      {children}
    </button>
  );
};

export default Button;
