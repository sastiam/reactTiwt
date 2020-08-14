import React, { useState, useEffect } from "react";
import AvatarNotFound from "../../../assets/png/avatar-no-found.png";
import { Button } from "react-bootstrap";

import { API_HOST } from "../../../utils/constant";
import {
  checkFollowApi,
  addFollowApi,
  delFollowApi,
} from "../../../api/follow";

import ConfigModal from "../../Modal/ConfigModal";
import EditUserForm from "../../User/EditUserForm";

import "./BannerAvatar.scss";

export default function BannerAvatar(props) {
  const { user, loggedUser } = props;
  //console.log(loggedUser);
  //console.log(user);
  const [showModal, setShowModal] = useState(false);
  const [following, setFollowing] = useState(null);
  const [reloadFollow, setReloadFollow] = useState(null);

  // Obteniendo url banner y avatar
  const bannerUrl = user?.banner
    ? `${API_HOST}/obtenerBanner?id=${user.id}`
    : null;
  const avatarUrl = user?.avatar
    ? `${API_HOST}/obtenerAvatar?id=${user.id}`
    : AvatarNotFound;

  useEffect(() => {
    if (user) {
      checkFollowApi(user?.id).then((response) => {
        //console.log(response?.status);
        if (response?.status) {
          setFollowing(true);
        } else {
          setFollowing(false);
        }
      });
    }
    setReloadFollow(false);
  }, [user, reloadFollow]);

  const follow = async () => {
    if (following) {
      await delFollowApi(user.id);
    } else {
      await addFollowApi(user.id);
    }
    setReloadFollow(true);
  };

  return (
    <div
      className="banner-avatar"
      style={{ backgroundImage: `url('${bannerUrl}')` }}
    >
      <div
        className="avatar"
        style={{ backgroundImage: `url('${avatarUrl}')` }}
      ></div>
      {user && (
        <div className="options">
          {loggedUser._id === user.id && (
            <Button onClick={() => setShowModal(true)}>
              Editar perfil
            </Button>
          )}
          {loggedUser._id !== user.id &&
            following !== null &&
            (following ? (
              <Button onClick={follow} className="unfollow">
                <span>Siguiendo</span>
              </Button>
            ) : (
              <Button onClick={follow}>
                Seguir
              </Button>
            ))}
        </div>
      )}

      <ConfigModal
        show={showModal}
        setShow={setShowModal}
        title="Editar perfil"
      >
        <EditUserForm user={user} setShowModal={setShowModal}></EditUserForm>
      </ConfigModal>
    </div>
  );
}
