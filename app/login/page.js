"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);

  async function entrar(e) {
    e.preventDefault();
    setError("");
    setEnviando(true);

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    setEnviando(false);

    if (authError) {
      setError("Correo o contraseña incorrectos.");
      return;
    }

    router.push("/panel");
    router.refresh();
  }

  return (
    <div className="wrap">
      <div className="topbar">
        <div className="brand">
          <span className="mark">
            <Image src="/rebelcoderz-mark.png" alt="RebelCoderz" width={22} height={22} priority />
          </span>
          <div>
            <div className="who">RebelCoderz</div>
            <div className="by">Panel de administración</div>
          </div>
        </div>
      </div>

      <h1>Entrar al panel</h1>
      <p className="lead">Solo para el equipo de RebelCoderz.</p>

      <form className="card" onSubmit={entrar}>
        <div className="field">
          <label>Correo</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tucorreo@rebelcoderz.com"
          />
        </div>
        <div className="field">
          <label>Contraseña</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
        </div>

        {error && <p className="errormsg">{error}</p>}

        <button className="btn" type="submit" disabled={enviando}>
          {enviando ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </div>
  );
}
