import { Outlet, Navigate, useLocation, matchPath } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
// interface authContextInterface{
//     token?: string,
//     isLogged: boolean,
// }
// const userData = () =>{
//   const token = localStorage.getItem("to")
// }

const useAuth = () => {
  const token = localStorage.getItem('token');
  if (!token) return;

  const user: {
    id: string;
    type: string;
    user: string;
  } = jwt_decode(token);
  return user;
};

const PrivateRoutes = ({ config }: any): JSX.Element => {
  //let auth: authContextInterface = {isLogged: true}
  const auth = useAuth();

  const location = useLocation();
  //
  let allowed = false;
  if (auth) {
    allowed = config[auth?.type]?.some((e: string) => {
      return matchPath({ path: e }, location.pathname);
    });
  }

  return allowed ? <Outlet /> : <Navigate to="/login" />;
  // auth.isLogged ? <Outlet/> : <Navigate to="/login" />
};

export default PrivateRoutes;
