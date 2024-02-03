import { Plus } from "lucide-react";
import { Button, ButtonProps } from "./ui/button";

export default function AddDeckButton({ ...props }: ButtonProps) {
  return (
    <Button {...props}>
      <Plus size={20} className="mr-1" />
      <span>Nytt sett</span>
    </Button>
  );
}
