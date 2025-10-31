import "../styles/HeroPublico.css";

export default function HeroPublico() {
  return (
    <section className="hero-publico">
      <div className="hero-contenido">
        <h1>
          Bienvenido al <span>Centro Médico Pichardo</span>
        </h1>

        <p>
          En el <strong>Centro Médico Pichardo</strong>, liderado por el{" "}
          <strong>Dr. Francisco Javier Moreno Pichardo</strong>, médico pediatra,
          ofrecemos atención médica integral para la salud y el bienestar de los niños de
          <strong> Huejutla de Reyes, Hidalgo</strong>.
        </p>

        <p>
          Nuestro compromiso es brindar un servicio cálido, profesional y humano,
          cuidando cada detalle en el desarrollo y crecimiento saludable de los más pequeños.
          Con un enfoque centrado en la prevención, el diagnóstico oportuno y el
          acompañamiento familiar, trabajamos día a día para crear un espacio de confianza
          donde la salud infantil sea nuestra prioridad.
        </p>
      </div>
    </section>
  );
}
