import { useState } from "react";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { Helmet } from "react-helmet"; // Importamos Helmet

// Componente de Login/Registro
function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [esNuevo, setEsNuevo] = useState(false);
  const [error, setError] = useState("");

  const auth = getAuth();

  const manejarSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (esNuevo) {
        // Crear usuario nuevo
        const res = await createUserWithEmailAndPassword(auth, email, password);
        onLogin(res.user);
      } else {
        // Iniciar sesión
        const res = await signInWithEmailAndPassword(auth, email, password);
        onLogin(res.user);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "400px", margin: "auto", textAlign: "center" }}>
      {/* Título de la página */}
      <Helmet>
        <title>Calendario de The Wave 🌊🏠</title>
      </Helmet>

      <h2>{esNuevo ? "Crear cuenta" : "Iniciar sesión"}</h2>
      <form onSubmit={manejarSubmit}>
        <input
          type="email"
          placeholder="Correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{
            width: "100%",
            padding: "0.5rem",
            marginBottom: "0.5rem",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{
            width: "100%",
            padding: "0.5rem",
            marginBottom: "0.5rem",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        />
        <button
          type="submit"
          style={{
            width: "100%",
            padding: "0.5rem",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          {esNuevo ? "Crear cuenta" : "Entrar"}
        </button>
      </form>

      <p style={{ textAlign: "center", fontSize: "0.9rem", marginTop: "1rem" }}>
        {esNuevo ? "¿Ya tenés cuenta?" : "¿Sos nuevo?"}{" "}
        <button
          onClick={() => setEsNuevo(!esNuevo)}
          style={{
            fontSize: "0.9rem",
            color: "#007bff",
            background: "none",
            border: "none",
            cursor: "pointer",
            textDecoration: "underline",
          }}
        >
          {esNuevo ? "Iniciar sesión" : "Crear cuenta"}
        </button>
      </p>

      {error && <p style={{ color: "red", fontSize: "0.85rem" }}>{error}</p>}
    </div>
  );
}

export default Login;
