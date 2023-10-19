'use client';
import Navbar from './components/Navbar'
import './globals.css'
import { Inter } from 'next/font/google'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { MyContextProvider } from './context/MyContext';

const inter = Inter({ subsets: ['latin'] })


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>

        <MyContextProvider>
          <Navbar />
          {children}
          <ToastContainer />
        </MyContextProvider>

      </body>

    </html>
  )
}
