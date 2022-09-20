import React, { useEffect, useState, useRef } from "react";
import "./WelcomeScreen.css";
import Header from "../../header/Header";
import Main from "../../main/Main";
import Footer from "../../footer/Footer";
import Button from 'react-bootstrap/Button';
import Carousel from 'react-bootstrap/Carousel';
import Card from 'react-bootstrap/Card';

export default function WelcomeScreen() {
    const goToInputScreen = () => {
        window.location = "/input";
    }

    return (
        <>
            <Header title="Hackaway at Cancer" subtitle="Welcome" />
            <Main>
                <Carousel style={{height:'300px'}} variant="dark">
                    <Carousel.Item>
                        <Card style={{height:'300px'}}>
                            <Card.Body style={{paddingLeft:'3rem', paddingRight:'3rem'}}>
                                <Card.Title>Card Title</Card.Title>
                                <Card.Text>
                                    Some quick example text to build on the card title and make up the
                                    bulk of the card's content.
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Carousel.Item>
                    <Carousel.Item>
                        <Card style={{height:'300px'}}>
                            <Card.Body style={{paddingLeft:'3rem', paddingRight:'3rem'}}>
                                <Card.Title>Card Title</Card.Title>
                                <Card.Text>
                                    Some quick example text to build on the card title and make up the
                                    bulk of the card's content.
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Carousel.Item>
                </Carousel>
                <hr></hr>
                <Button style={{width:'100%'}} variant="primary" onClick={goToInputScreen}>Start</Button>
            </Main>
            <Footer note="Microsoft" />
        </>
    );
}
