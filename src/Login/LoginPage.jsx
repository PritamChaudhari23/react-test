import React, { useState } from "react";
import "./LoginPage.css";
const API_URL = "https://dummyjson.com/auth/login";

const LoginPage = () => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        username: credentials.username,
        password: credentials.password,
      }),
    })
      .then((res) => res.json())
      .then(console.log);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setCredentials({ ...credentials, [name]: value });
  };

  return (
    <form onSubmit={handleSubmit} className="login-form">
      <div className="form-container">
        <h2>Login to the application</h2>
        <div className="form-field">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            maxLength={8}
            value={credentials.username}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-field">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            minLength={8}
            value={credentials.password}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-field">
          <button
            type="submit"
            className="submit-button"
          >
            Login
          </button>
        </div>
      </div>
    </form>
  );
};

export default LoginPage;
