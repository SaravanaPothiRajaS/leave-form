// "use client";
// import { Magic } from "magic-sdk";
// import { useRouter } from "next/navigation";
// import { useState } from "react"
// import React from "react";


// export default function LoginTwo() {
//     const [email, setEmail] = useState('');
//     const router = useRouter();

//     const signbtn = async (e) => {
//         e.preventDefault();
//         const magic = new Magic(process.env.PUBLISHABLE_API_KEY);

//         try {
//             const didToken = await magic.auth.loginWithMagicLink({ email });
//             const res = await fetch("/api/login/login", {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json",
//                     Authorization: "Bearer " + didToken,
//                 },
//                 body: JSON.stringify({ email }),
//             });

//             if (res.status === 200) {
//                 const response = await res.json();
//                 console.log(response);
//             } else {
//                 // handle error response
//                 console.error("Error response from server:", res.status, res.statusText);
//             }
//         } catch (error) {
//             // handle other errors (e.g., Magic SDK errors)
//             console.error("Error:", error);
//         }


//     };

//     return (
//         <div className='bg-neutral-200'>
//             <div className="container bg-neutral-200 ">
//                 <div className="row-container">
//                     <div className="col-cont">
//                         <form
//                             className="border-cont"
//                             onSubmit={signbtn}
//                         >
//                             {/* <h1 className="maa">Login</h1> */}
//                             <div className="form-cont">
//                                 <label className="form-label" htmlFor="email_field">
//                                     Email address
//                                 </label>
//                                 <input
//                                     type="email"
//                                     id="email_field"
//                                     className="form-control"
//                                     value={email}
//                                     onChange={(e) => setEmail(e.target.value)}
//                                 />
//                             </div>
//                             <button
//                                 type="submit"
//                                 className="btn-cont"
//                             >
//                                 Sign in
//                             </button>
//                         </form>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }
