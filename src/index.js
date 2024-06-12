import React from 'react';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import AllRoutes from "./routing/AllRoutes";
import { render } from "react-dom";
import {
  BrowserRouter,
} from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "primereact/resources/themes/lara-light-cyan/theme.css";
import 'primeicons/primeicons.css';

const rootElement = document.getElementById("root");
render(
  <BrowserRouter>
  <AllRoutes/>
  <ToastContainer />
  </BrowserRouter>,
  rootElement
);
