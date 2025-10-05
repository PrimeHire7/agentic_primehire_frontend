import { cn } from "@/lib/utils";

const ChatMessage = ({ role, content }) => {
  return (
    <div
      className={cn(
        "flex w-full gap-4 px-4 py-6 text-base",
        role === "assistant" ? "bg-muted/30" : ""
      )}
    >
      <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm bg-primary text-primary-foreground">
        {role === "user" ? "U" : "AI"}
      </div>
      <div className="flex-1 space-y-2 overflow-hidden">
        <p className="text-foreground leading-relaxed whitespace-pre-wrap break-words">
          {content}
        </p>
      </div>
    </div>
  );
};

export default ChatMessage;
