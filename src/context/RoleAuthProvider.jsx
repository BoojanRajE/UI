import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import jwtDecode from 'jwt-decode';
import Settings from '../apiConfig/globalConfig';
const apiUrl = Settings.API_ROOT;

const RoleContext = React.createContext({});

export function useRoleAuth() {
  return useContext(RoleContext);
}

function RoleAuthProvider({ children }) {
  const [roleAuth, setRoleAuth] = useState({});
  const getRoles = () => {
    // const authToken = localStorage.getItem("token");
    // if (authToken) {
    // const tokenDecode = jwtDecode(authToken);
    // const role = tokenDecode?.role;
    // //
    // axios.get(`${apiUrl}/api/roles`).then((res) => {
    //   const [roleData] = res.data.filter((ele) => {
    //     return ele.roleName === role;
    //   });
    //   // //

    //   setRoleAuth(roleData.privilege);
    //   // localStorage.setItem("role", JSON.stringify(roleData.privilege));
    // });
    const roleData = localStorage.getItem('role');
    if (!roleData) return;
    const role = JSON.parse(roleData);
    //
    // const [roleData] = roles.filter((ele) => {
    //   return ele.roleName === role;
    // });
    // setRoleAuth(roleData.privilege);
    setRoleAuth(role.privilege);
    // }
  };

  useEffect(() => {
    getRoles();
  }, []);

  return (
    <RoleContext.Provider value={roleAuth}> {children} </RoleContext.Provider>
  );
}

export default RoleAuthProvider;
