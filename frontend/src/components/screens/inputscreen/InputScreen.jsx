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
//import https from 'https';

// Base Azure URL of backend
const baseURL = "https://hack-cancer.azurewebsites.net";

// const httpsAgent = new https.Agent({
//     rejectUnauthorized: false,
//   })
// axios.defaults.httpsAgent = httpsAgent

// Upload image to Azure Storage Account method
const uploadImage = () => new Promise((resolve, reject) => {
    var formData = new FormData();
    var imagefile = document.querySelector('#photo');
    formData.append("file", imagefile.files[0]);
    axios
        .post(baseURL + "/uploadImage/",
            formData,
            {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'multipart/form-data'
                }
            })
        .then((response) => {
            resolve(response);
        })
        .catch((error) => {
            reject(error);
        });
});

// Get results method of an image with request_id parameter
const getResults = (requestId) => new Promise((resolve, reject) => {
    axios
        ///////////////////////////
        //.get(baseURL + "/getResults?request_id=" + requestId)
        .get(baseURL + "/getResults?request_id=7rBDu3ltbpPSvJDV",
            {
                headers: {
                    'Access-Control-Allow-Origin': '*'
                }
            })
        .then((response) => {
            resolve(response);
        })
        .catch((error) => {
            reject(error);
        });
});

export default function InputScreen() {
    // Navigate
    let navigate = useNavigate();

    // States
    const [isLoading, setLoading] = useState(false);
    const [show, setShow] = useState(false);
    const [showError, setShowError] = useState(false);
    const [filename, setFilename] = useState("");

    // Handlers
    const handleCloseYes = () => {
        setShow(false);
        handleSubmit();
    }
    const handleCloseNo = () => setShow(false);
    const handleShow = () => setShow(true);
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
                    setLoading(false);
                    if (uploadImageResponse.status === 200 && uploadImageResponse.data.request_id) {
                        // Get Result of the preious image uploaded
                        getResults(uploadImageResponse.data.request_id)
                            .then((getResultsResponse) => {
                                console.log(getResultsResponse);
                                console.log(getResultsResponse.data.confidence);
                                console.log(getResultsResponse.data.confidence * 100);
                                setLoading(false);
                                ///// configure score from response
                                navigate("/output?score=" + getResultsResponse.data.confidence * 100);
                            })
                            .catch((getResultsError) => {
                                setLoading(false);
                                setShowError(true);
                                console.error(getResultsError);
                            });
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
                                    <option value="0">Under 50</option>
                                    <option value="1">50-55</option>
                                    <option value="2">55-59</option>
                                    <option value="3">60 and Over</option>
                                </Form.Select>
                            </Accordion.Body>
                        </Accordion.Item>
                        {/* Photo upload */}
                        <Accordion.Item eventKey="3">
                            <Accordion.Header>Photo (required)</Accordion.Header>
                            <Accordion.Body>
                                <p>Upload a recent photo of the mole that is --missing info: something about photo quality, other?--</p>
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
                        variant="primary"
                        disabled={isLoading || !filename}
                        onClick={handleShow}
                    >
                        {isLoading ? 'Analyzing…' : 'Analyze'}
                    </Button>

                    {/* Spinner for loading */}
                    {' '}
                    {isLoading && <Button variant="primary" disabled>
                        <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                        />
                        <span className="visually-hidden">Loading...</span>
                    </Button>}

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
