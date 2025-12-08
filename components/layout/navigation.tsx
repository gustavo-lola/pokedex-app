"use client";

import { Button } from "@/components/ui/button";
import { Heart, Star, Search, Home } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { usePokemon } from "@/contexts/pokemon-context";

export function Navigation() {
  const pathname = usePathname();
  const { favorites, battleTeam } = usePokemon();

  const navItems = [
    {
      href: "/",
      label: "Início",
      icon: Home,
      isActive: pathname === "/",
    },
    {
      href: "/dashboard",
      label: "Descobrir",
      icon: Search,
      isActive: pathname === "/dashboard",
    },
    {
      href: "/favorites",
      label: "Favoritos",
      icon: Heart,
      isActive: pathname === "/favorites",
      badge: favorites.length,
    },
    {
      href: "/battle-team",
      label: "Equipe",
      icon: Star,
      isActive: pathname === "/battle-team",
      badge: battleTeam.length,
    },
  ];

  return (
    <nav className="bg-card border-t border-border md:border-t-0 md:border-r">
      <div className="flex md:flex-col gap-2 p-4 overflow-x-auto md:overflow-x-visible">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant={item.isActive ? "default" : "ghost"}
                className={`flex items-center gap-2 min-w-fit relative ${item.isActive ? "bg-primary text-primary-foreground" : ""
                  }`}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{item.label}</span>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </Button>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
