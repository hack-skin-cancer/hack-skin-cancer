import React, { useState } from "react";
import "./OutputScreen.css";
import Header from "../../header/Header";
import Main from "../../main/Main";
import Footer from "../../footer/Footer";
import ProgressBar from 'react-bootstrap/ProgressBar';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image'
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

export default function OutputScreen() {
    const [score, setScore] = useState(50);

    const goToInputScreen = () => {
        window.location="/input";
    }

    return (
        <>
            <Header title="Hackaway at Cancer" subtitle="Results" />
            <Main>
                <Card>
                    <Card.Body>
                        <Container fluid className="result">
                            <Row>
                                <Col>
                                    <Image src="images/th-down.png"></Image>
                                </Col>
                                <Col xs={6} className="vertical-center">
                                    {score <= 33 && <ProgressBar style={{ height: 30 }} variant="danger" animated now={score} />}
                                    {score > 33 && score <= 66 && <ProgressBar style={{ height: 30 }} variant="warning" animated now={score} />}
                                    {score > 66 && <ProgressBar style={{ height: 30 }} variant="success" animated now={score} />}
                                </Col>
                                <Col>
                                    <Image src="images/th-up.png"></Image>
                                </Col>
                            </Row>
                        </Container><hr></hr>

                        <Card.Title>Score: {score}</Card.Title>
                        <Card.Text>
                            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                        </Card.Text>
                        <Button variant="primary" onClick={goToInputScreen}>Back</Button>
                    </Card.Body>
                </Card>

            </Main>
            <Footer note="Microsoft" />
        </>
    );
}
