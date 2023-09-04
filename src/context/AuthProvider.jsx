import React, { useContext, useEffect, useState } from "react";

const AuthContext = React.createContext({});

export function useAuth() {
  return useContext(AuthContext);
}

function AuthProvider({ children }) {
  const [auth, setAuth] = useState({});

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
