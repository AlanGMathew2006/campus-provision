import type { ReactNode } from "react";

import "./globals.css";
import { AuthProvider } from "../context/AuthContext";
import Navbar from "../components/layout/navbar";

export const metadata = {
  title: "Campus Provision",
  description: "Campus Provision web app",
};

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Navbar />
          <main className="cp-main">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
