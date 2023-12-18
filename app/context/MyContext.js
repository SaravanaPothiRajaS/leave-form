import jwtDecode from 'jwt-decode';
import React, { createContext, useContext, useEffect, useState } from 'react';
// import { usePathname } from 'next/navigation'
const MyContext = createContext();

export const MyContextProvider = ({ children }) => {

  // admin , approver , user

  const [role, setRole] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState('');
  const [name, setName] = useState('');
  const [total, setTotalLeave] = useState('');
  const [comptotal, setCompTotal] = useState('');


useEffect(()=>{
  if (typeof window !== 'undefined') {
    let token = localStorage.getItem('token');
if(token){
  const decoded = jwtDecode(token);
  setEmail(decoded.email);
  setRole(decoded.role)
  setDepartment(decoded.department)
  setName(decoded.name)
}
}
},[])



useEffect(() => {
  // Update localStorage whenever the state values change
  localStorage.setItem('email', email);
  localStorage.setItem('role', role);
  localStorage.setItem('department', department);
  localStorage.setItem('name', name);
}, [email, role, department, name]);


  return (
    <MyContext.Provider value={{ role, setRole, email, setEmail, department, setDepartment, name, setName, total, setTotalLeave, comptotal, setCompTotal }}>
      {children}
    </MyContext.Provider>
  );
};

export const useMyContext = () => {
  return useContext(MyContext);
};
