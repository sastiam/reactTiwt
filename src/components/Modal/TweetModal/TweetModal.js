import React, {useState} from 'react'
import {Modal, Form, Button} from "react-bootstrap";
import classNames from "classnames";
import {toast} from "react-toastify";

import "./TweetModal.scss";
import {Close} from "../../../utils/Icons";

import {addTweetApi} from "../../../api/tweet";

export default function TweetModal(props) {

    const {show, setShow} = props;
    const [message, setMessage] = useState("");
    const maxLength = 280;

    const onSubmit = e => {
        e.preventDefault();
        if(message.length > 0 && message.length <= maxLength) {
            addTweetApi(message)
                .then(response => {
                    if(response?.code >= 200 && response?.code < 300) {
                        setShow(false);
                        toast.success(response.message);
                        window.location.reload();
                    }
                })
                .catch(() => {
                    toast.warning("Error al enviar el tweet, intentelo de nuevo.")
                })
        }
    }
    return (
       <Modal
        className="tweet-modal"
        show={show}
        onHide={() => setShow(false)}
        centered
        size="lg"
       >
           <Modal.Header>
               <Modal.Title>
                    <Close onClick={() => setShow(false)}></Close>
               </Modal.Title>
           </Modal.Header>
           <Modal.Body>
               <Form onSubmit={onSubmit}>
                    <Form.Control
                        as="textarea"
                        rows="6"
                        placeholder="¿Que estas pensando?"
                        onChange={e => setMessage(e.target.value)}
                    >
                    </Form.Control>
                    <span className={classNames("count", {error: message.length > maxLength,})}>
                        {message.length}
                        </span>
                    <Button
                        type="submit"
                        disabled={message.length > maxLength || message.length < 1}
                    >
                    Twitear
                    </Button>
               </Form>
           </Modal.Body>
       </Modal>
    )
}
