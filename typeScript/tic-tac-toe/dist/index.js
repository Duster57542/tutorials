import { jsx as _jsx } from "react/jsx-runtime";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";
import App from "./app"; // No need to change this import for TypeScript
// Ensure the element exists before attempting to create a root
var rootElement = document.getElementById("root");
if (!rootElement)
    throw new Error("Failed to find the root element");
var root = createRoot(rootElement);
root.render(_jsx(StrictMode, { children: _jsx(App, {}) }));
//# sourceMappingURL=index.js.map