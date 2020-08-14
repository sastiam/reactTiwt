import React, {useState} from "react";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import LogoWhite from "../../assets/png/logo-blanco.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faUser,
  faUsers,
  faPowerOff,
} from "@fortawesome/free-solid-svg-icons";
import TweetModal from "../Modal/TweetModal";

import useAuth from "../../hooks/useAuth";
import {logoutApi} from "../../api/auth";
import "./LeftMenu.scss";

export default function LeftMenu(props) {
  const {setRefreshCheckLogin} = props;
  const [showModal, setShowModal] = useState(false);
  const user = useAuth();
  const logout = () => {
    logoutApi();
    // props.setRefreshCheckLogin(true);
    setRefreshCheckLogin(true);
  };
  return (
    <div className="left-menu">
      <img className="logo" src={LogoWhite} alt="Logo left menu"></img>
      <Link to="/">
        <FontAwesomeIcon icon={faHome}></FontAwesomeIcon> Inicio
      </Link>
      <Link to="/users">
        <FontAwesomeIcon icon={faUsers}></FontAwesomeIcon> Usuarios
      </Link>
      <Link to={`/${user?._id}`}>
        <FontAwesomeIcon icon={faUser}></FontAwesomeIcon> Perfil
      </Link>
      <Link to="" onClick={logout}>
        <FontAwesomeIcon icon={faPowerOff}></FontAwesomeIcon> Cerrar sesion
      </Link>
      <Button onClick={() => setShowModal(true)}>Twitt</Button>

      <TweetModal show={showModal} setShow={setShowModal} >
      </TweetModal>
    </div>
  );
}
