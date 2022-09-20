import React from "react";
import "./Header.css";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Image from 'react-bootstrap/Image'
import Navbar from 'react-bootstrap/Navbar';

export default function Header(props) {
  return (
    <>
      <Container fluid className="header">
        <Row>
          <Navbar.Brand href="input">
            <Image
              src="images/hackathon-logo-1.svg"
            />
            {props.title}
          </Navbar.Brand>
        </Row>
        <Row>
          <p className="subtitle">{props.subtitle}</p>
        </Row>
      </Container>
    </>
  );
}
