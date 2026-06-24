import { createRoot } from "react-dom/client";
import { StrictMode } from "react";
import Store from "./Store.jsx";
import { Provider } from "react-redux";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={Store}>
      <App />
    </Provider>
  </StrictMode>
);
