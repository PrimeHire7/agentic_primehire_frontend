import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const FeatureButton = ({ icon, label, onClick, variant = "outline", className }) => {
  return (
    <Button
      variant={variant}
      size="sm"
      onClick={onClick}
      className={cn(
        "gap-2 font-normal transition-all duration-200 feature-button",
        className
      )}
    >
      <span className="feature-button-icon-wrapper">
        {icon}
      </span>
      <span className="feature-button-text">{label}</span>

      {/* Ripple container */}
      <span className="feature-button-ripple"></span>
    </Button>
  );
};

export default FeatureButton;
