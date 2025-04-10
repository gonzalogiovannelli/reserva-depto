import React, { useEffect, useState } from "react";
import { ref, onValue, remove } from "firebase/database";
import { db } from "./firebase";
import "./CalendarioMensual.css";

function CalendarioMensual({ year, month, rangoInicio, rangoFin, seleccionarDia, enRango, usuario }) {
  const [diasDelMes, setDiasDelMes] = useState([]);
  const [tooltipDia, setTooltipDia] = useState(null);

  const diasSemana = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

  useEffect(() => {
    const dias = [];
    const primerDiaDelMes = new Date(year, month, 1);
    const diaSemanaInicio = primerDiaDelMes.getDay();
    const ultimoDia = new Date(year, month + 1, 0);
    const totalDias = ultimoDia.getDate();

    // Agregar espacios vacíos antes del primer día del mes
    for (let i = 0; i < diaSemanaInicio; i++) {
      dias.push({
        fecha: null,
        clave: `vacio-${i}`,
        estado: "vacio",
      });
    }

    // Agregar días del mes
    for (let d = 1; d <= totalDias; d++) {
      const fechaTexto = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      dias.push({
        fecha: d,
        clave: fechaTexto,
        estado: "libre",
        reservadoPor: null,
        ocupadoPor: null,
      });
    }

    // Leer datos de Firebase
    const reservasRef = ref(db, "reservas");
    onValue(reservasRef, (snapshot) => {
      const data = snapshot.val() || {};
      const actualizados = dias.map((dia) => {
        if (dia.estado === "vacio") return dia;
        const reserva = data[dia.clave];
        return {
          ...dia,
          estado: reserva ? "ocupado" : "libre",
          reservadoPor: reserva?.reservadoPor || null,
          ocupadoPor: reserva?.ocupadoPor || null,
        };
      });
      setDiasDelMes(actualizados);
    });
  }, [year, month]);

  const cancelarReserva = (clave) => {
    const confirmacion = window.confirm("¿Estás seguro de que querés cancelar esta reserva?");
    if (confirmacion) {
      const reservaRef = ref(db, `reservas/${clave}`);
      remove(reservaRef).then(() => {
        alert("Reserva cancelada");
        setTooltipDia(null);
      });
    }
  };

  return (
    <div className="calendario">
      <h3>{fechaEnTexto(year, month)} ({month + 1}/{year})</h3>
      <div className="grilla">
        {diasSemana.map((dia, i) => (
          <div key={`encabezado-${i}`} className="encabezado-dia">{dia}</div>
        ))}
        {diasDelMes.map((dia, i) => {
          if (dia.estado === "vacio") {
            return <div key={dia.clave} className="dia dia-vacio"></div>;
          }

          const clase = enRango(dia.clave) ? "seleccionado" : dia.estado;
          const esMio = dia.reservadoPor === usuario?.email;

          return (
            <div
              key={i}
              className={`dia ${clase}`}
              onClick={() => {
                if (dia.estado === "libre") {
                  seleccionarDia(dia.clave);
                } else if (dia.estado === "ocupado") {
                  setTooltipDia(dia);
                  setTimeout(() => setTooltipDia(null), 4000);
                }
              }}
            >
              <div className="numero-dia">{dia.fecha}</div>
              {dia.estado === "ocupado" && (
                <div className="ocupado-nombre" title={dia.ocupadoPor}>
                  {dia.ocupadoPor} {/* Muestra el nombre o correo del ocupante */}
                </div>
              )}
              {tooltipDia?.clave === dia.clave && (
                <div className="tooltip-reserva">
                  <strong>Reservado por:</strong> {dia.reservadoPor}<br />
                  <strong>Ocupado por:</strong> {dia.ocupadoPor}<br />
                  {esMio && (
                    <button className="btn-cancelar" onClick={() => cancelarReserva(dia.clave)}>
                      Cancelar
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {rangoInicio && rangoFin && (
        <button
          onClick={() => {
            const evento = new CustomEvent("confirmarReserva");
            window.dispatchEvent(evento);
          }}
          className="boton-flotante"
        >
          Confirmar reserva
        </button>
      )}
    </div>
  );
}

function fechaEnTexto(year, month) {
  return new Date(year, month).toLocaleString("default", {
    month: "long",
    year: "numeric",
  });
}

export default CalendarioMensual;
