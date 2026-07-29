"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { TIPOS } from "@/lib/proyectos";
import LogoutButton from "../LogoutButton";

const ESTADOS = [
  { id: "nuevo", label: "En revisión", cls: "on-new" },
  { id: "revision", label: "En pruebas", cls: "on-rev" },
  { id: "resuelto", label: "Resuelto", cls: "on-done" },
];

const FILTROS = [
  { id: "todos", label: "Todos" },
  { id: "bug", label: "Bugs" },
  { id: "mejora", label: "Mejoras" },
  { id: "recomendacion", label: "Cambios Personalizados" },
  { id: "resueltos", label: "Resueltos" },
];

function fmtFecha(iso) {
  return new Date(iso).toLocaleDateString("es", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// fecha_entrega llega como "YYYY-MM-DD"; se arma con componentes locales
// para que no se corra un día por la zona horaria.
function fmtEntrega(ymd) {
  const [y, m, d] = ymd.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("es", {
    day: "numeric",
    month: "short",
    year: "numeric",
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
  return (
    <>
      {r.titulo && (
        <>
          <strong>{r.titulo}</strong>
          <br />
        </>
      )}
      {r.descripcion}
    </>
  );
}

export default function PanelView({ proyecto, initialReportes }) {
  const [reportes, setReportes] = useState(initialReportes);
  const [error, setError] = useState("");
  const [filtro, setFiltro] = useState("todos");

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

  async function cambiarEntrega(id, fecha) {
    const anterior = reportes;
    const valor = fecha || null;
    setReportes((rs) =>
      rs.map((r) => (r.id === id ? { ...r, fecha_entrega: valor } : r))
    );

    const supabase = createClient();
    const { error: dbError } = await supabase
      .from("reportes")
      .update({ fecha_entrega: valor })
      .eq("id", id);

    if (dbError) {
      setError("No se pudo guardar la fecha de entrega. Intenta de nuevo.");
      setReportes(anterior);
    }
  }

  return (
    <div className="wrap">
      <div className="topbar">
        <div className="brand">
          <span className={`mark${proyecto.logo ? " haslogo" : ""}`}>
            {proyecto.logo ? (
              <Image src={proyecto.logo} alt={proyecto.nombre} width={34} height={34} priority />
            ) : (
              proyecto.ico
            )}
          </span>
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

      <div className="filters">
        {FILTROS.map((f) => (
          <button
            key={f.id}
            className={filtro === f.id ? "active" : ""}
            onClick={() => setFiltro(f.id)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {(filtro === "todos"
        ? TIPOS
        : TIPOS.filter((tp) => tp.id === filtro)
      ).map((tp) =>
        renderGrupo(
          `${tp.emoji} ${tp.label}`,
          reportes.filter((r) => r.tipo === tp.id && r.estado !== "resuelto"),
          tp.id
        )
      )}

      {(filtro === "todos" || filtro === "resueltos") &&
        renderGrupo(
          "✅ Resueltos",
          reportes.filter((r) => r.estado === "resuelto"),
          "resueltos"
        )}
    </div>
  );

  function renderGrupo(titulo, items, key) {
    return (
      <div className="group" key={key}>
        <h2>
          {titulo} <span className="cnt">{items.length}</span>
        </h2>
        {items.length === 0 ? (
          <div className="empty">Nada por aquí todavía.</div>
        ) : (
          items.map(renderCard)
        )}
      </div>
    );
  }

  function renderCard(r) {
    return (
      <div className={`report b-${r.tipo}`} key={r.id}>
        <div className="top">
          <span className={`pbadge p-${r.prioridad}`}>P{r.prioridad}</span>
        </div>
        <div className="desc">
          <Cuerpo r={r} />
        </div>
        <div className="metaline">
          <span>👤 {r.nombre}</span>
          <span>🕐 Creado: {fmtFecha(r.created_at)}</span>
          <span>
            📅 Entrega:{" "}
            {r.fecha_entrega ? fmtEntrega(r.fecha_entrega) : "pendiente"}
          </span>
        </div>
        <div className="entregarow">
          <label>Fecha aproximada de entrega</label>
          <input
            type="date"
            value={r.fecha_entrega ?? ""}
            onChange={(e) => cambiarEntrega(r.id, e.target.value)}
          />
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
    );
  }
}
