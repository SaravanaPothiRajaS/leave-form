


"use client";
import axios from "axios";
import { Magic } from "magic-sdk";
import { useEffect, useState } from "react"
import React from "react";
import { useMyContext } from "../context/MyContext";
import { useRouter } from "next/navigation";
import jwtDecode from "jwt-decode";


export default function LoginTwo() {
    let { setRole, setEmail, setDepartment, setName } = useMyContext();
    const [email, setEmailLogin] = useState('');
    const [token, setToken] = useState();
    const route = useRouter();
    const signbtn = (e) => {
        e.preventDefault();

        axios.post('api/login/checkEmployee', { email })
            .then(async (res) => {
                if (res?.data?.message === "ok") {
                    const magic = new Magic(process.env.PUBLISHABLE_API_KEY);

                    try {
                        const didToken = await magic.auth.loginWithMagicLink({ email });

                        const requestBody = { email };

                        const headers = {
                            'Content-Type': 'application/json',
                            Authorization: 'Bearer ' + didToken,
                        };

                        axios.post('/api/login/login', requestBody, { headers })
                            .then(response => {
                                if (response.status === 200 || response.data.accessToken) {
                                    localStorage.setItem('token', response.data.accessToken)
                                    setToken(response.data.accessToken)
                                    route.push('/holiday');
                                }
                            })
                            .catch(error => {
                                console.error('Error response from server:', error.response);
                                // Handle specific error cases if needed
                                if (error.response && error.response.status === 401) {
                                    alert("Authentication failed");
                                } else {
                                    alert("An error occurred during login");
                                }
                            });

                    } catch (error) {
                        // Handle other errors (e.g., Magic SDK errors)
                        console.error("Error:", error);
                    }
                } else {
                    alert("Invalid user , Check your Email ");
                }

            })






    };


    const pendingJSON = () => {
        if (token) {
            let token = localStorage?.getItem('token')

            const decoded = jwtDecode(token);
            setEmail(decoded.email);
            setRole(decoded.role)
            setDepartment(decoded.department)
            setName(decoded.name)
        }
    }
    useEffect(() => {
        pendingJSON()
    }, [token])
    return (
        <div className='bg-neutral-200 w-full'>
            <div className="container bg-neutral-200 w-full ">
                <div className="row-container lg:w-1/4 sm:w-11/12 md:w-2/5" >
                    <div className="col-cont">
                        <form
                            className="border-cont"
                            onSubmit={signbtn}
                        >
                            {/* <h1 className="maa">Login</h1> */}
                            <div className="form-cont">

                                <input
                                    placeholder="Enter Your Email Address ..."
                                    type="email"
                                    id="email_field"
                                    className="form-control"
                                    value={email}
                                    onChange={(e) => setEmailLogin(e.target.value)}
                                />
                            </div>
                            <button
                                type="submit"
                                className="btn-cont"
                            >
                                Get Verification code
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
