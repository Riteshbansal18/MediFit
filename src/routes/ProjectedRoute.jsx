/* eslint-disable react/prop-types */

import { useContext } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import { Navigate } from "react-router-dom";

const ProjectedRoute = ({ children, allowedRoles }) => {
  const { token, role } = useContext(AuthContext);

  console.log(role);

  console.log(allowedRoles);

  const isAllowed = allowedRoles.includes(role);
  console.log(isAllowed);

  const accessibleRoute =
    token && isAllowed ? children : <Navigate to="/login" replace={true} />;

  return accessibleRoute;
};

export default ProjectedRoute;
