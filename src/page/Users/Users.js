import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import queryString from "query-string";
import { isEmpty } from "lodash";
import { Spinner, ButtonGroup, Button } from "react-bootstrap";
import { useDebouncedCallback } from "use-debounce";

import ListUsers from "../../components/ListUsers";
import BasicLayout from "../../layout/BasicLayout";
import "./Users.scss";

import { getFollowsApi } from "../../api/follow";

function Users(props) {
  const { setRefreshCheckLogin, location, history } = props;

  const [users, setUsers] = useState(null);
  const params = useUsersQuery(location);
  const [typeUser, setTypeUser] = useState(params.type || "follow");

  const [btnLoading, setBtnLoading] = useState(false);

  const [onSearch] = useDebouncedCallback(async (value) => {
    setUsers(null);
    await history.push({
      search: queryString.stringify({ ...params, search: value, page: 1 }),
    });
  }, 200);

  useEffect(() => {
    getFollowsApi(queryString.stringify(params))
      .then((response) => {
        // eslint-disable-next-line eqeqeq
        if (params.page == 1) {
          if (isEmpty(response)) {
            setUsers([]);
          } else {
            setUsers(response);
          }
        } else {
          if(!response) {
            setBtnLoading(0)
          } else {
            setUsers({...users, ...response});
            setBtnLoading(false);
          }
        }
      })
      .catch(() => {
        setUsers([]);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  const onChangeType = (type) => {
    setUsers(null);
    if (type === "new") {
      setTypeUser("new");
    } else {
      setTypeUser("follow");
    }
    history.push({
      search: queryString.stringify({ type: type, page: 1, search: "" }),
    });
  };

  const moreData = () => {
    setBtnLoading(true);
    const newPage = parseInt(params.page) + 1;
    history.push({
      search: queryString.stringify({ ...params, page: newPage }),
    });
  };

  return (
    <BasicLayout
      className="users"
      title="Usuarios"
      setRefreshCheckLogin={setRefreshCheckLogin}
    >
      <div className="users__title">
        <h2>Usuarios</h2>
        <input
          type="text"
          placeholder="Busca un usuario..."
          onChange={(e) => onSearch(e.target.value)}
        ></input>
      </div>

      <ButtonGroup className="users__options">
        <Button
          className={typeUser === "follow" && "active"}
          onClick={() => onChangeType("follow")}
        >
          Siguiendo
        </Button>
        <Button
          className={typeUser === "new" && "active"}
          onClick={() => onChangeType("new")}
        >
          Nuevos
        </Button>
      </ButtonGroup>
      {!users ? (
        <div className="users__loading">
          <Spinner animation="border" variant="info" />
          Buscando usuarios
        </div>
      ) : (
        <>
          <ListUsers users={users}></ListUsers>
          <Button onClick={moreData} className="load-more">
            {!btnLoading ? (
              btnLoading !== 0 && "Cargar más usuarios"
            ) : (
              <Spinner
                as="span"
                animation="grow"
                size="sm"
                role="status"
                aria-hidden="true"
              ></Spinner>
            )}
          </Button>
        </>
      )}
    </BasicLayout>
  );
}

function useUsersQuery(location) {
  const { page = 1, type = "follow", search = "" } = queryString.parse(
    location.search
  );

  return { page, type, search };
}

export default withRouter(Users);
