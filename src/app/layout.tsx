import React from "react";
import { AuthProvider } from "../context/AuthContext";
// import "../styles/globals.css";

const RootLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
};

export default RootLayout;
