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

  const router = useRouter();

  let { role, setRole, setEmail, setDepartment, department, setName, total, comptotal, setTotalLeave, setCompTotal } = useMyContext();

  const updatedRole = role === "admin" ? "approver" : "user";
  const route = useRouter();
  const currentpath = usePathname();

  const [sideNav, setSideNav] = useState(false)


  const pendingJSON = () => {
    let token = localStorage?.getItem('token')

    const decoded = jwtDecode(token);
    setEmail(decoded.email);
    setRole(decoded.role)
    setDepartment(decoded.department)
    setName(decoded.name)
    let headers = { authorization: token }

    if (department && (role === "admin" || role === "approver")) {
      axios.post("/api/fetchemp", { department: department, role: updatedRole }, { headers })
        .then(res => {
          setTotalLeave(res.data.pendingCount)
        })
    }
    if (department && (role === "admin" || role === "approver")) {
      axios.post("/api/compOffStatus", { department: department, role: updatedRole }, { headers })
        .then(res => {
          setCompTotal(res.data.compPendingCount)

        });
    }

  }



  useEffect(() => {


    let token = localStorage.getItem('token')

    if (token) {
      pendingJSON();
    } //else { router.push('/login') }

  }, [])

  return (currentpath !== "/login") && (
    <>
      <div className="bg-blue-500">
        <nav className="relative px-4 py-4 flex justify-between items-center bg-white shadow-lg shadow-teal-900/50 nav-bar" >
          <a className="text-3xl font-bold leading-none">
            <div>
              <Image
                src={raise}
                width={100}
                height={100}
                alt="Picture of the author"
              />
            </div>
          </a>
          <div className="lg:hidden">
            <button className="navbar-burger flex items-center text-white p-3" onClick={() => { setSideNav(true) }}>
              <svg className="block h-4 w-4 fill-current" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <title>Mobile menu</title>
                <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"></path>
              </svg>
            </button>
          </div>
          <ul className="hidden absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2 lg:flex lg:mx-auto lg:flex gap-8 lg:items-center lg:w-auto lg:space-x-6">
            <li><Link href='/holiday'><p className={`text-sm  ${pathname === '/holiday' ? 'text-blue-600 font-bold' : ' text-white hover:text-gray-500'}`}>Holiday</p></Link></li>

            {(role === "admin" || role === "approver") && <><li><Link href='/employee'><p className={`text-sm  ${pathname === '/employee' ? 'text-blue-600 font-bold' : ' text-white hover:text-gray-500'}`}>Employee Details</p></Link></li>
            <span className=' relative flex'>
              <li><Link href='/request'><p className={`text-sm  ${pathname === '/request' ? 'text-blue-600 font-bold' : ' text-white hover:text-gray-500'}`}>Requests</p></Link></li>
              {total + comptotal > 0 ?
                    <span className='absolute top-0 -right-4 text-white flex items-center justify-center w-4 h-4 rounded-full text-sm text-center bg-orange-500 smallfont'>
                      {total + comptotal > 9 ? "9+" :total + comptotal }
                      </span>
                    : ""}
                </span>
              </>}

            {(role === "approver" || role === "user") && <li><Link href='/status'><p className={`text-sm  ${pathname === '/status' ? 'text-blue-600 font-bold' : ' text-white hover:text-gray-500'}`}>Status</p></Link></li>}

            <li><Link href='/policy'><p className={`text-sm  ${pathname === '/policy' ? 'text-blue-600 font-bold' : ' text-white hover:text-gray-500'}`}>Leave Policy</p></Link></li>
          </ul>
          <a className="hidden lg:inline-block py-2 px-6 bg-red-500 cursor-pointer hover:bg-white hover:text-red-600 text-sm text-white font-bold rounded-xl transition duration-200"
            onClick={() => { localStorage.clear(); route.push('/login'); }}
          >Log out</a>
        </nav>
        {sideNav ? <div className="navbar-menu relative z-50 ">
          <div className="navbar-backdrop fixed inset-0 bg-gray-800 opacity-25"></div>
          <nav className="fixed top-0 left-0 bottom-0 flex flex-col w-5/6 max-w-sm py-6 px-6 bg-white border-r overflow-y-auto d-animate-navbar">
            <div className="flex items-center mb-8">
              <a className="mr-auto text-3xl font-bold leading-none">
                <div>

                </div>
              </a>
              <button className="navbar-close" onClick={() => { setSideNav(false) }}>
                <svg className="h-6 w-6 text-gray-400 cursor-pointer hover:text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            <div>
              <ul>
                <li><Link href='/holiday'><p onClick={() => { setSideNav(false) }} className={`text-sm  border-b-2 py-3 ${pathname === '/holiday' ? 'text-blue-600 font-bold' : ' text-gray-400 hover:text-gray-500'}`}>Holiday</p></Link></li>

                {(role === "admin" || role === "approver") && <><li><Link href='/employee'><p onClick={() => { setSideNav(false) }} className={`text-sm  border-b-2  py-3 ${pathname === '/employee' ? 'text-blue-600 font-bold' : ' text-gray-400 hover:text-gray-500'}`}>Employee Details</p></Link></li>

                  <li><Link href='/request'><p onClick={() => { setSideNav(false) }} className={`text-sm border-b-2  py-3  ${pathname === '/request' ? 'text-blue-600 font-bold' : ' text-gray-400 hover:text-gray-500'}`}>Requests</p></Link></li></>}

                {(role === "approver" || role === "user") && <li><Link href='/status'><p onClick={() => { setSideNav(false) }} className={`text-sm border-b-2  py-3  ${pathname === '/status' ? 'text-blue-600 font-bold' : ' text-gray-400 hover:text-gray-500'}`}>Status</p></Link></li>}

                <li><Link href='/policy'><p onClick={() => { setSideNav(false) }} className={`text-sm border-b-2  py-3  ${pathname === '/policy' ? 'text-blue-600 font-bold' : ' text-gray-400 hover:text-gray-500'}`}>Leave Policy</p></Link></li>

              </ul>
            </div>
            <div className="mt-auto">
              <div className="pt-6">
                <a onClick={() => { localStorage.clear(); route.push('/login');  setSideNav(false) }}
                  className="block px-4 py-3 mb-2 leading-loose text-xs text-center text-white font-semibold bg-red-600 hover:bg-red-700  rounded-xl">Log out</a>
              </div>
            </div>
          </nav>
        </div> : <></>}
      </div>

    </>
  );
}

export default Navbar;
