"use client";
import '../globals.css';

import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axios from 'axios';
import Image from 'next/image';
import logo from "../images/raise.png";
import { useMyContext } from '../context/MyContext';
import jwtDecode from 'jwt-decode';


const Login = () => {

  let { setRole, setEmail, setDepartment, setName } = useMyContext();


  const [email, setEmailLogin] = useState("");
  const [password, setPassword] = useState("");

  const route = useRouter();

  const signbtn = (e) => {
    e.preventDefault()

    axios
      .post(`/api/login/login`, { email: email, password: password })
      .then((res) => {
        console.log(res);
        if (res.status === 200) {
          if (res.data.accessToken) {
            localStorage.setItem('token', res.data.accessToken)
            let token = res.data.accessToken;
            const decoded = jwtDecode(token);
            setEmail(decoded.email);
            setRole(decoded.role)
            setDepartment(decoded.department)
            setName(decoded.name)
          }
          route.push('/holiday')
        }
      });
  }




  console.log(email);
  console.log(password);


  return (
    <div className='bg-neutral-200'>
      <div className="container bg-neutral-200 ">
        <div className="row-container">
          <div className="col-cont">
            <form
              className="border-cont"

            >
              {/* <h1 className="maa">Login</h1> */}
              <Image
                src={logo}
                className='rounded-full ml-32'
                width={100}
                height={100}
                alt='Raise' />

              <div className="form-cont">
                <label className="form-label" htmlFor="email_field">
                  Email address
                </label>
                <input
                  type="email"
                  id="email_field"
                  className="form-control"
                  value={email}
                  onChange={(e) => setEmailLogin(e.target.value)}
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
                onClick={signbtn}
              >
                Sign in
              </button>


            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
