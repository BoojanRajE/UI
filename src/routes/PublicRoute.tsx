// // import React from 'react';
// import { Navigate, Outlet } from 'react-router-dom';
// import jwt_decode from "jwt-decode";

// const useAuth = () => {
//   const user: { id: string; type: string; user: string } = jwt_decode(token);

//   const user = localStorage.getItem('token');
//   if (user) {
//     return true;
//   } else {
//     return false;
//   }
// };
// const PublicRoute = () => {
//   // const auth = useAuth();
//   // return auth ? <Navigate to="/home" /> : <Outlet />;
//   const auth = useAuth();
// if (auth && auth?.type === "admin") {
//   return <Navigate to="/home" />;
// } else if (auth) {
//   return <Navigate to="/test" />;
// } else {
//   return <Outlet />;
// }
// };

// export default PublicRoute;
import { Navigate, Outlet } from 'react-router-dom';
import jwt_decode from 'jwt-decode';

const useAuth = () => {
  const token = localStorage.getItem('token');
  if (token) {
    const user: { id: string; type: string; user: string } = jwt_decode(token);
    return user;
  } else {
    return null;
  }
};

const PublicRoute = () => {
  const user = useAuth();
  if (user && user.type === 'admin') {
    return <Navigate to="/home" />;
  } else if (user && user.type === 'faculty') {
    return <Navigate to="/home" />;
  } else {
    return <Outlet />;
  }
};

export default PublicRoute;
