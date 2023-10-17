import React, { createContext, useContext, useState } from 'react';
// import { usePathname } from 'next/navigation'
const MyContext = createContext();

export const MyContextProvider = ({ children }) => {

// admin , approver , user

const[role,setRole]=useState('');
const[email,setEmail]=useState('');
const[department,setDepartment]=useState('');
const[name,setName]=useState('');
  return (
    <MyContext.Provider value={{ role,setRole,email,setEmail,department,setDepartment,name,setName}}>
      {children}
    </MyContext.Provider>
  );
};

export const useMyContext = () => {
  return useContext(MyContext);
};