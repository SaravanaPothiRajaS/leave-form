'use client';
import Link from 'next/link';
import React, { useEffect } from 'react';
import Image from 'next/image';
import raise from '../images/raise1.png'
import { useRouter } from "next/navigation";
import { useMyContext } from '../context/MyContext';

const Navbar = () => {



  let {role,setRole}=useMyContext();

  const route = useRouter();
  
      return (
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
              {(role==="admin" || role==="approver") && <><div><Link href='/employee'><button className='emp-detail-btn'>Employee Details</button></Link></div>
                <div><Link href='/request'><button className='req-btn'>Requests</button></Link></div></> }
                {/* <div><Link href='/userHoliday'><button className='holiday-btn'>Holiday</button></Link></div> */}
               {(role==="approver" || role==="user") && <div><Link href='/status'><button className='approve-btn'>Status</button></Link></div>}
                <div><Link href='/policy'><button className='approve-btn'>Leave Policy</button></Link></div>

                <img
                  src={""}
                  height="35"
                  width="35"
                  className='rounded-full'
                  alt="user image"
                />
              </div>
            </div>
          </div>
        </>
      );
    } 

export default Navbar;
