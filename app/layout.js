'use client';
import Navbar from './components/Navbar'
import './globals.css'
import { Inter } from 'next/font/google'
import { SessionProvider } from "next-auth/react";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const inter = Inter({ subsets: ['latin'] })


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>

 <SessionProvider >
        <Navbar />
        {children}
        <ToastContainer />
 </SessionProvider >
   
        </body>

    </html>
  )
}
