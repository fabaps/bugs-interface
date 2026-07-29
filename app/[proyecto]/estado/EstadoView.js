"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { TIPOS } from "@/lib/proyectos";

const ESTADO_LABEL = { nuevo: "Nuevo", revision: "En revisión", resuelto: "Resuelto" };
const ESTADO_CLASS = { nuevo: "on-new", revision: "on-rev", resuelto: "on-done" };

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

export default function EstadoView({ proyecto, reportes }) {
  const [filtro, setFiltro] = useState("todos");

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
          <span>🕐 {fmtFecha(r.created_at)}</span>
          <span>
            📅 Entrega:{" "}
            {r.fecha_entrega ? fmtEntrega(r.fecha_entrega) : "pendiente"}
          </span>
        </div>
        <div className="statusrow">
          <span className={`pill ${ESTADO_CLASS[r.estado]}`}>
            {ESTADO_LABEL[r.estado]}
          </span>
        </div>
      </div>
    );
  }

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

  const resueltos = reportes.filter((r) => r.estado === "resuelto");

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
            <div className="by">Soporte por RebelCoderz</div>
          </div>
        </div>
        <div className="tabs">
          <Link href={`/${proyecto.id}`}>Reportar</Link>
          <button className="active">Panel</button>
        </div>
      </div>

      <h1>Estado de tus reportes</h1>
      <p className="lead">
        Aquí puedes ver cómo va cada reporte. Esta vista es solo de lectura.
      </p>

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

      {filtro === "todos" &&
        TIPOS.map((tp) =>
          renderGrupo(
            `${tp.emoji} ${tp.label}`,
            reportes.filter((r) => r.tipo === tp.id && r.estado !== "resuelto"),
            tp.id
          )
        )}
      {filtro === "todos" && renderGrupo("✅ Resueltos", resueltos, "resueltos")}

      {filtro !== "todos" &&
        filtro !== "resueltos" &&
        (() => {
          const tp = TIPOS.find((t) => t.id === filtro);
          return renderGrupo(
            `${tp.emoji} ${tp.label}`,
            reportes.filter((r) => r.tipo === tp.id && r.estado !== "resuelto"),
            tp.id
          );
        })()}

      {filtro === "resueltos" && renderGrupo("✅ Resueltos", resueltos, "resueltos")}

      <p className="footlink">
        <Link href="/login">🔒 Equipo RebelCoderz</Link>
      </p>
    </div>
  );
}
