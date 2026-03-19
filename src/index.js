import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles/variables.css";
import "./styles/core.css";
import "./styles/animations.css";

// Apply theme before first paint. Default is dark.
const savedTheme =
  typeof localStorage !== "undefined" ? localStorage.getItem("theme") : null;
const initialTheme =
  savedTheme === "light" || savedTheme === "dark" ? savedTheme : "dark";
document.body.setAttribute("theme", initialTheme);
document.documentElement.classList.add(initialTheme);
document.documentElement.classList.remove(
  initialTheme === "dark" ? "light" : "dark"
);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
