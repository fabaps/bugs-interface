import { Bricolage_Grotesque, Inter } from "next/font/google";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata = {
  title: "Reportes — RebelCoderz",
  description: "Sistema de reportes de clientes de RebelCoderz",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={`${bricolage.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  );
}
