import { Bot } from "lucide-react";

const Header = () => {
  return (
    <header className="py-4 px-4 sm:px-6 md:px-8 border-b border-border/50 bg-card">
      <div className="max-w-screen-2xl mx-auto">
        <div className="flex items-center gap-2">
          <Bot className="w-8 h-8 text-primary" />
          <h1 className="text-2xl font-bold font-headline text-foreground">
            HireUp
          </h1>
        </div>
      </div>
    </header>
  );
};

export default Header;
