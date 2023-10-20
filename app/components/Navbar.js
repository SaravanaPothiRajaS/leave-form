'use client';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import raise from '../images/raise1.png';
import user from '../images/user.png';
import { usePathname, useRouter } from "next/navigation";
import { useMyContext } from '../context/MyContext';
import jwtDecode from 'jwt-decode';
import axios from 'axios';

const Navbar = () => {
  const pathname = usePathname();

  const [overlay, setOverlay] = useState(false);
  const router = useRouter();

  let { role, setRole, setEmail, setDepartment, department, setName, total, comptotal, setTotalLeave, setCompTotal } = useMyContext();

  const updatedRole = role === "admin" ? "approver" : "user";
  const route = useRouter();
  const currentpath = usePathname();




  const pendingJSON = () => {
    let token = localStorage?.getItem('token')

    let headers = { authorization: token }
    const decoded = jwtDecode(token);
    setEmail(decoded.email);
    setRole(decoded.role)
    setDepartment(decoded.department)
    setName(decoded.name)

    if (department) {
      axios.post("/api/fetchemp", { department: department, role: updatedRole }, { headers })
        .then(res => {
          setTotalLeave(res.data.pendingCount)
        })
    }
    if (department) {
      axios.post("/api/compOffStatus", { department: department, role: updatedRole }, { headers })
        .then(res => {
          setCompTotal(res.data.compPendingCount)

        });
    }

  }
  console.log(total);



  useEffect(() => {
    let token = localStorage?.getItem('token')

    if (token) {
      pendingJSON();
    } else { router.push('/login') }

  }, [department])

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
              <div><Link href='/request'>
                <span className=' relative flex'>
                  <button className={`holiday-btn  ${pathname === '/request' ? 'holiday-btn   transition duration-150 border-b-2 border-transparent border-zinc-100   ' : ' transition duration-150 border-b-2 border-transparent hover:border-zinc-100 '}`}>Requests</button>
                  {total + comptotal > 0 ?
                    <span className='absolute top-0 -right-4  w-4 h-4 rounded-full text-xs text-center bg-orange-500'>{total + comptotal}</span>
                    : ""}
                </span>
              </Link></div></>}
            {/* <div><Link href='/userHoliday'><button className='holiday-btn'>Holiday</button></Link></div> */}
            {(role === "approver" || role === "user") && <div><Link href='/status'><button className={`holiday-btn  ${pathname === '/status' ? 'holiday-btn   transition duration-150 border-b-2 border-transparent border-zinc-100 ' : ' transition duration-150 border-b-2 border-transparent hover:border-zinc-100'}`}>Status</button></Link></div>}
            <div><Link href='/policy'><button className={`holiday-btn  ${pathname === '/policy' ? 'holiday-btn   transition duration-150 border-b-2 border-transparent border-zinc-100 ' : ' transition duration-150 border-b-2 border-transparent hover:border-zinc-100'}`}>Leave Policy</button></Link></div>

            <button className='border px-6 py-2 border-orange-900  font-bold rounded-full bg-orange-900 text-white hover:bg-white hover:border-white hover:text-orange-900 duration-300'
              onClick={() => { localStorage.clear(); route.push('/login'); setOverlay(false) }}
            >Logout</button>
          </div>


        </div>
      </div>
    </>
  );
}

export default Navbar;
