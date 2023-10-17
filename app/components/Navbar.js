'use client';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import raise from '../images/raise1.png';
import user from '../images/user.png';

import { usePathname, useRouter } from "next/navigation";
import { useMyContext } from '../context/MyContext';
import jwtDecode from 'jwt-decode';

const Navbar = () => {


  const [overlay, setOverlay] = useState(false);

  let { role, setRole, setEmail } = useMyContext();

  const route = useRouter();
  const currentpath = usePathname();
  console.log(currentpath);

  useEffect(() => {
    let token = localStorage.token;
    if (token) {

      const decoded = jwtDecode(token);
      setEmail(decoded.email);
      setRole(decoded.role)
    } else { route.push('/login') }
  }, [])

  return (currentpath !== "/login") && (
    <>
      <div className='nav-bar h-16 fixed top-0'>

        <div className='flex justify-between w-11/12 m-auto  '>
          <div>
            <Image
              src={raise}
              width={100}
              height={100}
              alt="Picture of the author"
            />
          </div>
          <div className='btn-parent'>
            <div><Link href='/holiday'><button className='holiday-btn'>Holiday</button></Link></div>
            {(role === "admin" || role === "approver") && <><div><Link href='/employee'><button className='emp-detail-btn'>Employee Details</button></Link></div>
              <div><Link href='/request'><button className='req-btn'>Requests</button></Link></div></>}
            {/* <div><Link href='/userHoliday'><button className='holiday-btn'>Holiday</button></Link></div> */}
            {(role === "approver" || role === "user") && <div><Link href='/status'><button className='approve-btn'>Status</button></Link></div>}
            <div><Link href='/policy'><button className='approve-btn'>Leave Policy</button></Link></div>

            <Image
              src={user}
              height="35"
              width="35"
              className='rounded-full bg-white'
              onMouseMove={() => setOverlay(true)}
              onMouseOut={() => setOverlay(false)}
              alt="user image"
            />
          </div>
          {overlay && <div className='fixed flex w-11/12 mt-8 justify-end h-screen' >
            <div className=' w-36 h-32 top-0 rounded-md  d-animate-overlay animate-spin  bg-white' onMouseOver={() => setOverlay(true)} onMouseOut={() => setOverlay(false)} >

              <p className='flex justify-center mt-3'>Name :Edwin</p>
              <div className='flex justify-center mt-7'>
                <button className='border px-6 py-2  rounded-full bg-red-500 text-white hover:bg-white hover:border-red-500 hover:text-red-500 duration-300'
                  onClick={() => { localStorage.clear(); route.push('/login') }}
                >Logout</button>
              </div>
            </div>
          </div>}

        </div>
      </div>
    </>
  );
}

export default Navbar;
