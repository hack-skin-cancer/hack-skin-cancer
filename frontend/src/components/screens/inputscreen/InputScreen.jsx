import React, { useEffect, useState, useRef } from "react";
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

function sendRequest() {
    return new Promise((resolve) => setTimeout(resolve, 2000));
}

export default function InputScreen() {

    const [isLoading, setLoading] = useState(false);
    const [show, setShow] = useState(false);
    const [filename, setFilename] = useState("");

    const handleCloseYes = () => {
        setShow(false);
        handleSubmit();
    }
    const handleCloseNo = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleSubmit = () => setLoading(true);

    useEffect(() => {
        if (isLoading) {
            sendRequest()
                .then(() => {
                    setLoading(false);
                    window.location = "output";
                });
        }
    }, [isLoading]);

    const hiddenFileInput = useRef(null);

    const handleClick = event => {
        hiddenFileInput.current.click();
    };
    const handleChange = event => {
        const fileUploaded = event.target.files[0];
        setFilename(fileUploaded.name);
        //props.handleFile(fileUploaded);
    };

    return (
        <>    
            <Header title="Hackaway at Cancer" subtitle="Insert data" />
            <Main>
                <Form>
                    <Accordion defaultActiveKey="0">
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
                        <Accordion.Item eventKey="3">
                            <Accordion.Header>Photo</Accordion.Header>
                            <Accordion.Body>
                                <p>Upload a recent photo of the mole that is --missing info: something about photo quality, other?--</p>
                                <Button onClick={handleClick}
                                    variant="primary">
                                    Upload a photo
                                </Button>
                                &nbsp;<Badge bg="info">{filename}</Badge>
                                <input type="file"
                                    ref={hiddenFileInput}
                                    onChange={handleChange}
                                    style={{ display: 'none' }}
                                    accept="image/*"
                                />
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>
                    <br></br>
                    <Button
                        variant="primary"
                        disabled={isLoading}
                        onClick={handleShow}
                    >
                        {isLoading ? 'Analyzing…' : 'Analyze'}
                    </Button>
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
                </Form>
            </Main>
            <Footer note="Microsoft" />
        </>
    );
}
