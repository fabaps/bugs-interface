import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { PROYECTOS } from "@/lib/proyectos";
import LogoutButton from "./LogoutButton";

export default async function PanelIndexPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  return (
    <div className="wrap">
      <div className="topbar">
        <div className="brand">
          <span className="mark">⚡</span>
          <div>
            <div className="who">RebelCoderz</div>
            <div className="by">Panel de administración</div>
          </div>
        </div>
        <LogoutButton />
      </div>

      <h1>¿Qué proyecto quieres ver?</h1>
      <p className="lead">Elige un proyecto para ver sus reportes.</p>

      <div className="card">
        {PROYECTOS.map((p) => (
          <Link
            key={p.id}
            href={`/panel/${p.id}`}
            className="type-opt"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              textAlign: "left",
              marginBottom: "8px",
            }}
          >
            <span className="e">{p.ico}</span>
            <span className="t" style={{ fontSize: "14px" }}>
              {p.nombre}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
