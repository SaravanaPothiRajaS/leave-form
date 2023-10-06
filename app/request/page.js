"use client"
import React, { useState, useEffect } from 'react'

import Table from '../components/Table';
import axios from 'axios';

import { toast } from 'react-toastify';

import { useSession } from "next-auth/react";
import * as XLSX from 'xlsx/xlsx.mjs';




const Request = () => {

  const email_sess = useSession();
  const sess_email = email_sess?.data?.user?.email
  const [selectedOption, setSelectedOption] = useState('request');
  const [jsonData, setJsonData] = useState([]);
  const [jsoData, setJsoData] = useState([]);

  const [employeeData, setEmployeeData] = useState([]);

  const handleSelectChange = (e) => {
    setSelectedOption(e.target.value);
  };







  const columns = [
    {
      Header: "Name",
      accessor: "name"
    },
    {
      Header: "Leave Type",
      accessor: "leaveType"
    },
    {
      Header: "Role",
      accessor: "role"
    },
    {
      Header: "From Date",
      accessor: "from"
    },
    {
      Header: "To Date",
      accessor: "to"
    },
    {
      Header: "Total Days",
      accessor: "totalDays"
    },
    {
      Header: "Taken Leave",
      accessor: "takenLeave"
    },
    {
      Header: "Available Leave",
      accessor: "availableLeave"
    },
    {
      Header: "Reason",
      accessor: "reason"
    },
    {
      Header: "Status",
      accessor: "status"
    }
  ]



  const data1 = jsoData.map((data, i) => ({
    name: data.name,
    email: data.email,
    availableLeave: data.availableLeave,
    takenLeave: data.takenLeave,
    role: data.role,
  }));


  let data = [];

  if (selectedOption === 'request') {
    data = jsonData.map((data, i) => {

      const matchingData1 = data1.find((item) => item.email === data.email);

      let availableLeave = matchingData1 ? matchingData1.availableLeave : 0;
      let takenLeave = matchingData1 ? matchingData1.takenLeave : 0;

      console.log('Available Leave:', availableLeave);


      return {
        name: data.name,
        leaveType: data.leaveType,
        role: data.role,
        from: data.fromDate,
        to: data.toDate,
        totalDays: data.totalDays,
        availableLeave: availableLeave,
        takenLeave: takenLeave,
        reason: data.reason,
        status: data.status === 'pending' ? (
          <>
            <button className='edit-btn' onClick={() => {
              Update(data.id, 'approved');
              Updateemp(data.email, availableLeave, data.totalDays, takenLeave);
              notify();
            }}>
              Approve
            </button>
            <button className='reject-edit-btn' onClick={() => {
              Update(data.id, 'rejected');
              notifys()
            }}>
              Reject
            </button>
          </>
        ) : (
          <span
            className={
              data.status === 'approved' ? 'approved' : data.status === 'rejected' ? 'rejected' : ''
            }
          >
            {data.status}
          </span>
        ),
        id: data.id,
      };
    });
  } else if (selectedOption === 'approved') {
    data = jsonData.filter((data) => data.status === 'approved').map((data, i) => {
      const matchingData1 = data1.find((item) => item.email === data.email);
      let availableLeaves = matchingData1 ? matchingData1.availableLeave : 0;


      return {
        name: data.name,
        leaveType: data.leaveType,
        role: data.role,
        from: data.fromDate,
        to: data.toDate,
        totalDays: data.totalDays,
        availableLeave: data.availableLeave,
        takenLeave: data.takenLeave,
        reason: data.reason,

        status: <span className={data.status === 'pending' ? 'pending' : data.status === 'approved' ?
          'approved' : data.status === 'rejected' ? 'rejected' : ""
        } >{data.status}</span>,
        approve: '',
        email: data.email,

        id: data.id,

        availableLeave: availableLeaves,
      };
    });

  } else if (selectedOption === 'rejected') {
    data = jsonData.filter((data) => data.status === 'rejected').map((data, i) => {
      const matchingData1 = data1.find((item) => item.email === data.email);
      let availableLeaves = matchingData1 ? matchingData1.availableLeave : 0;

      return {
        name: data.name,
        leaveType: data.leaveType,
        role: data.role,
        from: data.fromDate,
        to: data.toDate,
        totalDays: data.totalDays,
        availableLeave: data.availableLeave,
        takenLeave: data.takenLeave,
        reason: data.reason,

        status: <span className={data.status === 'pending' ? 'pending' : data.status === 'approved' ?
          'approved' : data.status === 'rejected' ? 'rejected' : ""
        } >{data.status}</span>,
        approve: '',
        email: data.email,

        id: data.id,

        availableLeave: availableLeaves,
      };
    });
  }

  const displayJSON = () => {

    axios.post("/api/fetch", { email: sess_email })
      .then(res => {
        setJsonData(res.data.reverse())

      })
  }

  useEffect(() => {
    displayJSON();
    displayJSO();
  }, [])



  const displayJSO = () => {

    axios.get("/api/empfetch")
      .then(res => {
        setJsoData(res.data)

      })
  }



  const Update = (id, status) => {

    axios
      .post(`/api/update`, { id, status })
      .then((res) => {
        console.log(res);
        if (res.status === 200) {
          displayJSON();
          displayJSO();
        }
      });
  };

  const Updateemp = (email, availableLeave, totalDays, takenLeave) => {

    axios
      .post(`/api/availableleave`, { email, availableLeave, totalDays, takenLeave })
      .then((res) => {
        console.log(res);
        if (res.status === 200) {
          displayJSON();
          displayJSO();
        }
      });
  };


  const notify = () => toast.success('Request Approved!', {
    position: "top-center",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
  });;
  const notifys = () => toast.success('Request Rejected!', {
    position: "top-center",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
  });;


  function downloadExcel(data) {



    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'Employee leave list.xlsx';
    a.click();

    URL.revokeObjectURL(url);
  }


  return (
    <>
      <main className='mt-20'>
        <div className='select-request'>
          <label>Select a Option:</label>
          <select onChange={handleSelectChange} value={selectedOption} >
            <option value="request" > Requests</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
        <Table columns={columns} data={data} className={'status-table'}
        />
        <button onClick={() => downloadExcel(data)} className="bg-gray-300 hover:bg-gray-400 ml-16 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center">
          <svg className="fill-current w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z" /></svg>
          <span>Download Excel</span>
        </button>

      </main>
    </>
  )
}

export default Request



