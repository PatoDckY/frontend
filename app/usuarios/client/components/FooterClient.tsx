import "../styles/FooterClient.css";

export default function FooterClient() {
  return (
    <footer className="footer-client">
      <p>© {new Date().getFullYear()} Mi Proyecto - Todos los derechos reservados.</p>
    </footer>
  );
}
