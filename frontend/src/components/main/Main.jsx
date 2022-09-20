import React from "react";
import "./Main.css";
import Container from 'react-bootstrap/Container';

export default function Header(props) {
  return (
    <Container fluid className="main">
      {props.children}
    </Container>
  );
}

