"use client";
import '../globals.css';

import Link from "next/link";
import React, { useState } from "react";

import { signIn } from "next-auth/react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const data = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

console.log(email);
console.log(password);
  

  return (
    <div className="container ">
      <div className="row-container">
        <div className="col-cont">
          <form
            className="border-cont"
            onSubmit={submitHandler}
          >
            <h1 className="maa">Login</h1>
            <div className="form-cont">
              <label className="form-label" htmlFor="email_field">
                Email address
              </label>
              <input
                type="email"
                id="email_field"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-outline mb-4">
              <label className="form-label" htmlFor="password_field">
                Password
              </label>
              <input
                type="password"
                id="password_field"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="btn-cont"
              onClick={submitHandler}
            >
              Sign in
            </button>

            <div className="text-center">
              <p>
                Not a member? <Link href="/register">Register</Link>
              </p>
              <p>Or sign up with</p>
              <button
                type="button"
                className="btn-cont"
                onClick={() => signIn("google")}
              >
                <i className="fab fa-google">Google</i>
              </button>

           
              
             
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
