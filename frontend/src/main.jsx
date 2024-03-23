import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App.jsx";
import Test from "./Test.jsx";
import TestTransfer from "./TestTransfer.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      {/* <App /> */}
      <Test />
      <TestTransfer />
    </BrowserRouter>
  </React.StrictMode>
);
