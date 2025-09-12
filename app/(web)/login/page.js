"use client";
import React, { useState } from "react";
import Head from "next/head";
import swal from "sweetalert";
import styles from "../styles/login.module.css";
import { FaCheck } from "react-icons/fa";
import axios from "axios";
import { useRouter } from "next/navigation";

const generateCaptcha = () => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let captcha = "";
  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    captcha += characters.charAt(randomIndex);
  }
  return captcha;
};

const LoginForm = () => {
  const router = useRouter();
  const [captcha, setCaptcha] = useState(generateCaptcha());
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [captchaInput, setCaptchaInput] = useState("");

  const refreshCaptcha = () => {
    setCaptcha(generateCaptcha());
    setCaptchaInput("");
  };

  const validateForm = async () => {
    if (username.trim() === "") {
      swal("Error!", "Please enter username", "error");
      return;
    }
    if (password.trim() === "") {
      swal("Error!", "Please enter password", "error");
      return;
    }
    if (captchaInput.toUpperCase() !== captcha.toUpperCase()) {
      swal("Error!", "Invalid Captcha. Please try again.", "error");
      refreshCaptcha();
      return;
    }

    // Make HTTP POST request to the login API
    await axios
      .post(`${process.env.NEXT_PUBLIC_BACKLINK}/users/login`, { username, password }, { withCredentials: true })
      .then((response) => {
        swal("Success!", "Login successful!", "success");
        setUsername("");
        setPassword("");
        setCaptchaInput("");
        refreshCaptcha();
        router.push("/dashboard");
        const cookiesHeader = response.headers.get("Set-Cookie");
        if (cookiesHeader) {
          document.cookie = cookiesHeader;
        }
      })

      .catch((error) => {
        // Handle login error
        swal("Error!", "Login failed. Please try again.", "error");
        console.error("Login error:", error);
      });
  };

  return (
    <>
      <Head>
        <title>Login Form</title>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width" />
      </Head>
      <div className={styles.loginWrapper}>
        <div className={styles.loginForm}>
          <div className={styles.formTitle}>AmpTech</div>
          <div className={styles.formInput}>
            <label htmlFor="username">Username</label>
            <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} />
          </div>
          <div className={styles.formInput}>
            <label htmlFor="password">Password</label>
            <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <div className={styles.captcha}>
            <label htmlFor="captchaInput">Enter Captcha</label>
            <div className={styles.preview}>{captcha}</div>
            <div className={styles.captchaForm}>
              <input type="text" id="captchaInput" placeholder="Enter captcha text" value={captchaInput} onChange={(e) => setCaptchaInput(e.target.value)} />
              <button className={styles.captchaRefresh} onClick={refreshCaptcha}>
                <FaCheck />
              </button>
            </div>
          </div>
          <div className={styles.formInput}>
            <button className={styles.loginBtn} onClick={validateForm}>
              Login
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginForm;
