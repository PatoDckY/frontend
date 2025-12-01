import * as React from 'react';
import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Heading,
  Button,
  Hr,
  Img,
} from '@react-email/components';

interface EmailRecuperacionProps {
  nombre?: string;
  url: string; // El enlace mágico que generamos en el backend
}

export const EmailRecuperacion: React.FC<EmailRecuperacionProps> = ({
  nombre = 'Usuario',
  url,
}) => (
  <Html>
    <Head />
    <Body style={main}>
      <Container style={container}>
        {/* Si tienes un logo en la web, pon la URL aquí. Si no, puedes borrar el Img */}
        {/* <Img src="https://tusitio.com/logo.png" width="50" height="50" alt="CMP" /> */}
        
        <Heading style={h1}>Restablecer Contraseña</Heading>
        
        <Text style={text}>Hola, {nombre}.</Text>
        <Text style={text}>
          Hemos recibido una solicitud para cambiar la contraseña de tu cuenta en <strong>Centro Médico Pichardo</strong>.
        </Text>

        <Section style={buttonContainer}>
          <Button style={button} href={url}>
            Cambiar mi Contraseña
          </Button>
        </Section>

        <Text style={text}>
          O copia y pega este enlace en tu navegador:
          <br />
          <span style={link}>{url}</span>
        </Text>

        <Hr style={hr} />

        <Text style={alertText}>
          ⚠️ <strong>Importante:</strong> Este enlace expirará en <strong>15 minutos</strong> por seguridad.
        </Text>
        <Text style={alertText}>
          Si tú no solicitaste este cambio, puedes ignorar este correo y tu contraseña seguirá siendo la misma.
        </Text>
        
        <Text style={footer}>
          Centro Médico Pichardo - Cuidando tu salud.
        </Text>
      </Container>
    </Body>
  </Html>
);

export default EmailRecuperacion;

// --- ESTILOS (CSS Inline para Emails) ---
const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '40px 20px',
  marginBottom: '64px',
  borderRadius: '8px',
  boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
  maxWidth: '500px',
};

const h1 = {
  color: '#0A3D62', // Tu Azul Marino
  fontSize: '24px',
  fontWeight: 'bold',
  textAlign: 'center' as const,
  margin: '0 0 20px',
};

const text = {
  color: '#444',
  fontSize: '16px',
  lineHeight: '24px',
  textAlign: 'left' as const,
  marginBottom: '20px',
};

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '30px 0',
};

const button = {
  backgroundColor: '#FFC300', // Tu Amarillo Vibrante
  borderRadius: '50px',
  color: '#0A3D62', // Texto Azul
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '14px 30px',
  boxShadow: '0 4px 10px rgba(255, 195, 0, 0.3)',
};

const link = {
  color: '#0A3D62',
  textDecoration: 'underline',
  fontSize: '14px',
  wordBreak: 'break-all' as const, // Para que el link largo no rompa el diseño
};

const alertText = {
  color: '#6B7280',
  fontSize: '14px',
  lineHeight: '20px',
  marginBottom: '10px',
};

const hr = {
  borderColor: '#e6ebf1',
  margin: '30px 0',
};

const footer = {
  color: '#8898aa',
  fontSize: '12px',
  textAlign: 'center' as const,
  marginTop: '20px',
};