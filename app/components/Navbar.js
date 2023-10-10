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
      if (data?.user?.email === "edwinraj1462003@gmail.com") {
        route.push('/holiday');
      } else {
        route.push('/userHoliday');
      }
    } else {
      route.push('/login');
    }
  }, [data, route]);


  if (data) {
    if (data?.user?.email === "edwinraj1462003@gmail.com") {
      return (
        <>
          <div className="nav-bar">
            <div className='w-11/12 m-auto flex justify-between'>

              <div>
                <Image
                  className='user-img'
                  src={logo}
                  height={100}
                  width={100}
                  alt="Picture of the author"
                />
              </div>
              <div className='btn-parent'>
                <div><Link href='/holiday'><button className='holiday-btn'>Holiday</button></Link></div>
                <div><Link href='/employee'><button className='emp-detail-btn'>Employee Details</button></Link></div>
                <div><Link href='/request'><button className='req-btn'>Requests</button></Link></div>
                <div><Link href='/help'><button className='approve-btn'>Leave Policy</button></Link></div>

                <img
                  src={data?.user?.image}
                  className='rounded-2xl'

                  height="35"
                  width="35"
                  alt="user image"
                  onClick={() => signOut()}
                />
              </div>
            </div>
          </div>
        </>
      );
    } else {
      return (
        <>
          <div className="nav-bar">
            <div className='w-11/12 m-auto flex justify-between'>
              <div>

                <Image
                  className='user-img'
                  width={100}
                  height={100}
                  src={logo}
                  alt="Picture of the author"
                />


              </div>
              <div className='btn-parent'>
                <div><Link href='/userHoliday'><button className='holiday-btn'>Holiday</button></Link></div>
                <div><Link href='/status'><button className='approve-btn'>Status</button></Link></div>
                <div><Link href='/help'><button className='approve-btn'>Leave Policy</button></Link></div>
                <img
                  src={data?.user?.image}
                  className='rounded-2xl'
                  height="35"
                  width="35"
                  alt="user image"
                  onClick={() => signOut()}
                />

              </div>
            </div>
          </div>
        </>
      );
    }
  }
};

export default Navbar;
