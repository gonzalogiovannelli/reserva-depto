import { useState } from "react";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";

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
    <div style={{ padding: "2rem", maxWidth: "400px", margin: "auto" }}>
      <h2>{esNuevo ? "Crear cuenta" : "Iniciar sesión"}</h2>
      <form onSubmit={manejarSubmit}>
        <input
          type="email"
          placeholder="Correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ width: "100%", marginBottom: "0.5rem" }}
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ width: "100%", marginBottom: "0.5rem" }}
        />
        <button type="submit" style={{ width: "100%", marginBottom: "0.5rem" }}>
          {esNuevo ? "Crear cuenta" : "Entrar"}
        </button>
      </form>

      <p style={{ textAlign: "center", fontSize: "0.9rem" }}>
        {esNuevo ? "¿Ya tenés cuenta?" : "¿Sos nuevo?"}{" "}
        <button onClick={() => setEsNuevo(!esNuevo)} style={{ fontSize: "0.9rem" }}>
          {esNuevo ? "Iniciar sesión" : "Crear cuenta"}
        </button>
      </p>

      {error && <p style={{ color: "red", fontSize: "0.85rem" }}>{error}</p>}
    </div>
  );
}

export default Login;
