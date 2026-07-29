"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { DESC_LABEL } from "@/lib/proyectos";

const TIPO_OPTS = [
  { id: "bug", emoji: "🐞", label: "Bug" },
  { id: "mejora", emoji: "✨", label: "Mejora" },
  { id: "recomendacion", emoji: "💡", label: "Cambio Personalizado" },
];

export default function ReportForm({ proyecto }) {
  const [tipo, setTipo] = useState(null);
  const [titulo, setTitulo] = useState("");
  const [desc, setDesc] = useState("");
  const [hacia, setHacia] = useState("");
  const [espera, setEspera] = useState("");
  const [paso, setPaso] = useState("");
  const [prioridad, setPrioridad] = useState("2");
  const [nombre, setNombre] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState("");
  const [enviado, setEnviado] = useState(false);

  function resetForm() {
    setTipo(null);
    setTitulo("");
    setDesc("");
    setHacia("");
    setEspera("");
    setPaso("");
    setPrioridad("2");
    setNombre("");
    setError("");
    setEnviado(false);
  }

  async function enviarReporte(e) {
    e.preventDefault();
    setError("");

    if (!tipo) {
      setError("Elige el tipo de reporte.");
      return;
    }

    const rep = {
      proyecto: proyecto.id,
      tipo,
      prioridad: Number(prioridad),
      nombre: nombre.trim() || "Anónimo",
      estado: "nuevo",
    };

    if (tipo === "bug") {
      if (!paso.trim()) {
        setError("Cuéntanos al menos qué pasó en realidad.");
        return;
      }
      rep.que_hacia = hacia.trim() || null;
      rep.que_esperaba = espera.trim() || null;
      rep.que_paso = paso.trim();
    } else {
      if (!desc.trim()) {
        setError("Por favor escribe tu reporte.");
        return;
      }
      rep.titulo = titulo.trim() || null;
      rep.descripcion = desc.trim();
    }

    setEnviando(true);
    const supabase = createClient();
    const { error: dbError } = await supabase.from("reportes").insert(rep);
    setEnviando(false);

    if (dbError) {
      setError("No pudimos enviar tu reporte. Intenta de nuevo en un momento.");
      return;
    }

    setEnviado(true);
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
            <div className="by">Soporte por RebelCoderz</div>
          </div>
        </div>
        <div className="tabs">
          <button className="active">Reportar</button>
          <Link href={`/${proyecto.id}/estado`}>Panel</Link>
        </div>
      </div>

      {!enviado ? (
        <>
          <h1>¿Encontraste algo en {proyecto.nombre}?</h1>
          <p className="lead">
            Reporta un problema, sugiere una mejora o pide un cambio personalizado.
          </p>

          <form className="card" onSubmit={enviarReporte}>
            <div className="field">
              <label>¿Qué tipo de reporte es?</label>
              <div className="type-grid">
                {TIPO_OPTS.map((o) => (
                  <div
                    key={o.id}
                    className={`type-opt${tipo === o.id ? " sel" : ""}`}
                    onClick={() => setTipo(o.id)}
                  >
                    <div className="e">{o.emoji}</div>
                    <div className="t">{o.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {tipo === "bug" ? (
              <div className="field">
                <label>Ayúdanos a entender el problema 🐞</label>
                <textarea
                  className="mini"
                  placeholder="1. ¿Qué estabas haciendo?"
                  value={hacia}
                  onChange={(e) => setHacia(e.target.value)}
                />
                <textarea
                  className="mini"
                  placeholder="2. ¿Qué esperabas que pasara?"
                  value={espera}
                  onChange={(e) => setEspera(e.target.value)}
                />
                <textarea
                  className="mini"
                  placeholder="3. ¿Qué pasó en realidad?"
                  value={paso}
                  onChange={(e) => setPaso(e.target.value)}
                />
              </div>
            ) : (
              <>
                {tipo && (
                  <div className="field">
                    <label>
                      Título <span className="hint">(opcional)</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Ej. Ordenar productos por precio"
                      value={titulo}
                      onChange={(e) => setTitulo(e.target.value)}
                    />
                  </div>
                )}
                <div className="field">
                  <label>{tipo ? DESC_LABEL[tipo] : "Cuéntanos"}</label>
                  <textarea
                    placeholder="Escribe aquí..."
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                  />
                </div>
              </>
            )}

            <div className="field">
              <label>
                Nivel de prioridad <span className="hint">(1 = más urgente)</span>
              </label>
              <select
                className="f"
                value={prioridad}
                onChange={(e) => setPrioridad(e.target.value)}
              >
                <option value="1">1 — Alta</option>
                <option value="2">2 — Media</option>
                <option value="3">3 — Baja</option>
              </select>
            </div>

            <div className="field">
              <label>
                Tu nombre <span className="hint">(opcional)</span>
              </label>
              <input
                type="text"
                placeholder="Ej. María López"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />
            </div>

            {error && <p className="errormsg">{error}</p>}

            <button className="btn" type="submit" disabled={enviando}>
              {enviando ? "Enviando..." : "Enviar reporte"}
            </button>
          </form>
        </>
      ) : (
        <div className="card">
          <div className="success">
            <div className="big">🎉</div>
            <h2>¡Gracias, lo recibimos!</h2>
            <p>Nuestro equipo ya puede verlo.</p>
            <button className="btn ghost" onClick={resetForm}>
              Enviar otro reporte
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
