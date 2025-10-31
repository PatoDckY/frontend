import React from "react";
import "../styles/InfoSection.css";

const InfoSection: React.FC = () => {
  return (
    <section className="info-section">
      <div className="info-contenido">
        <h2>Aprendizaje y Desarrollo Infantil</h2>
        <p>
          En nuestro centro, creemos que la salud no solo se trata del bienestar físico,
          sino también del desarrollo integral de cada niño. 
        </p>
        <p>
          Por ello, te invitamos a conocer nuestras <strong>actividades y talleres</strong> inspirados en las teorías de las <strong>inteligencias múltiples</strong>,
          diseñados para estimular habilidades cognitivas, emocionales, sociales y creativas
          de manera divertida y educativa.
        </p>
        <p>
          Descubre cómo a través del <strong>juego</strong>, la <strong>música</strong>, el <strong>arte</strong> y la <strong>exploración</strong>,
          los niños pueden potenciar sus capacidades y aprender disfrutando.
        </p>
      </div>

      <div className="info-imagen">
        <img
          src="/niños.png"
          alt="Niños aprendiendo en actividades educativas"
        />
      </div>
    </section>
  );
};

export default InfoSection;
