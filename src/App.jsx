import React, { useEffect, useState } from "react";
import "./App.css";
import Layout from "./layout/Layout";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (loggedInUser) {
      setUser(loggedInUser);
    }
  }, []);

  return (
    <>
      <Layout user={user} setUser={setUser} />
    </>
  );
}

export default App;
