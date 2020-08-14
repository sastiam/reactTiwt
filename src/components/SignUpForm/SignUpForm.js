import React, { useState } from 'react';
import { Row, Col, Form, Button, Spinner} from "react-bootstrap"
import { values, size } from "lodash";
import { toast } from "react-toastify";
import { isEmailValid } from "../../utils/validations";
import {signUpApi} from "../../api/auth";

import "./SignUpForm.scss";

export default function SignUpForm(props) {
    const {setShowModal } = props;
    const [formData, setFormData] = useState(initialFormValue());
    const [signUpLoading, setSignUpLoading] = useState(false);

    const onSubmit = e => {
        e.preventDefault();
        let validCount = 0;
        values(formData).some(value => {
            value && validCount++
            return null
        });

        if(validCount !== size(formData)){
            toast.warning("Completa todos los campos del registro");
        } else {
            if(!isEmailValid(formData.email)) {
                toast.warning("Email invalido");
            } else if(formData.password !== formData.repeatPassword) {
                toast.warning("Las contraseñas tienen que ser iguales.");
            } else if(size(formData.password) < 6 ) {
                toast.warning("La contraseña tiene que tener al menos 6 caracteres.");
            }
            else {
                setSignUpLoading(true);
                signUpApi(formData).then(response => {
                    if(response.code) {
                        toast.warning(response.message);
                    } else {
                        toast.success("El registro ha sido correcto");
                        setShowModal(false);
                        setFormData(initialFormValue());
                    };               
            })
            .catch(() => {
                toast.error("Error del servidor, intente mas tarde");
            })
            .finally(() => {
                setSignUpLoading(false);
            });
        }
    }};

    // Solo sirve para inputs
    const onChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value})
    }
    // onChange={e => setFormData({ ...formData, nombre: e.target.value})}
    
    return (
        <div className="sign-up-form">
            <h2>Create tu cuenta</h2>
            <Form onSubmit={onSubmit} onChange={onChange}>
                <Form.Group>
                    <Row>
                        <Col>
                            <Form.Control 
                             type="text"
                             placeholder="Nombres"
                             name="nombre"
                             defaultValue={formData.nombre}       
                            >
                            </Form.Control>
                        </Col>
                        <Col>
                            <Form.Control 
                             type="text"
                             placeholder="Apellidos"
                             name="apellidos"
                             defaultValue={formData.apellidos}
                            >
                            </Form.Control>
                        </Col>
                    </Row>
                </Form.Group>
                <Form.Group>
                    <Form.Control
                     type="email"
                     placeholder="Correo electronico"
                     name="email"
                     defaultValue={formData.email}
                    >
                    </Form.Control>
                </Form.Group>
                <Form.Group>
                    <Row>
                        <Col>
                            <Form.Control
                             type="password"
                             placeholder="Contraseña"
                             name="password"
                             defaultValue={formData.password}
                            >
                            </Form.Control>
                        </Col>
                        <Col>
                            <Form.Control
                             type="password"
                             placeholder="Repetir contraseña"
                             name="repeatPassword"
                             defaultValue={formData.repeatPassword}
                            >
                            </Form.Control>
                        </Col>
                    </Row>
                </Form.Group>

                <Button variant="primary" type="submit">
                    {!signUpLoading ? "Registrarse" : <Spinner animation="border"></Spinner>}
                </Button>
            </Form>
        </div>
    )
}

function initialFormValue() {
    return {
        nombre: "",
        apellidos: "",
        email: "",
        password: "",
        repeatPassword: "",
    };
}