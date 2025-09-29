"use client";

import { useState } from "react";
import { LoginForm } from "@/frontend/components/auth/login-form";
import { RegisterForm } from "@/frontend/components/auth/register-form";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold gradient-header bg-clip-text text-transparent mb-2">
            Pokédex Digital
          </h1>
          <p className="text-muted-foreground">
            Explore o mundo dos Pokémon com nossa Pokédex interativa
          </p>
        </div>

        {isLogin ? (
          <LoginForm onToggleMode={() => setIsLogin(false)} />
        ) : (
          <RegisterForm onToggleMode={() => setIsLogin(true)} />
        )}
      </div>
    </div>
  );
}
