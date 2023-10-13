import React, { createContext, useContext, useState } from 'react';
// import { usePathname } from 'next/navigation'
const MyContext = createContext();

export const MyContextProvider = ({ children }) => {

// admin , approver , user

const[role,setRole]=useState('approver')
  return (
    <MyContext.Provider value={{ role,setRole}}>
      {children}
    </MyContext.Provider>
  );
};

export const useMyContext = () => {
  return useContext(MyContext);
};