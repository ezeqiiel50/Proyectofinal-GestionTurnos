import React, { useContext } from 'react'
import { Navigate, Outlet } from 'react-router-dom';
import { UserContext } from '../components/Context/UserContext'

const RouteProtegida = ({ children, redirectTo = "/" }) => {

  const { userData } = useContext(UserContext);

  if (userData !== undefined) {
    if (userData.rolName === "ADMIN" || userData.rolName === "SECRE") {
      return children ? children : <Outlet />
    }
    return <Navigate to={redirectTo} />
  }
  return <Navigate to={redirectTo} />
};
export default RouteProtegida;