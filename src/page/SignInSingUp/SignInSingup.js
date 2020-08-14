import React, {useState} from 'react';
import { Container, Row, Col, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faUsers, faComment } from "@fortawesome/free-solid-svg-icons";


import BasicModal from "../../components/Modal/BasicModal";
import LogoWhite from "../../assets/png/logo-blanco.png";
import Logo from "../../assets/png/logo.png";

import SignUpForm from "../../components/SignUpForm";
import SignInForm from "../../components/SignInForm";

import "./SignInSingup.scss";


export default function SignInSingup(props) {
    const {setRefreshCheckLogin} = props;
    const [showModal, setShowModal] = useState(false);
    const [contentModal, setContentModal] = useState(null);

    const openModal = content => {
        setShowModal(true);
        setContentModal(content);
    }
    return (
        <>
        <Container className="signin-signup" fluid>
            <Row>
                <LeftComponent />
                <RightComponent 
                openModal = {openModal}
                setShowModal = {setShowModal}
                setRefreshCheckLogin = {setRefreshCheckLogin}
                />
            </Row>
        </Container>
        <BasicModal
            show={showModal}
            setShow={setShowModal}
        >
            {contentModal}
        </BasicModal>
        </>
    );
}

function LeftComponent() {
    return (
        <Col className="signin-signup__left" xs={6}>
            <img src={Logo} alt="Logo"></img>
            <div>
                <h2>
                    <FontAwesomeIcon icon={faSearch}></FontAwesomeIcon> 
                    Sigue lo que te importa!
                </h2>
                <h2>
                    <FontAwesomeIcon icon={faUsers}></FontAwesomeIcon> 
                    Enterate de que esta hablando la gente.
                </h2>
                <h2>
                    <FontAwesomeIcon icon={faComment}></FontAwesomeIcon> 
                    Unete a la conversacion
                </h2>
            </div>
        </Col>
    )
}

function RightComponent(props) {
    const {openModal, setShowModal, setRefreshCheckLogin} = props;
    return (
        <Col className="signin-signup__right" xs={6}>
            <div>
                <img src={LogoWhite} alt="Logo blanco"></img>
                <h2>Mira lo que esta pasando en el mundo en este momento!</h2>
                <h3>Unete a goTwit ahora</h3>
                <Button 
                 variant="primary"
                 onClick = {() => openModal(<SignUpForm setShowModal={setShowModal}></SignUpForm>)}
                >
                    Registrate
                </Button>
                <Button 
                 variant="outline-primary"
                 onClick = {() => openModal(<SignInForm setRefreshCheckLogin={setRefreshCheckLogin}></SignInForm>)}
                 >
                    Iniciar sesión
                </Button>
            </div>
        </Col>
    )
}