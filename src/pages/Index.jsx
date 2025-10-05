import { useState } from "react";
import { Button } from "@/components/ui/button";
import ChatMessage from "@/components/ChatMessage";
import ChatInput from "@/components/ChatInput";
import FeatureButton from "@/components/FeatureButton";
import { 
  Search, 
  Lightbulb, 
  Presentation, 
  Code2, 
  Sparkles, 
  BookOpen,
  Menu
} from "lucide-react";

const Index = () => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = (message) => {
    setMessages((prev) => [...prev, { role: "user", content: message }]);
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "I'm a demo chatbot. In a real implementation, I would connect to an AI service to provide intelligent responses.",
        },
      ]);
      setIsLoading(false);
    }, 1000);
  };

  const handleFeatureClick = (feature) => {
    handleSend(`I want to use ${feature}`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
            <select className="text-sm font-medium bg-transparent border border-border rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer">
              <option>GPT-4.5</option>
              <option>GPT-4</option>
              <option>Claude</option>
            </select>
          </div>
          <Button variant="default" size="sm" className="rounded-full">
            Sign in
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-full px-4 py-12">
              <div className="text-center space-y-6 max-w-2xl mx-auto">
                <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-foreground">
                  Hi, I'm Z.ai
                </h1>
                <p className="text-lg text-muted-foreground">
                  Choose from powerful AI features below
                </p>
                
                {/* Feature Buttons */}
                <div className="flex flex-wrap gap-3 justify-center pt-8">
                  <FeatureButton
                    icon={<Search className="h-4 w-4" />}
                    label="Web Search"
                    onClick={() => handleFeatureClick("Web Search")}
                  />
                  <FeatureButton
                    icon={<Lightbulb className="h-4 w-4" />}
                    label="Deep Think"
                    onClick={() => handleFeatureClick("Deep Think")}
                  />
                  <FeatureButton
                    icon={<Presentation className="h-4 w-4" />}
                    label="AI Slides 🔥"
                    onClick={() => handleFeatureClick("AI Slides")}
                    variant="default"
                  />
                  <FeatureButton
                    icon={<Code2 className="h-4 w-4" />}
                    label="Full-Stack"
                    onClick={() => handleFeatureClick("Full-Stack")}
                  />
                  <FeatureButton
                    icon={<Sparkles className="h-4 w-4" />}
                    label="Magic Design"
                    onClick={() => handleFeatureClick("Magic Design")}
                  />
                  <FeatureButton
                    icon={<BookOpen className="h-4 w-4" />}
                    label="Deep Research"
                    onClick={() => handleFeatureClick("Deep Research")}
                  />
                  <FeatureButton
                    icon={<Code2 className="h-4 w-4" />}
                    label="Write code"
                    onClick={() => handleFeatureClick("Write code")}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto w-full">
              {messages.map((message, index) => (
                <ChatMessage key={index} role={message.role} content={message.content} />
              ))}
              {isLoading && (
                <div className="flex w-full gap-4 px-4 py-6 text-base bg-muted/30">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm bg-primary text-primary-foreground">
                    AI
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-foreground/60 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <div className="w-2 h-2 bg-foreground/60 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <div className="w-2 h-2 bg-foreground/60 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="border-t border-border bg-background">
          <ChatInput onSend={handleSend} disabled={isLoading} />
          
          {/* Footer */}
          <div className="text-center text-xs text-muted-foreground pb-4 px-4">
            <a href="#" className="hover:underline">Tech Blog</a>
            {" · "}
            <a href="#" className="hover:underline">Contact us</a>
            {" · "}
            <a href="#" className="hover:underline">Terms of Service</a>
            {" and "}
            <a href="#" className="hover:underline">Privacy Policy</a>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
