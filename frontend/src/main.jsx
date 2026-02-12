import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BASE_URL } from "./config/api.config.js";
import "./index.css";
import App from "./App.jsx";

const normalizeBrokenUploadSrc = (value) => {
  if (typeof value !== "string") return value;
  if (value.startsWith("data:") || value.startsWith("blob:")) return value;

  const uploadsIndex = value.indexOf("/uploads/");
  if (uploadsIndex !== -1) {
    if (
      value.includes(".mercadoturismo.ar/api/uploads/") ||
      value.includes("/api/uploads/")
    ) {
      return `${BASE_URL}${value.slice(uploadsIndex)}`;
    }
  }

  // Normalize malformed values like "https:/.mercadoturismo.ar/api/uploads/..."
  if (
    (value.startsWith("https:/") || value.startsWith("http:/")) &&
    !value.startsWith("https://") &&
    !value.startsWith("http://")
  ) {
    if (uploadsIndex !== -1) {
      return `${BASE_URL}${value.slice(uploadsIndex)}`;
    }
  }

  return value;
};

const patchImageSrcNormalization = () => {
  if (typeof HTMLImageElement === "undefined") return;

  const descriptor = Object.getOwnPropertyDescriptor(
    HTMLImageElement.prototype,
    "src",
  );

  if (descriptor?.get && descriptor?.set) {
    Object.defineProperty(HTMLImageElement.prototype, "src", {
      configurable: true,
      enumerable: descriptor.enumerable ?? true,
      get() {
        return descriptor.get.call(this);
      },
      set(v) {
        return descriptor.set.call(this, normalizeBrokenUploadSrc(v));
      },
    });
  }

  const originalSetAttribute = HTMLImageElement.prototype.setAttribute;
  HTMLImageElement.prototype.setAttribute = function (name, value) {
    if (String(name).toLowerCase() === "src") {
      return originalSetAttribute.call(
        this,
        name,
        normalizeBrokenUploadSrc(value),
      );
    }
    return originalSetAttribute.call(this, name, value);
  };
};

patchImageSrcNormalization();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
