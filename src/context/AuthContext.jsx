import { createContext, useEffect, useReducer } from "react";

const initialState = {
  user: JSON.parse(localStorage.getItem("user")) || null,
  role: localStorage.getItem("role") || null,
  token: localStorage.getItem("token") || null,
};

export const AuthContext = createContext(initialState);

const AuthReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_SUCCESS":
      localStorage.setItem("user", JSON.stringify(action.payload.user));
      localStorage.setItem("role", action.payload.role);
      localStorage.setItem("token", action.payload.token);

      return {
        user: action.payload.user,
        role: action.payload.role,
        token: action.payload.token,
      };

    case "LOGOUT":
      localStorage.removeItem("user");
      localStorage.removeItem("role");
      localStorage.removeItem("token");

      return { user: null, role: null, token: null };

    default:
      return state;
  }
};

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AuthReducer, initialState);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const storedRole = localStorage.getItem("role");
    const storedToken = localStorage.getItem("token");

    if (storedUser) {
      dispatch({
        type: "LOGIN_SUCCESS",
        payload: { user: storedUser, role: storedRole, token: storedToken },
      });
    }
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};