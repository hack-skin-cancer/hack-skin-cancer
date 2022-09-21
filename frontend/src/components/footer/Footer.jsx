import React, { useState } from "react";
import "./Footer.css";
import Image from 'react-bootstrap/Image'
import Container from 'react-bootstrap/Container';
import Offcanvas from 'react-bootstrap/Offcanvas';

export default function Header(props) {
  // States
  const [show, setShow] = useState(false);

  // Handlers
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // Render
  return (
    <>
      {/* Microsoft logo image */}
      <Container fluid className="footer" onClick={handleShow}>
        <Image src="images/Microsoft-logo_rgb_c-wht.png"></Image>
      </Container>
      
      {/* Disclamer section */}
      <Offcanvas show={show} onHide={handleClose} placement={'bottom'}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Disclaimer</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          This model/application is intended for research and development use only. The model/application is not intended for use in clinical diagnosis or clinical decision-making or for any other clinical use and the performance of the model/application for clinical use has not been established.
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}
