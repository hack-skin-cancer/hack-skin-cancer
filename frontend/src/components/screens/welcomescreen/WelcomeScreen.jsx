import React from "react";
import { useNavigate } from "react-router-dom";
import "./WelcomeScreen.css";
import Header from "../../header/Header";
import Main from "../../main/Main";
import Footer from "../../footer/Footer";
import Button from 'react-bootstrap/Button';
import Carousel from 'react-bootstrap/Carousel';
import Card from 'react-bootstrap/Card';

export default function WelcomeScreen() {
    // Navigate
    let navigate = useNavigate();

    // Method to go to input screen
    const goToInputScreen = () => {
        navigate("/input");
    }

    // Render
    return (
        <>
            <Header title="Hackaway at Cancer" subtitle="Welcome" />
            <Main>
                {/* Welcome slides */}
                <Carousel style={{ height: '300px' }} variant="dark">
                    <Carousel.Item>
                        <Card style={{ height: '300px' }}>
                            <Card.Body style={{ paddingLeft: '3rem', paddingRight: '3rem' }}>
                                <Card.Title>Image analysis</Card.Title>
                                <Card.Text>
                                With this app, you are able to upload a mole image that you want to analyze and see a score result to realise if the mole is benign or malignant.
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Carousel.Item>
                    <Carousel.Item>
                        <Card style={{ height: '300px' }}>
                            <Card.Body style={{ paddingLeft: '3rem', paddingRight: '3rem' }}>
                                <Card.Title>Machine learning</Card.Title>
                                <Card.Text>
                                    We use a machine learning process to get the score of the analyzed image. Lots of training models are processed to get the best result.
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Carousel.Item>
                    <Carousel.Item>
                        <Card style={{ height: '300px' }}>
                            <Card.Body style={{ paddingLeft: '3rem', paddingRight: '3rem' }}>
                                <Card.Title>Results</Card.Title>
                                <Card.Text>
                                Not all cancers are found through image scans.  For the most accurate early detection, it is recommended to follow-up with your health care clinician. Melanoma can be treated successfully if it is detected early.
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Carousel.Item>
                    <Carousel.Item>
                        <Card style={{ height: '300px' }}>
                            <Card.Body style={{ paddingLeft: '3rem', paddingRight: '3rem' }}>
                                <Card.Title>Awareness</Card.Title>
                                <Card.Text>
                                This information about the result of your image scan is given to you to raise awareness.  Use this information to discuss with your health care clinician whether other supplemental tests may be appropriate for you.
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Carousel.Item>                    
                </Carousel>

                <hr></hr>

                {/* Forward button */}
                <Button style={{ width: '100%' }} variant="primary" onClick={goToInputScreen}>Start</Button>
            </Main>
            <Footer />
        </>
    );
}
