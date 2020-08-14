import React, { useState, useEffect } from "react";
import { Image } from "react-bootstrap";
import { map } from "lodash";
import moment from "moment";

import useAuth from "../../hooks/useAuth";
import { getUserApi } from "../../api/user";
import { delTweetApi } from "../../api/tweet";
import { API_HOST } from "../../utils/constant";

import "./ListTweets.scss";
import AvatarNotFound from "../../assets/png/avatar-no-found.png";
import { Close, Heart } from "../../utils/Icons";
import {replaceURLWithHTMLLinks} from "../../utils/functions";

export default function ListTweets(props) {
  const { tweets } = props;
  //console.log(tweets)
  return (
    <div className="list-tweets">
      {map(tweets, (tweet, index) => (
        <Tweet key={index} tweet={tweet}></Tweet>
      ))}
    </div>
  );
}

function Tweet(props) {
  const { tweet } = props;
  //console.log(tweet);
  const loggedUser = useAuth();
  const delTweet = async () => {
      await delTweetApi(tweet._id)
        .then(response => {
          return response;
      })
        .catch(err => {
            return err;
        });
        window.location.reload();
  };
  const [userInfo, setUserInfo] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [showDel, setShowDel] = useState(null);

  useEffect(() => {
    getUserApi(tweet.userId).then((response) => {
      setUserInfo(response);
      setAvatarUrl(
        response?.avatar
          ? `${API_HOST}/obtenerAvatar?id=${response.id}`
          : AvatarNotFound
      );
    });
  }, [tweet]);

  useEffect(() => {
    if (tweet.userId === loggedUser._id) {
      setShowDel(true);
    } else {
      setShowDel(false);
    }
  }, [loggedUser._id, tweet.userId]);

  return (
    <div className="tweet">
      <Image className="avatar" src={avatarUrl} roundedCircle></Image>
      <div>
        <div className="name">
          {userInfo?.nombre} {userInfo?.apellidos}
          <span>{moment(tweet.fecha).calendar()}</span>
          <span>
            {showDel ? (
              <Close className="close" onClick={delTweet}></Close>
            ) : (
              <Heart className="heart"></Heart>
            )}
          </span>
        </div>
        {/* <div>{replaceURLWithHTMLLinks(tweet.mensaje)}</div> */}
        <div 
          dangerouslySetInnerHTML={{ __html:replaceURLWithHTMLLinks(tweet.mensaje)}}
        />
      </div>
    </div>
  );
}
