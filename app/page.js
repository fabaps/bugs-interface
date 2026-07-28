import Link from "next/link";

export default function HomePage() {
  return (
    <div className="wrap">
      <div className="topbar">
        <div className="brand">
          <span className="mark">⚡</span>
          <div>
            <div className="who">RebelCoderz</div>
            <div className="by">Sistema de reportes</div>
          </div>
        </div>
      </div>

      <h1>Sistema de reportes</h1>
      <p className="lead">
        Este enlace no corresponde a ningún proyecto. Si eres cliente, usa el
        enlace que te compartimos. Si eres del equipo de RebelCoderz, entra
        al panel.
      </p>

      <div className="card">
        <Link
          className="btn"
          href="/login"
          style={{ display: "block", textAlign: "center" }}
        >
          Entrar al panel
        </Link>
      </div>
    </div>
  );
}
