import React, { useState } from "react";
import "./SignInForm.scss";
import { Form, Button, Spinner } from "react-bootstrap";
import { values, size } from "lodash";
import { toast } from "react-toastify";
import { isEmailValid } from "../../utils/validations";
import { signInApi, setTokenApi } from "../../api/auth";

export default function SignInForm(props) {
  const {setRefreshCheckLogin} = props;
  const [formData, setFormData] = useState(initialFormValue());
  const [signInLoading, setSignInLoading] = useState(false);
  const onSubmit = (e) => {
    e.preventDefault();

    let validCount = 0;
    values(formData).some(value => {
      value && validCount++
      return null;
    });
    if(size(formData) !== validCount) {
      toast.warning("Complete los campos requeridos.");
    } else {
      if(!isEmailValid(formData.email)) {
        toast.warning("El email es invalido");
      } else {
        setSignInLoading(true);
        signInApi(formData)
          .then(response => {
            if(response.message) {
              toast.warning(response.message);
            } else {
              // console.log(response.token);
              setTokenApi(response.token);
              setRefreshCheckLogin(true);
            }
          })
          .catch(() => {
            toast.error("Error del servidor, intentelo mas tarde.")
          })
          .finally(() => {
            setSignInLoading(false);  
          });
      }
    }
  };
  const onChange = e => {
    setFormData({ ...formData, [e.target.name] : e.target.value})
  }
  return (
    <div className="sign-in-form">
      <h2>Entrar</h2>
      <Form onSubmit={onSubmit} onChange={onChange}>
        <Form.Group>
            <Form.Control
            type="email"
            name="email"
            placeholder="Correo"
            defaultValue={formData.email}
            ></Form.Control>
        </Form.Group>
        <Form.Group>
            <Form.Control
            type="password"
            name="password"
            placeholder="Contraseña"
            defaultValue={formData.password}
            >
            </Form.Control>
        </Form.Group>
        <Button variant="primary" type="submit">
          {!signInLoading ? "Iniciar sesion" : <Spinner animation="border"></Spinner>}
          </Button>
      </Form>
    </div>
  );
}

function initialFormValue() {
  return {
    email: "",
    password: "",
  }
}