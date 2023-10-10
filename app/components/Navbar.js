'use client';
import Link from 'next/link';
import React, { useEffect } from 'react';
import Image from 'next/image';
import logo from "../images/raise.png";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

const Navbar = () => {




  const route = useRouter();
  const { data } = useSession();
  useEffect(() => {
    if (data) {
      if (data?.user?.email === "vinodhkumaryin@gmail.com") {
        route.push('/holiday');
      } else {
        route.push('/userHoliday');
      }
    } else {
      route.push('/login');
    }
  }, [data, route]);


  if (data) {
    if (data?.user?.email !== "vinodhkumaryin@gmail.com") {
      return (
        <>
          <div className='nav-bar h-16 fixed top-0'>
            <div>
              {/* <b> */}
              {/* <h1 className='leave'> */}
              <Image
                className='c-logo'
                src={logo}
                alt="Picture of the author"
              />
              {/* </h1> */}
              {/* </b> */}
            </div>
            <div className='btn-parent'>
              <div><Link href='/holiday'><button className='holiday-btn'>Holiday</button></Link></div>
              <div><Link href='/employee'><button className='emp-detail-btn'>Employee Details</button></Link></div>
              <div><Link href='/request'><button className='req-btn'>Requests</button></Link></div>
              <div><Link href='/policy'><button className='approve-btn'>Leave Policy</button></Link></div>

              <img
                src={data?.user?.image}
                height="35"
                width="35"
                className='rounded-full'
                alt="user image"
                onClick={() => signOut()}
              />
            </div>
          </div>
        </>
      );
    } else {
      return (
        <>
          <div className='nav-bar h-16 fixed top-0'>
            <div>
              <b>
                <h1 className='leave'>
                  <Image
                    className='user-img'

                    src={logo}
                    alt="Picture of the author"
                  />
                </h1>
              </b>

            </div>
            <div className='btn-parent'>
              <div><Link href='/userHoliday'><button className='holiday-btn'>Holiday</button></Link></div>
              <div><Link href='/status'><button className='approve-btn'>Status</button></Link></div>
              <div><Link href='/policy'><button className='approve-btn'>Leave Policy</button></Link></div>
              <img
                src={data?.user?.image}
                height="35"
                className='rounded-full'
                width="35"
                alt="user image"
                onClick={() => signOut()}
              />

            </div>
          </div>
        </>
      );
    }
    // } else {
    //   return (
    //     <>
    //       <div className='nav-bar'>
    //         <div>
    //           <b>
    //             <h1 className='leave'>
    //               <Image
    //                 className='user-img'
    //                 src={logo}
    //                 alt="Picture of the author"
    //               />
    //             </h1>
    //           </b>
    //         </div>
    //         <div className='btn-parent'>
    //           <div><Link href='/login'><button className='login-btn'>Login</button></Link></div>
    //         </div>
    //       </div>
    //     </>
    //   );
    // }
  };
}
export default Navbar;
