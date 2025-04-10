import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { ref, set } from "firebase/database";
import { db } from "./firebase";
import CalendarioMensual from "./CalendarioMensual";

function App() {
  const [usuario, setUsuario] = useState(null);
  const [meses, setMeses] = useState([]);
  const [rangoInicio, setRangoInicio] = useState(null);
  const [rangoFin, setRangoFin] = useState(null);
  const [nombreOcupante, setNombreOcupante] = useState("");

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUsuario(user);
    });
    return () => unsubscribe();
  }, []);

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

  useEffect(() => {
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

      setRangoInicio(null);
      setRangoFin(null);
      setNombreOcupante("");
    };
    window.addEventListener("confirmarReserva", confirmarReserva);
    return () => window.removeEventListener("confirmarReserva", confirmarReserva);
  }, [rangoInicio, rangoFin, usuario, nombreOcupante]);

  if (!usuario) return <div>Iniciando sesión...</div>;

  return (
    <div style={{ padding: "1rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <h1>Calendario de Reservas 🏠</h1>
        <div>
          <span style={{ marginRight: "1rem", fontWeight: "bold" }}>{usuario.email}</span>
          <button onClick={handleLogout} style={{ padding: "6px 10px" }}>Cerrar sesión</button>
        </div>
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <label>¿Quién va al depto? </label>
        <input
          type="text"
          value={nombreOcupante}
          onChange={(e) => setNombreOcupante(e.target.value)}
          placeholder="yo / otro nombre"
        />
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
