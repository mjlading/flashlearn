import { Plus } from "lucide-react";
import Link from "next/link";
import { ButtonProps, buttonVariants } from "./ui/button";

export default function NewDeckButton({ ...props }: ButtonProps) {
  return (
    <Link
      href={"/create"}
      className={buttonVariants({
        size: props.size,
        variant: props.variant,
        className: props.className,
      })}
    >
      <Plus size={20} className="mr-1" />
      Nytt sett
    </Link>
  );
}
