import { Link, NavLink, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Menu,
  X,
  Home,
  Calendar,
  Newspaper,
  HelpCircle,
  Users,
  Building2,
  ArrowUpRight,
} from "lucide-react";

import { Button, buttonVariants } from "@/libs/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/libs/components/ui/sheet";
import { ModeToggle } from "@/libs/components/ui/mode-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/libs/components/ui/dropdown-menu";
import { Logo } from "@/libs/components/common/Logo";
import { cn } from "@/libs/utils";
import { memberImageUrlFromFilename } from "@/libs/shared/ui";

import { useCheckAuthQuery, useLogoutMutation } from "@/app/services/authApi";

const navLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/events", label: "Events", icon: Calendar },
  { href: "/groups", label: "Groups", icon: Users },
  { href: "/articles", label: "Articles", icon: Newspaper },
  { href: "/organizers", label: "Organizers", icon: Building2 },
  { href: "/help", label: "Help", icon: HelpCircle },
];

export default function Header() {
  const { data: authData } = useCheckAuthQuery();
  const isAuthed = Boolean(authData?.member?._id);
  const displayName = authData?.member?.memberNick || "Guest";
  const memberType = authData?.member?.memberType;
  const initial = displayName.charAt(0).toUpperCase();
  const avatar = memberImageUrlFromFilename(authData?.member?.memberImage, displayName);
  const [logout] = useLogoutMutation();

  const { pathname } = useLocation();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  // On the home page the bar floats over the full-bleed hero photo until you scroll.
  const overlay = isHome && !scrolled;

  const doLogout = async () => {
    try {
      await logout().unwrap();
    } finally {
      window.location.assign("/login");
    }
  };

  const avatarButton = (
    <Button
      variant="ghost"
      size="icon"
      className={cn(
        "h-10 w-10 rounded-full p-0.5 border",
        overlay ? "border-white/40 hover:bg-white/10" : "border-border hover:bg-accent",
      )}
      aria-label="Open profile menu"
    >
      {avatar ? (
        <img src={avatar} alt={displayName} className="h-full w-full rounded-full object-cover" />
      ) : (
        <span className="inline-flex h-full w-full items-center justify-center rounded-full text-sm font-bold">
          {initial}
        </span>
      )}
    </Button>
  );

  const profileMenu = (
    <DropdownMenuContent align="end" className="w-64 rounded-2xl border bg-popover p-0 shadow-xl">
      <div className="px-4 py-3.5">
        <div className="eyebrow">{memberType === "ORG" ? "Organizer" : "Volunteer"}</div>
        <div className="mt-1 truncate text-[15px] font-bold text-foreground">{displayName}</div>
      </div>
      {memberType === "USER" && (
        <>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link to="/profile" className="w-full px-4 py-2.5">My profile</Link>
          </DropdownMenuItem>
        </>
      )}
      {memberType === "ORG" && (
        <>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link to="/dashboard" className="w-full px-4 py-2.5">Organizer dashboard</Link>
          </DropdownMenuItem>
        </>
      )}
      <DropdownMenuSeparator />
      <DropdownMenuItem asChild>
        <Link to="/events?liked=true" className="w-full px-4 py-2.5">Saved events</Link>
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem onClick={doLogout} className="px-4 py-2.5">Log out</DropdownMenuItem>
    </DropdownMenuContent>
  );

  return (
    <header
      className={cn(
        "z-50 w-full transition-colors duration-300",
        isHome ? "fixed inset-x-0 top-0" : "sticky top-0",
        overlay
          ? "bg-transparent text-white"
          : "bg-background/90 text-foreground backdrop-blur-md border-b border-border/70",
      )}
    >
      <div className="mx-auto flex h-16 md:h-[72px] max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-12">
        <Link to="/" className="flex items-center gap-2.5" aria-label="Unity home">
          <span
            className={cn(
              "inline-flex h-9 w-9 items-center justify-center rounded-full",
              overlay ? "bg-white/15 text-white" : "bg-sage text-olive dark:bg-accent dark:text-lime",
            )}
          >
            <Logo className="h-5 w-5" />
          </span>
          <span className="text-[1.3rem] font-extrabold tracking-[-0.03em]">Unity</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1 lg:gap-2" aria-label="Main">
          {navLinks.map((link) => (
            <NavLink
              key={link.href}
              to={link.href}
              end={link.href === "/"}
              className={({ isActive }) =>
                cn(
                  "rounded-full px-3.5 py-2 text-[15px] font-medium transition-colors",
                  overlay
                    ? isActive
                      ? "bg-white/15 text-white"
                      : "text-white/85 hover:text-white hover:bg-white/10"
                    : isActive
                      ? "bg-accent text-accent-foreground font-semibold"
                      : "text-foreground/75 hover:text-foreground hover:bg-muted",
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-2">
          <ModeToggle />
          {isAuthed ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>{avatarButton}</DropdownMenuTrigger>
              {profileMenu}
            </DropdownMenu>
          ) : (
            <>
              <Link
                to="/login"
                className={cn("btn-pill btn-pill-sm", overlay ? "btn-pill-ghost-light" : "btn-pill-outline")}
              >
                Log in
              </Link>
              <Link
                to="/signup"
                className={cn("btn-pill btn-pill-sm", overlay && "btn-pill-light")}
              >
                Sign up <ArrowUpRight className="h-4 w-4" />
              </Link>
            </>
          )}
        </div>

        <div className="flex md:hidden items-center gap-2">
          {!isAuthed && (
            <Link
              to="/login"
              className={cn("btn-pill btn-pill-sm", overlay ? "btn-pill-ghost-light" : "btn-pill-outline")}
            >
              Log in
            </Link>
          )}

          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={cn("h-10 w-10", overlay && "text-white hover:bg-white/10")}
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>

            <SheetContent side="right" className="w-[320px] sm:w-[360px]">
              <div className="flex h-full flex-col">
                <SheetHeader className="gap-0 border-b p-0">
                  <div className="flex items-center justify-between px-5 pt-5 pb-4">
                    <SheetTitle className="text-lg font-extrabold tracking-tight">Unity</SheetTitle>
                    <SheetClose asChild>
                      <Button variant="ghost" size="icon" className="h-10 w-10" aria-label="Close menu">
                        <X className="h-5 w-5" />
                      </Button>
                    </SheetClose>
                  </div>
                  <div className="flex items-center justify-between px-5 pb-4">
                    <ModeToggle />
                    {isAuthed && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>{avatarButton}</DropdownMenuTrigger>
                        {profileMenu}
                      </DropdownMenu>
                    )}
                  </div>
                </SheetHeader>

                <div className="flex-1 overflow-auto px-4 py-4">
                  <div className="space-y-1">
                    {navLinks.map((link) => (
                      <SheetClose asChild key={link.href}>
                        <NavLink
                          to={link.href}
                          end={link.href === "/"}
                          className={({ isActive }) =>
                            cn(
                              buttonVariants({ variant: isActive ? "secondary" : "ghost" }),
                              "w-full justify-start gap-3 h-12 text-base font-medium",
                            )
                          }
                        >
                          <link.icon className="h-5 w-5 flex-shrink-0" />
                          <span>{link.label}</span>
                        </NavLink>
                      </SheetClose>
                    ))}
                  </div>
                  {!isAuthed && (
                    <Link to="/signup" className="btn-pill mt-6 w-full">
                      Create a free account
                    </Link>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
