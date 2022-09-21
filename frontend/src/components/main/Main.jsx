import React from "react";
import "./Main.css";
import Container from 'react-bootstrap/Container';

export default function Header(props) {
  // Render
  return (
    // Container with children
    <Container fluid className="main">
      {props.children}
    </Container>
  );
}

