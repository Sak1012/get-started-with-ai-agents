import React from "react";
import styles from "./Login.module.css";
import { loginRequest } from "./authConfig";
import { useTokenForP4Ai } from "./useTokenForP4Ai";

interface LoginProps {
  setAccessToken: (token: string) => void;
}

const Login: React.FC<LoginProps> = ({ setAccessToken }) => {
  const getTokenForP4Ai = useTokenForP4Ai();

  const onLoginClick = async () => {
    const scopes = loginRequest.scopes;

    try {
      const token = await getTokenForP4Ai(scopes);

      if (token) {
        console.log("Token successfully retrieved on login.");
        setAccessToken(token);
      } else {
        console.error("Failed to retrieve token.");
      }
    } catch (err) {
      console.error("Login error:", err);
    }
  };

  return (
    <div className={styles.loginBanner}>
      <span className={styles.message}>Hello, Login to continue</span>
      <button className={styles.loginButton} onClick={onLoginClick}>
        Login
      </button>
    </div>
  );
};

export default Login;
