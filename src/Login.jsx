import { useState, useEffect } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const auth = getAuth();

  useEffect(() => {
    document.title = "Calendario de The Wave 🌊🏠";
  }, []);

  const manejarSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
      onLogin(res.user);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="login-container">
      <h1>Calendario de The Wave 🌊🏠</h1>
      <h2>Iniciar sesión</h2>
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
          Entrar
        </button>
      </form>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
}

export default Login;
