import React, { useState } from "react";
import "./Footer.css";
import Image from 'react-bootstrap/Image'
import Container from 'react-bootstrap/Container';

export default function Header(props) {
  // Render
  return (
    <>
      {/* Microsoft logo image */}
      <Container fluid className="footer">
        <Image src="images/Microsoft-logo_rgb_c-wht.png"></Image>
      </Container>
    </>
  );
}
