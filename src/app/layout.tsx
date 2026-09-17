import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Radar de regulación | Truora",
    template: "%s | Radar de regulación · Truora",
  },
  description:
    "La página donde puedes entender todos los cambios que tiene LATAM a nivel regulatorio y cómo esto afecta a tu industria.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
