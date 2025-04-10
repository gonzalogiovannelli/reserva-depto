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
    <div className="login-container">
      <h1>Calendario de The Wave 🌊🏠</h1>
      <h2>{esNuevo ? "Crear cuenta" : "Iniciar sesión"}</h2>
      <form onSubmit={manejarSubmit}>
        <input
          type="email"
          placeholder="Correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="login-input"
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="login-input"
        />
        <button type="submit" className="login-button">
          {esNuevo ? "Crear cuenta" : "Entrar"}
        </button>
      </form>
      <p>
        {esNuevo ? "¿Ya tienes cuenta?" : "¿Eres nuevo?"}{" "}
        <button onClick={() => setEsNuevo(!esNuevo)} className="toggle-button">
          {esNuevo ? "Iniciar sesión" : "Crear cuenta"}
        </button>
      </p>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
}

export default Login;
