import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
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
import Modal from 'react-bootstrap/Modal';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { FaExclamationCircle, FaInfo } from 'react-icons/fa';

export default function OutputScreen() {
    // Navigate
    let navigate = useNavigate();

    // States    
    const [score, setScore] = useState(50);
    const [searchParams, setSearchParams] = useSearchParams({});
    const [showRedResult, setShowRedResult] = useState(false);
    const [showYellowResult, setShowYellowResult] = useState(false);
    const [showGreenResult, setShowGreenResult] = useState(false);
    const [diclaimerShow, setDiclaimerShow] = useState(false);

    // Handlers
    const handleShowRedResult = () => setShowRedResult(false);
    const handleShowYellowResult = () => setShowYellowResult(false);
    const handleShowGreenResult = () => setShowGreenResult(false);
    const handleDiclaimerClose = () => setDiclaimerShow(false);
    const handleDiclaimerShow = () => setDiclaimerShow(true);

    // Method to redirect screen to input
    const goToInputScreen = () => {
        navigate("/input");
    }

    // Populate score state with previous results
    useEffect(() => {
        setScore(searchParams.get("score"));
    }, []);

    // Show color modal related
    const showColorModal = () => {
        if (score <= 33) {
            setShowRedResult(true);
        }
        else {
            if (score > 33 && score <= 66) {
                setShowYellowResult(true);
            }
            else {
                setShowGreenResult(true);
            }
        }
    };

    // Render
    return (
        <>
            <Header title="Hackaway at Cancer" subtitle="Results" />
            <Main>
                <Card>
                    <Card.Body>
                        {/* Graphic results */}
                        <Container fluid className="result">
                            <Row>
                                <Col>
                                    <Image src="images/th-down.png"></Image>
                                </Col>
                                <Col xs={6} style={{
                                    padding: "10px",
                                    backgroundImage: "url(/images/vertical-separator.png)",
                                    backgroundSize: "100% 100%",
                                    
                                }} className="vertical-center">
                                    {score <= 33 && <ProgressBar style={{ height: 30 }} variant="danger" animated now={score} />}
                                    {score > 33 && score <= 66 && <ProgressBar style={{ height: 30 }} variant="warning" animated now={score} />}
                                    {score > 66 && <ProgressBar style={{ height: 30 }} variant="success" animated now={score} />}
                                </Col>
                                <Col>
                                    <Image src="images/th-up.png"></Image>
                                </Col>
                            </Row>
                        </Container><hr></hr>

                        {/* Score details */}
                        <Card.Title>Score: {Number(score).toFixed(2)}%&nbsp;&nbsp;<Button size="sm" variant="outline-info" onClick={() => handleDiclaimerShow()}><FaExclamationCircle />&nbsp;&nbsp;Disclaimer</Button></Card.Title>

                        {score <= 33 && <Card.Text>
                            The image scan shows an abnormality that we believe requires further investigation.  It is recommended that you follow-up with your health care clinician.
                            &nbsp;&nbsp;<Button size="sm" variant="info" onClick={() => showColorModal()}>More info...</Button>
                        </Card.Text>}

                        {/* Yellow modal with message */}
                        {score > 33 && score <= 66 && <Card.Text>
                            The image scan shows an abnormality that we believe is inconclusive.  Image scans can be best assessed with quality images.  Use these tips for better photos of your skin.
                            &nbsp;&nbsp;<Button size="sm" variant="info" onClick={() => showColorModal()}>More info...</Button>
                        </Card.Text>}

                        {/* Green modal with message */}
                        {score > 66 && <Card.Text>
                            The image scan shows an area that we believe is probably benign (not cancer). However, the only way you can be sure is to have a follow up exam with your health care clinician.
                            &nbsp;&nbsp;<Button size="sm" variant="info" onClick={() => showColorModal()}>More info...</Button>
                        </Card.Text>}

                        
                        

                        {/* Red modal with message */}
                        {score <= 33 && <Modal show={showRedResult} onHide={handleShowRedResult} centered>
                            <Modal.Header style={{ backgroundColor: "#FF745B" }} closeButton>
                                <Modal.Title>Score: {score}</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>Score values fall into the expected result ranges to determine whether the skin image is likely to be of concern, likely to not be of concern, or in between. Score values not in the green range do not necessarily indicate disease, but the only way you can be sure is to see your health care clinician. The image scan shows an abnormality that we believe requires further investigation.  It is recommended that you follow-up with your health care clinician. An image scan of concern should not be ignored.  If you notice any skin changes that seem unusual, you should bring them to your health care clinician's attention immediately. This information about the result of your image scan is given to you to raise awareness.  Use this information to discuss with your health care clinician whether further investigation or tests may be appropriate for you. Not all cancers are found through image scans.  For the most accurate early detection, it is recommended to follow-up with your health care clinician for a thorough examination. A thorough examination includes a combination of physical examination, individual risk factors, discussion of symptoms such as when the mark on the skin first appeared, if it has changed in size or appearance, and if it has been painful, itchy, or bleeding.</Modal.Body>
                        </Modal>}

                        {/* Yellow modal with message */}
                        {score > 33 && score <= 66 && <Modal show={showYellowResult} onHide={handleShowYellowResult} centered>
                            <Modal.Header style={{ backgroundColor: "#FFDB86" }} closeButton>
                                <Modal.Title>Score: {score}</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>Score values fall into the expected result ranges to determine whether the skin image is likely to be of concern, likely to not be of concern, or in between. Score values not in the green range do not necessarily indicate disease, but the only way you can be sure is to see your health care clinician. The image scan shows an abnormality that we believe is inconclusive.  Image scans can be best assessed with quality images.  Use these tips for better photos of your skin. Because the scan is inconclusive, it is recommended that you follow-up with your health care clinician. This information about the result of your image scan is given to you to raise awareness.  Use this information to discuss with your health care clinician whether other supplemental tests may be appropriate for you. Not all cancers are found through image scans.  For the most accurate early detection, it is recommended to follow-up with your health care clinician for a thorough examination. A thorough examination includes a combination of physical examination, individual risk factors, discussion of symptoms such as when the mark on the skin first appeared, if it has changed in size or appearance, and if it has been painful, itchy, or bleeding.</Modal.Body>
                        </Modal>}

                        {/* Green modal with message */}
                        {score > 66 && <Modal show={showGreenResult} onHide={handleShowGreenResult} centered>
                            <Modal.Header style={{ backgroundColor: "#24C960" }} closeButton>
                                <Modal.Title>Score: {Number(score).toFixed(2)}%</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>Score values fall into the expected result ranges to determine whether the skin image is likely to be of concern, likely to not be of concern, or in between. Score values not in the green range do not necessarily indicate disease, but the only way you can be sure is to see your health care clinician. The image scan shows an area that we believe is probably benign (not cancer). However, the only way you can be sure is to have a follow up exam with your health care clinician. This information about the result of your image scan is given to you to raise awareness.  Use this information to discuss with your health care clinician whether further investigation or tests may be appropriate for you. Not all cancers are found through image scans.  For the most accurate early detection, it is recommended to follow-up with your health care clinician. Melanoma can be treated successfully if it is detected early.</Modal.Body>
                        </Modal>}

                        {/* Back button */}
                        <Button style={{ width: '100%' }} variant="primary" onClick={goToInputScreen}>Back</Button>
                    </Card.Body>
                </Card>
                {/* Disclamer section */}
                <Offcanvas style={{ height: "300px" }} show={diclaimerShow} onHide={handleDiclaimerClose} placement={'bottom'}>
                    <Offcanvas.Header closeButton>
                        <Offcanvas.Title>Disclaimer</Offcanvas.Title>
                    </Offcanvas.Header>
                    <Offcanvas.Body>
                        This model/application is intended for research and development use only. The model/application is not intended for use in clinical diagnosis or clinical decision-making or for any other clinical use and the performance of the model/application for clinical use has not been established.
                    </Offcanvas.Body>
                </Offcanvas>
            </Main>
            <Footer />
        </>
    );
}
