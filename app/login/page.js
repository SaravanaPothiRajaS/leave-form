


"use client";
import axios from "axios";
import { Magic } from "magic-sdk";
import { useEffect, useState } from "react"
import React from "react";
import { useMyContext } from "../context/MyContext";
import { useRouter } from "next/navigation";


export default function LoginTwo() {
    let { setRole, setEmail, setDepartment, setName } = useMyContext();
    const [email, setEmailLogin] = useState('');
    const route = useRouter();
    let token
    const signbtn = async (e) => {
        e.preventDefault();
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
                    console.log(response);
                    if (response.status === 200 || response.data.accessToken) {
                        // console.log("fjdksfjkdsfs");
                        localStorage.setItem('token', response.data.accessToken)

                        route.push('/holiday')
                    }

                })
                .catch(error => {
                    console.error('Error response from server:', error);
                    // Handle error
                });




        } catch (error) {
            // handle other errors (e.g., Magic SDK errors)
            console.error("Error:", error);
        }


    };

    return (
        <div className='bg-neutral-200'>
            <div className="container bg-neutral-200 ">
                <div className="row-container">
                    <div className="col-cont">
                        <form
                            className="border-cont"
                            onSubmit={signbtn}
                        >
                            {/* <h1 className="maa">Login</h1> */}
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
                            <button
                                type="submit"
                                className="btn-cont"
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
