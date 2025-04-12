import React, { useEffect, useState } from "react";
import "./CalendarioMensual.css";

function CalendarioMensual({ year, month, reservas, cancelarReserva, usuario }) {
  const [diasDelMes, setDiasDelMes] = useState([]);
  const [diaSeleccionado, setDiaSeleccionado] = useState(null);

  const diasSemana = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

  useEffect(() => {
    const dias = [];
    const primerDiaDelMes = new Date(year, month, 1);
    const diaSemanaInicio = primerDiaDelMes.getDay();
    const ultimoDia = new Date(year, month + 1, 0);
    const totalDias = ultimoDia.getDate();

    for (let i = 0; i < diaSemanaInicio; i++) {
      dias.push({ fecha: null, clave: `vacio-${i}`, estado: "vacio" });
    }

    for (let d = 1; d <= totalDias; d++) {
      const fechaTexto = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      const reserva = reservas[fechaTexto];
      dias.push({
        fecha: d,
        clave: fechaTexto,
        estado: reserva ? "ocupado" : "libre",
        reservadoPor: reserva?.reservadoPor || null,
        ocupadoPor: reserva?.ocupadoPor || null,
      });
    }

    setDiasDelMes(dias);
  }, [year, month, reservas]);

  const seleccionarDia = (dia) => {
    setDiaSeleccionado(dia);
    const boton = document.getElementById("boton-cancelar");
    boton.classList.add("visible");
  };

  const cancelarReservaFlotante = () => {
    if (diaSeleccionado) {
      cancelarReserva(diaSeleccionado);
      setDiaSeleccionado(null);
      const boton = document.getElementById("boton-cancelar");
      boton.classList.remove("visible");
    }
  };

  return (
    <div className="calendario">
      <h3>{new Date(year, month).toLocaleString("default", { month: "long", year: "numeric" })}</h3>
      <div className="grilla">
        {diasSemana.map((dia, i) => (
          <div key={`encabezado-${i}`} className="encabezado-dia">{dia}</div>
        ))}
        {diasDelMes.map((dia, i) => {
          if (dia.estado === "vacio") {
            return <div key={dia.clave} className="dia dia-vacio"></div>;
          }

          const esUsuario = dia.reservadoPor === usuario.email;

          return (
            <div
              key={i}
              className={`dia ${dia.estado}`}
              onClick={() => esUsuario && seleccionarDia(dia.clave)}
            >
              <div className="numero-dia">{dia.fecha}</div>
              {dia.estado === "ocupado" && (
                <div className="ocupado-nombre">{dia.ocupadoPor}</div>
              )}
            </div>
          );
        })}
      </div>

      {/* Botón flotante para cancelar reservas */}
      <button
        className="boton-flotante-cancelar"
        id="boton-cancelar"
        onClick={cancelarReservaFlotante}
      >
        Cancelar
      </button>
    </div>
  );
}

export default CalendarioMensual;
