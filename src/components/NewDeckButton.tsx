import { Plus } from "lucide-react";
import { Button, ButtonProps, buttonVariants } from "./ui/button";
import Link from "next/link";

export default function NewDeckButton({ ...props }: ButtonProps) {
  return (
    <Link
      href={"/dashboard/decks/create"}
      className={buttonVariants({
        size: props.size,
        variant: props.variant,
        className: props.className,
      })}
    >
      <Plus size={20} className="mr-1" />
      <span>Nytt sett</span>
    </Link>
  );
}
