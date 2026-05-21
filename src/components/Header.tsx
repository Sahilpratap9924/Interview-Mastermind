import { Link, useNavigate } from "@tanstack/react-router";
import { clearSession } from "@/integrations/mongo/auth-client";
import { Brain, LogOut, User, Settings } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";

export function Header({ authed }: { authed: boolean }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const initials = user?.name ? user.name.split(" ").map(s => s[0]).slice(0,2).join("") : (user?.email ? user.email[0].toUpperCase() : "?");
  return (
    <header className="border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-screen-2xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2 text-lg font-bold text-foreground">
          <Brain className="text-primary" size={22} />
          <span>InterviewAI</span>
        </Link>
        <nav className="flex items-center gap-2 text-sm">
          {authed ? (
            <>
              <Link to="/dashboard" className="rounded-md px-3 py-1.5 text-muted-foreground hover:text-foreground">Dashboard</Link>
              <Link to="/history" className="rounded-md px-3 py-1.5 text-muted-foreground hover:text-foreground">History</Link>
              <div className="flex items-center gap-3">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="inline-flex items-center rounded-full p-0">
                      <Avatar>
                        <AvatarFallback>{initials}</AvatarFallback>
                      </Avatar>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <div className="px-2 pt-1 pb-2">
                      <DropdownMenuLabel className="text-sm font-medium">{user?.name ?? user?.email}</DropdownMenuLabel>
                    </div>
                    <DropdownMenuItem onSelect={() => navigate({ to: "/profile" })}>
                      <User className="mr-2 inline-block" size={14} /> Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => navigate({ to: "/settings" })}>
                      <Settings className="mr-2 inline-block" size={14} /> Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onSelect={() => { clearSession(); navigate({ to: "/" }); }}>
                      <LogOut className="mr-2 inline-block" size={14} /> Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="rounded-md px-3 py-1.5 text-muted-foreground hover:text-foreground">Sign in</Link>
              <Link to="/register" className="rounded-md bg-primary px-4 py-1.5 font-medium text-primary-foreground hover:opacity-90">
                Get started
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
