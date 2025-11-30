import * as React from 'react';
import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Heading,
  Img,
  Hr,
} from '@react-email/components';

interface EmailProps {
  codigoValidacion: string;
  nombreUsuario?: string;
}

export const EmailVerificacion: React.FC<EmailProps> = ({
  codigoValidacion,
  nombreUsuario = 'Usuario',
}) => (
  <Html>
    <Head />
    <Body style={main}>
      <Container style={container}>
        {/* Si tienes un logo hospedado en internet pon la URL aqui */}
        {/* <Img src="https://tudominio.com/logo.png" width="50" height="50" alt="CMP" /> */}
        
        <Heading style={h1}>Centro Médico Pichardo</Heading>
        
        <Text style={text}>Hola, {nombreUsuario}.</Text>
        <Text style={text}>
          Estás a un paso de crear tu cuenta. Usa el siguiente código para verificar tu correo electrónico:
        </Text>

        <Section style={codeContainer}>
          <Heading style={codeText}>{codigoValidacion}</Heading>
        </Section>

        <Text style={text}>
          Este código expirará en 10 minutos. Si no solicitaste este registro, ignora este mensaje.
        </Text>
        
        <Hr style={hr} />
        
        <Text style={footer}>
          Centro Médico Pichardo - Cuidando tu salud.
        </Text>
      </Container>
    </Body>
  </Html>
);

export default EmailVerificacion;

// --- ESTILOS INLINE (CSS) ---
const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
  borderRadius: '8px',
  boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
  maxWidth: '480px',
};

const h1 = {
  color: '#0A3D62', // Tu azul marino
  fontSize: '24px',
  fontWeight: 'bold',
  textAlign: 'center' as const,
  padding: '10px',
};

const text = {
  color: '#444',
  fontSize: '16px',
  lineHeight: '24px',
  textAlign: 'left' as const,
  padding: '0 40px',
};

const codeContainer = {
  background: '#FFC300', // Tu amarillo
  borderRadius: '4px',
  margin: '16px auto',
  width: '180px',
  textAlign: 'center' as const,
};

const codeText = {
  color: '#0A3D62',
  fontSize: '32px',
  fontWeight: '700',
  letterSpacing: '4px',
  paddingTop: '8px',
  paddingBottom: '8px',
  margin: '0',
};

const hr = {
  borderColor: '#e6ebf1',
  margin: '20px 0',
};

const footer = {
  color: '#8898aa',
  fontSize: '12px',
  textAlign: 'center' as const,
};