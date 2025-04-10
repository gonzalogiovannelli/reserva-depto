import { useState, useEffect } from "react";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [esNuevo, setEsNuevo] = useState(false);
  const [error, setError] = useState("");

  const auth = getAuth();

  useEffect(() => {
    document.title = "Calendario de The Wave 🌊🏠";
  }, []);

  const manejarSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (esNuevo) {
        const res = await createUserWithEmailAndPassword(auth, email, password);
        onLogin(res.user);
      } else {
        const res = await signInWithEmailAndPassword(auth, email, password);
        onLogin(res.user);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "400px", margin: "auto", textAlign: "center" }}>
      <h2>{esNuevo ? "Crear cuenta" : "Iniciar sesión"}</h2>
      <form onSubmit={manejarSubmit}>
        <input
          type="email"
          placeholder="Correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ width: "100%", padding: "0.5rem", marginBottom: "0.5rem" }}
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ width: "100%", padding: "0.5rem", marginBottom: "0.5rem" }}
        />
        <button type="submit" style={{ width: "100%", padding: "0.5rem", backgroundColor: "#007bff", color: "white" }}>
          {esNuevo ? "Crear cuenta" : "Entrar"}
        </button>
      </form>
      <p>
        {esNuevo ? "¿Ya tienes cuenta?" : "¿Eres nuevo?"}{" "}
        <button onClick={() => setEsNuevo(!esNuevo)} style={{ color: "#007bff", background: "none", border: "none" }}>
          {esNuevo ? "Iniciar sesión" : "Crear cuenta"}
        </button>
      </p>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default Login;
