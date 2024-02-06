import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import Test from "./test.jsx";
import "./index.css";
import TestIcon from "./components/rows3/TestIcon.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
    <Test />
  </React.StrictMode>
);
