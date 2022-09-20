import React from "react";
import { render } from 'react-dom';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./index.css";

const rootElement = document.getElementById("root")
render(<App />, rootElement)
