import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const FeatureButton = ({ icon, label, onClick, variant = "outline" }) => {
  return (
    <Button
      variant={variant}
      size="sm"
      onClick={onClick}
      className={cn(
        "gap-2 font-normal transition-all duration-200",
        "hover:scale-105 hover:shadow-md"
      )}
    >
      {icon}
      {label}
    </Button>
  );
};

export default FeatureButton;
