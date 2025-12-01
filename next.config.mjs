/** @type {import('next').NextConfig} */
const nextConfig = {
  // Activa esto si usas imágenes externas (Google, Facebook, etc)
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // Permitir imágenes externas (cuidado en producción)
      },
    ],
  },

  // 🛡️ AQUÍ ESTÁ LA MAGIA DE LAS RUTAS
  async rewrites() {
    return [
      {
        // 1. Enmascarar el Dashboard
        source: '/asd34dfsdu&ad/home', // Lo que escribe el usuario (URL bonita)
        destination: '/usuarios/admin/screens/Dashboard', // Dónde está realmente el archivo
      },
      {
        // 2. Enmascarar el Login
        source: '/login',
        destination: '/usuarios/visitante/screens/Login', 
      },
      {
        // 3. Enmascarar el Registro
        source: '/registro',
        destination: '/usuarios/visitante/screens/Registro', 
      },
      // Puedes agregar más aquí...
    ];
  },
};

export default nextConfig;