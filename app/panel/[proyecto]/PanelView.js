"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { TIPOS } from "@/lib/proyectos";
import LogoutButton from "../LogoutButton";

const ESTADOS = [
  { id: "nuevo", label: "Nuevo", cls: "on-new" },
  { id: "revision", label: "En revisión", cls: "on-rev" },
  { id: "resuelto", label: "Resuelto", cls: "on-done" },
];

function fmtFecha(iso) {
  return new Date(iso).toLocaleDateString("es", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function Cuerpo({ r }) {
  if (r.tipo === "bug") {
    return (
      <>
        {r.que_hacia && (
          <>
            <span className="k">Hacía:</span> {r.que_hacia}
            <br />
          </>
        )}
        {r.que_esperaba && (
          <>
            <span className="k">Esperaba:</span> {r.que_esperaba}
            <br />
          </>
        )}
        {r.que_paso && (
          <>
            <span className="k">Pasó:</span> {r.que_paso}
          </>
        )}
      </>
    );
  }
  return <>{r.descripcion}</>;
}

export default function PanelView({ proyecto, initialReportes }) {
  const [reportes, setReportes] = useState(initialReportes);
  const [error, setError] = useState("");

  async function cambiarEstado(id, estado) {
    const anterior = reportes;
    setReportes((rs) => rs.map((r) => (r.id === id ? { ...r, estado } : r)));

    const supabase = createClient();
    const { error: dbError } = await supabase
      .from("reportes")
      .update({ estado })
      .eq("id", id);

    if (dbError) {
      setError("No se pudo actualizar el estado. Intenta de nuevo.");
      setReportes(anterior);
    }
  }

  return (
    <div className="wrap">
      <div className="topbar">
        <div className="brand">
          <span className="mark">{proyecto.ico}</span>
          <div>
            <div className="who">{proyecto.nombre}</div>
            <div className="by">Panel de administración</div>
          </div>
        </div>
        <LogoutButton />
      </div>

      <p className="lead" style={{ marginBottom: "12px" }}>
        <Link href="/panel">← Cambiar de proyecto</Link>
      </p>

      <h1>Panel — {proyecto.nombre}</h1>
      <p className="lead">Reportes de este proyecto, divididos por tipo.</p>

      {error && <p className="errormsg">{error}</p>}

      {TIPOS.map((tp) => {
        const items = reportes.filter((r) => r.tipo === tp.id);
        return (
          <div className="group" key={tp.id}>
            <h2>
              {tp.emoji} {tp.label} <span className="cnt">{items.length}</span>
            </h2>
            {items.length === 0 ? (
              <div className="empty">Nada por aquí todavía.</div>
            ) : (
              items.map((r) => (
                <div className={`report b-${r.tipo}`} key={r.id}>
                  <div className="top">
                    <span className={`pbadge p-${r.prioridad}`}>P{r.prioridad}</span>
                  </div>
                  <div className="desc">
                    <Cuerpo r={r} />
                  </div>
                  <div className="metaline">
                    <span>👤 {r.nombre}</span>
                    <span>🕐 {fmtFecha(r.created_at)}</span>
                  </div>
                  <div className="statusrow">
                    {ESTADOS.map((e) => (
                      <button
                        key={e.id}
                        className={r.estado === e.id ? e.cls : ""}
                        onClick={() => cambiarEstado(r.id, e.id)}
                      >
                        {e.label}
                      </button>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        );
      })}
    </div>
  );
}
