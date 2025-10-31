import "./globals.css";
import { Open_Sans, Lato, Merriweather } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const openSans = Open_Sans({ subsets: ["latin"], weight: ["300", "400", "500", "600"] });
const lato = Lato({ subsets: ["latin"], weight: ["400"] });
const merriweather = Merriweather({ subsets: ["latin"], weight: ["400"] });

export const metadata = {
  title: "Centro Medico Pichardo",
  description: "Proyecto de sistema de gestion para un centro medico",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={`${openSans.className} ${lato.className} ${merriweather.className}`}>
        {children}
        <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
        <ToastContainer position="top-right" autoClose={3000} theme="colored" />
      </body>
    </html>
  );
}

