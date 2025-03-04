import {Loader2} from "lucide-react"
import { cva, VariantProps } from "class-variance-authority";
import { ButtonHTMLAttributes, FC } from "react";
import { cn } from "../../lib/utils";


const buttonVariants = cva(
  "active:scale-95 inline-flex items-center justify-center rounded-lg text-sm transition-all duration-100 font-medium disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        default: "text-white bg-green-800 hover:opacity-75",
        ghost:
          "bg-transparent text-white hover:opacity-75 border border-custom",
      },
      size: {
        default: "py-3 px-7 h-11",
        lg: "px-10 py-4 h-11 text-md",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonsProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading: boolean;
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>> | null;
  iconStyle?: string
}

const CustomButton: FC<ButtonsProps> = ({
  className,
  children,
  variant,
  size,
  Icon,
  isLoading,
  iconStyle,
  ...props
}) => {
  return (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
      disabled={isLoading}
    >
      {isLoading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : Icon === null ? null : (
        <Icon className={`mr-2 h-4 w-4 ${iconStyle}`} />
      )}
      {children}
    </button>
  );
};
export default CustomButton;
