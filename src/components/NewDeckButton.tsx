import { Plus } from "lucide-react";
import Link from "next/link";
import { ButtonProps, buttonVariants } from "./ui/button";
import { getDictionary } from "@/app/dictionaries/dictionaries";

interface dictAndButtonProps extends ButtonProps {
  dict: Awaited<ReturnType<typeof getDictionary>>; // fancy unwrap
}

export default function NewDeckButton({ dict, ...props }: dictAndButtonProps) {
  return (
    <Link
      href={`/${dict.lang}/decks/create`}
      className={buttonVariants({
        size: props.size,
        variant: props.variant,
        className: props.className,
      })}
    >
      <Plus size={20} className="mr-1" />
      {dict.decks.newDeck}
    </Link>
  );
}
