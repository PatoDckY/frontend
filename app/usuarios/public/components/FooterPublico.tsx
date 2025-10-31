import "../styles/FooterPublico.css";

export default function FooterPublico() {
  return (
    <footer className="footer-publico">
      <p>© {new Date().getFullYear()} Mi Proyecto - Todos los derechos reservados.</p>
    </footer>
  );
}
