import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./InputScreen.css";
import Header from "../../header/Header";
import Main from "../../main/Main";
import Footer from "../../footer/Footer";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Accordion from 'react-bootstrap/Accordion';
import Modal from 'react-bootstrap/Modal';
import Spinner from 'react-bootstrap/Spinner';
import Badge from 'react-bootstrap/Badge';
import axios from "axios";
import Table from 'react-bootstrap/Table';
import Image from 'react-bootstrap/Image'

// Base Azure URL of backend
// const baseURL = "https://hack-cancer.azurewebsites.net";
//const baseURL = "https://hack-cancer-api.azurewebsites.net";
const baseURL = process.env.REACT_APP_API_BASE_URL;
//const baseURL = "http://localhost:8080";

// Upload image to Azure Storage Account method
const uploadImage = () => new Promise((resolve, reject) => {

    // Fake response
    setTimeout(function () {
        resolve({ status: 200, data: { prediction: 0.268 } });
    }, 3000);

    ////////////////

    // // Real response
    // var formData = new FormData();
    // var imagefile = document.querySelector('#photo');
    // formData.append("file", imagefile.files[0]);
    // axios
    //     .post(baseURL + "/uploadImage",
    //         formData,
    //         {
    //             headers: {
    //                 'Access-Control-Allow-Origin': '*',
    //                 'Content-Type': 'multipart/form-data'
    //             }
    //         })
    //     .then((response) => {
    //         resolve(response);
    //     })
    //     .catch((error) => {
    //         console.log(error)
    //         reject(error);
    //     });
    ///////////////
});

// // Get results method of an image with request_id parameter
// const getResults = (requestId) => new Promise((resolve, reject) => {
//     console.log("Request_id: ", requestId);
//     axios
//         ///////////////////////////
//         //.get(baseURL + "/getResults?request_id=" + requestId)
//         ///////////////////////////
//         .get(baseURL + "/getResults?request_id=7rBDu3ltbpPSvJDV")
//         .then((response) => {
//             resolve(response);
//         })
//         .catch((error) => {
//             reject(error);
//         });
// });

export default function InputScreen() {
    // Navigate
    let navigate = useNavigate();

    // States
    const [isLoading, setLoading] = useState(false);
    const [show, setShow] = useState(false);
    const [showABCDEModal, setShowABCDEModal] = useState(false);
    const [showABCDEReferenceModal, setShowABCDEReferenceModal] = useState(false);
    const [showError, setShowError] = useState(false);
    const [filename, setFilename] = useState("");

    // Handlers
    const handleCloseYes = () => {
        setShow(false);
        handleSubmit();
    }
    const handleCloseNo = () => setShow(false);
    const handleShow = () => setShow(true);
    const handleABCDEModal = () => setShowABCDEModal(!showABCDEModal);
    const handleABCDEReferenceModal = () => setShowABCDEReferenceModal(!showABCDEReferenceModal);
    const handleError = () => setShowError(false);
    const handleSubmit = () => setLoading(true);
    const handleClick = event => {
        hiddenFileInput.current.click();
    };
    const handleChange = event => {
        const fileUploaded = event.target.files[0];
        setFilename(fileUploaded.name);
    };

    // References
    const hiddenFileInput = useRef(null);

    // When isLoading changes, will trigger the image upload and analysis
    useEffect(() => {
        if (isLoading) {
            // Send request to upload the image to analyze
            uploadImage()
                .then((uploadImageResponse) => {
                    console.log("Response: ", uploadImageResponse);
                    setLoading(false);
                    if (uploadImageResponse.status === 200) {
                        var score = uploadImageResponse.data.prediction * 100;
                        setLoading(false);
                        navigate("/output?score=" + score);
                    }
                    else {
                        setShowError(true);
                        console.error(uploadImageResponse);
                    }
                })
                .catch((uploadImageError) => {
                    setLoading(false);
                    setShowError(true);
                    console.error(uploadImageError);
                });
        }
    }, [isLoading]);

    // Render
    return (
        <>
            <Header title="Hackaway at Cancer" subtitle="Insert data" />
            <Main>
                {/* Form with input data */}
                <Form>
                    <Accordion defaultActiveKey="0">
                        {/* Gender */}
                        <Accordion.Item eventKey="0">
                            <Accordion.Header>Gender</Accordion.Header>
                            <Accordion.Body>
                                <p>Select a gender from the drop-down options.</p>
                                <Form.Select>
                                    <option>N/A</option>
                                    <option value="female">Female</option>
                                    <option value="male">Male</option>
                                </Form.Select>
                            </Accordion.Body>
                        </Accordion.Item>
                        {/* Age range */}
                        <Accordion.Item eventKey="1">
                            <Accordion.Header>Age range</Accordion.Header>
                            <Accordion.Body>
                                <p>Select an age range from the drop-down options.</p>
                                <Form.Select>
                                    <option>N/A</option>
                                    <option value="0">Under 20</option>
                                    <option value="0">20-29</option>
                                    <option value="0">30-39</option>
                                    <option value="0">40-49</option>
                                    <option value="1">50-54</option>
                                    <option value="2">55-59</option>
                                    <option value="3">60 and Over</option>
                                </Form.Select>
                            </Accordion.Body>
                        </Accordion.Item>
                        {/* ABCDE check */}
                        <Accordion.Item eventKey="4">
                            <Accordion.Header>ABCDE check</Accordion.Header>

                            <Accordion.Body>
                                <p>ABCDE is a check procedure to detect some characteristics that in some cases is very important to have in the analysis.</p>
                                {/* Button to analyze input data */}
                                <Button
                                    style={{ width: '100%' }}
                                    variant="primary"
                                    onClick={handleABCDEModal}
                                >
                                    Select
                                </Button>
                            </Accordion.Body>
                        </Accordion.Item>

                        {/* Photo upload */}
                        <Accordion.Item eventKey="3">
                            <Accordion.Header>Photo (required)</Accordion.Header>
                            <Accordion.Body>
                                <p>Upload a recent photo of the mole that is in the best possible image quality.</p>
                                <Button onClick={handleClick}
                                    variant="primary">
                                    Upload a photo
                                </Button>
                                &nbsp;<Badge bg="info">{filename}</Badge>
                                <input id="photo"
                                    type="file"
                                    ref={hiddenFileInput}
                                    onChange={handleChange}
                                    style={{ display: 'none' }}
                                    accept="image/*"
                                />
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>

                    <hr></hr>

                    {/* Button to analyze input data */}
                    <Button
                        style={{ width: '100%' }}
                        variant="primary"
                        disabled={isLoading || !filename}
                        onClick={handleShow}
                    >
                        {isLoading ?
                            <Spinner
                                as="span"
                                animation="border"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                            />
                            : 'Analyze'}
                    </Button>

                    {/* Modal to confirm image analyze action */}
                    <Modal show={show} onHide={handleCloseNo} centered>
                        <Modal.Header closeButton>
                            <Modal.Title>Send photo to analyze</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>Are you sure you want to continue?</Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleCloseNo}>
                                No
                            </Button>
                            <Button variant="primary" onClick={handleCloseYes}>
                                Yes
                            </Button>
                        </Modal.Footer>
                    </Modal>

                    {/* ABCDE modal */}
                    <Modal show={showABCDEModal} onHide={handleABCDEModal} centered>
                        <Modal.Header closeButton>
                            <Modal.Title>ABCDE check</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            This check list represents the ABCDE characteristics check of the mole. Do you see any of this characteristics?
                            &nbsp;
                            <Button variant="info" size="sm" onClick={handleABCDEReferenceModal}>
                                See reference
                            </Button>
                            <br></br>
                            <br></br>
                            <Form>
                                <Table striped bordered hover>
                                    <thead>
                                        <tr style={{ textAlignLast: "center" }}>
                                            <th>#</th>
                                            <th>Description</th>
                                            <th>Selection</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr style={{ textAlignLast: "center" }}>
                                            <td>A</td>
                                            <td>Asymmetry</td>
                                            <td><Form.Check
                                                type="switch"
                                            /></td>
                                        </tr>
                                        <tr style={{ textAlignLast: "center" }}>
                                            <td>B</td>
                                            <td>Border</td>
                                            <td><Form.Check
                                                type="switch"
                                            /></td>
                                        </tr>
                                        <tr style={{ textAlignLast: "center" }}>
                                            <td>C</td>
                                            <td>Color</td>
                                            <td><Form.Check
                                                type="switch"
                                            /></td>
                                        </tr>
                                        <tr style={{ textAlignLast: "center" }}>
                                            <td>D</td>
                                            <td>Diameter</td>
                                            <td><Form.Check
                                                type="switch"
                                            /></td>
                                        </tr>
                                        <tr style={{ textAlignLast: "center" }}>
                                            <td>E</td>
                                            <td>Evolving</td>
                                            <td><Form.Check
                                                type="switch"
                                            /></td>
                                        </tr>
                                    </tbody>
                                </Table>


                            </Form>

                        </Modal.Body>
                    </Modal>

                    {/* ABCDE reference modal */}
                    <Modal fullscreen show={showABCDEReferenceModal} onHide={handleABCDEReferenceModal} centered>
                        <Modal.Header closeButton>
                            <Modal.Title>ABCDE reference</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Image src="/images/ABCDEs.jpg" />
                        </Modal.Body>
                    </Modal>

                    {/* Error modal with message */}
                    <Modal show={showError} onHide={handleError} centered>
                        <Modal.Header closeButton>
                            <Modal.Title>Error</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>There was an error trying to analyze the image. Please try again later.</Modal.Body>
                    </Modal>

                </Form>
            </Main>
            <Footer />
        </>
    );
}
