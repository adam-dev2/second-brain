import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { Toaster } from "react-hot-toast";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <>
      <App />
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: "#000000",
            color: "#ffffff",
            borderRadius: "8px",
            padding: "12px 16px",
          },
          success: {
            style: {
              background: "#ffffff",
              color: "#000000",
              border: "1px solid #000000",
            },
            iconTheme: {
              primary: "#000000",
              secondary: "#ffffff",
            },
          },
          error: {
            style: {
              background: "#000000",
              color: "#ffffff",
              border: "1px solid #ef4444",
            },
            iconTheme: {
              primary: "#ef4444",
              secondary: "#000000",
            },
          },
        }}
      />
    </>
  </StrictMode>
);
