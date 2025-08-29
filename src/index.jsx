import "core-js/stable";
import "regenerator-runtime/runtime"; // Move this to the very top
import process from "process";
window.process = process;
import ReactDOM from "react-dom/client";
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { BrowserRouter } from "react-router-dom";
import RouterElement from "./routes/RouterElement";
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter basename="/" >
    <RouterElement />
  </BrowserRouter>
);
