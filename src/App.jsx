import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { ref, set } from "firebase/database";
import { db } from "./firebase";
import CalendarioMensual from "./CalendarioMensual";

// Componente principal de la aplicación
function App() {
  const [usuario, setUsuario] = useState(null);
  const [meses, setMeses] = useState([]);
  const [rangoInicio, setRangoInicio] = useState(null);
  const [rangoFin, setRangoFin] = useState(null);
  const [nombreOcupante, setNombreOcupante] = useState("");
  const [email, setEmail] = useState(""); // Estado para el email
  const [password, setPassword] = useState(""); // Estado para la contraseña
  const [isLogin, setIsLogin] = useState(true); // Estado para saber si es login o registro
  const [cargando, setCargando] = useState(true); // Estado para el proceso de carga

  // Controlador para el cambio del email
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  // Controlador para el cambio de la contraseña
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  // Verifica el estado de autenticación
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUsuario(user);
      } else {
        setUsuario(null);
      }
      setCargando(false); // Una vez que verificamos el estado de autenticación
    });

    return () => unsubscribe(); // Limpiar la suscripción cuando el componente se desmonte
  }, []);

  // Función para iniciar sesión con correo y contraseña
  const login = async () => {
    try {
      await signInWithEmailAndPassword(getAuth(), email, password);
    } catch (error) {
      alert("Error al iniciar sesión: " + error.message);
    }
  };

  // Función para registrar un nuevo usuario
  const register = async () => {
    try {
      await createUserWithEmailAndPassword(getAuth(), email, password);
    } catch (error) {
      alert("Error al registrarse: " + error.message);
    }
  };

  // Generamos los meses desde el mes actual hasta los siguientes 12 meses
  useEffect(() => {
    const hoy = new Date();
    hoy.setDate(1); // Aseguramos que empecemos desde el primer día del mes actual.
    const inicio = new Date(hoy);

    const lista = [];
    for (let i = 0; i <= 12; i++) {
      const fecha = new Date(inicio);
      fecha.setMonth(fecha.getMonth() + i);

      lista.push({
        year: fecha.getFullYear(),
        month: fecha.getMonth(),
      });
    }
    setMeses(lista);
  }, []);

  const seleccionarDia = (clave) => {
    if (!rangoInicio || (rangoInicio && rangoFin)) {
      setRangoInicio(clave);
      setRangoFin(null);
    } else {
      if (clave > rangoInicio) {
        setRangoFin(clave);
      } else {
        setRangoInicio(clave);
        setRangoFin(null);
      }
    }
  };

  const enRango = (clave) => {
    if (!rangoInicio) return false;
    if (!rangoFin) return clave === rangoInicio;
    return clave >= rangoInicio && clave <= rangoFin;
  };

  const handleLogout = () => {
    const auth = getAuth();
    signOut(auth).then(() => {
      setUsuario(null);
    });
  };

  // Función que se dispara cuando se confirma la reserva
  const confirmarReserva = () => {
    if (!rangoInicio || !rangoFin || !usuario) return;

    const nombre = nombreOcupante.trim().toLowerCase() === "yo"
      ? usuario.displayName || usuario.email
      : nombreOcupante.trim();

    let fecha = rangoInicio;
    while (fecha <= rangoFin) {
      const refReserva = ref(db, `reservas/${fecha}`);
      set(refReserva, {
        reservadoPor: usuario.email,
        ocupadoPor: nombre,
      });

      const siguiente = new Date(fecha);
      siguiente.setDate(siguiente.getDate() + 1);
      fecha = siguiente.toISOString().slice(0, 10);
    }

    // Restablecer el rango de fechas después de la confirmación
    setRangoInicio(null);
    setRangoFin(null);
    setNombreOcupante("");
  };

  if (cargando) return <div>Iniciando sesión...</div>;

  if (!usuario) {
    return (
      <div className="login-container">
        <h1>{isLogin ? "Iniciar sesión" : "Registrarse"}</h1>
        
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={handleEmailChange}
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={handlePasswordChange}
          onKeyDown={(e) => e.key === "Enter" && login()}  // Capturamos el Enter para login
        />
        
        {isLogin ? (
          <button onClick={login}>Iniciar sesión</button>
        ) : (
          <button onClick={register}>Registrarse</button>
        )}

        <button onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? "¿No tienes cuenta? Regístrate" : "¿Ya tienes cuenta? Inicia sesión"}
        </button>
      </div>
    );
  }

  return (
    <div className="calendario">
      <div className="header">
        <h1>Calendario de Reservas 🏠</h1>
        <span className="email">{usuario.email}</span>
        <button onClick={handleLogout} className="btn-logout">Cerrar sesión</button>
      </div>

      {rangoInicio && rangoFin && (
        <div style={{ marginBottom: "1rem" }}>
          <label>¿Quién va al depto? </label>
          <input
            type="text"
            value={nombreOcupante}
            onChange={(e) => setNombreOcupante(e.target.value)}
            placeholder="yo / otro nombre"
          />
        </div>
      )}

      <div style={{ marginBottom: "1rem" }}>
        <button
          onClick={confirmarReserva} // Llamamos a la función confirmarReserva cuando el usuario hace clic
          style={{ padding: "10px 20px", fontSize: "16px", backgroundColor: "#1976d2", color: "white" }}
        >
          Confirmar reserva
        </button>
      </div>

      {meses.map(({ year, month }) => (
        <div key={`${year}-${month}`}>
          <CalendarioMensual
            year={year}
            month={month}
            rangoInicio={rangoInicio}
            rangoFin={rangoFin}
            seleccionarDia={seleccionarDia}
            enRango={enRango}
            usuario={usuario}
          />
        </div>
      ))}
    </div>
  );
}

export default App;
