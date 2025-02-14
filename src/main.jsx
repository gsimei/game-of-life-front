import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthProvider"; // ✅ Agora importando corretamente

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider> {/* Agora, o contexto de autenticação está disponível para toda a aplicação */}
      <App />
    </AuthProvider>
  </StrictMode>
);
