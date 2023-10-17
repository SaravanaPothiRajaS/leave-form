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

  const pathname = usePathname();

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
            <div><Link href='/holiday'><button className={`holiday-btn  ${pathname === '/holiday' ? 'holiday-btn   transition duration-150 border-b-2 border-transparent border-zinc-100 ' : ' transition duration-150 border-b-2 border-transparent hover:border-zinc-100'}`}>Holiday</button></Link></div>
            {(role === "admin" || role === "approver") && <><div><Link href='/employee'><button className={`holiday-btn  ${pathname === '/employee' ? 'holiday-btn   transition duration-150 border-b-2 border-transparent border-zinc-100 ' : 'transition duration-150 border-b-2 border-transparent hover:border-zinc-100'}`}>Employee Details</button></Link></div>
              <div><Link href='/request'><button className={`holiday-btn  ${pathname === '/request' ? 'holiday-btn   transition duration-150 border-b-2 border-transparent border-zinc-100 ' : ' transition duration-150 border-b-2 border-transparent hover:border-zinc-100'}`}>Requests</button></Link></div></>}
            {/* <div><Link href='/userHoliday'><button className='holiday-btn'>Holiday</button></Link></div> */}
            {(role === "approver" || role === "user") && <div><Link href='/status'><button className={`holiday-btn  ${pathname === '/status' ? 'holiday-btn   transition duration-150 border-b-2 border-transparent border-zinc-100 ' : ' transition duration-150 border-b-2 border-transparent hover:border-zinc-100'}`}>Status</button></Link></div>}
            <div><Link href='/policy'><button className={`holiday-btn  ${pathname === '/policy' ? 'holiday-btn   transition duration-150 border-b-2 border-transparent border-zinc-100 ' : ' transition duration-150 border-b-2 border-transparent hover:border-zinc-100'}`}>Leave Policy</button></Link></div>

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
          {overlay && <div className='fixed flex w-11/12 mt-8 justify-end h-screen ' >
            <div className=' w-44 h-36 top-0 rounded-md  d-animate-overlay animate-spin shadow-2xl shadow-slate-900   bg-white' onMouseOver={() => setOverlay(true)} onMouseOut={() => setOverlay(false)} >

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
