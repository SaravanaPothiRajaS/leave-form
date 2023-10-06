
"use client"

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import 'font-awesome/css/font-awesome.min.css';
import Table from '../components/Table';
import DynamicForm from '../components/DynamicForm';
import { validateUserEdit } from '../components/ValidationSchema';
import axios from 'axios'
const { v4: uuidv4 } = require('uuid');
import { useSession } from "next-auth/react";
import { toast } from 'react-toastify';



const Status = () => {
  const { data } = useSession();


  const [formData, setFormData] = useState({
    name: data?.user?.name,
    leaveType: '',
    role: '',
    fromDate: '',
    toDate: '',
    totalDays: 0,
    reason: '',
    toWhom: 'HR',
    status: 'pending',
    id: uuidv4(),
    email: data?.user?.email
  });
  const [jsonData, setJsonData] = useState([]);
  const leaveTypeObj = [
    {
      type: "Casual or Sick Leave",
      avlLeave: 2,
      color: "rgb(74 222 128)"
    },
    {
      type: "Maternity",
      avlLeave: 2,
      color: "rgb(153 246 228)"
    },
    {
      type: "Paternity",
      avlLeave: 2,
      color: "rgb(217 249 157)"
    },
    {
      type: "Loss of Pay",
      avlLeave: 2,
      color: "rgb(252 165 165)"
    },
    {
      type: "Compensatory Leave",
      avlLeave: 2,
      color: " rgb(148 163 184)"
    },
  ]
  console.log(formData);

  const onChange = (name, value) => {

    setFormData({
      ...formData,

      [name]: value,
    });
  };



  const fields = [
    {
      name: 'leaveType',
      label: 'Leave Type:',
      type: 'select',
      options: [
        { value: 'Casual  or Sick Leave', label: 'Casual  or Sick Leave' },
        { value: 'Maternity', label: 'Maternity' },
        { value: 'Paternity', label: 'Paternity' },
        { value: 'Leave  on Propation', label: 'Leave  on Propation' },
        { value: 'Loss of Pay', label: 'Loss of Pay' },
        { value: 'Compensatory Leave', label: 'Compensatory Leave' },
      ],
    },
    {
      name: 'role',
      label: 'Role:',
      type: 'select',
      options: [
        { value: 'Developer', label: 'Developer' },
        { value: 'Tester', label: 'Tester' },
        { value: 'Finance', label: 'Finance' },
        // { value: 'Others', label: 'Others' },
      ],

    },
    {
      name: 'fromDate',
      label: 'Choose From Date:',
      type: 'date',
    },
    {
      name: 'toDate',
      label: 'Choose To Date:',
      type: 'date',
    },
    {
      name: 'totalDays',
      label: 'Total Days:',
      type: 'text',
    },
    {
      name: 'reason',
      label: 'Reason:',
      type: 'textarea',
    },
    {
      name: 'toWhom',
      label: 'To whom:',
      type: 'text',

    },
  ];



  const [apply, setApply] = useState(false)

  function overlay() {
    setApply((pre) => !pre)
  }


  function applybtn() {
    setApply((pre) => !pre)

  }


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
      Header: "Reason",
      accessor: "reason"
    },
    {
      Header: "Status",
      accessor: "status"
    }
  ]

  const datajs = jsonData.map((data, i) => ({
    name: data.name,
    leaveType: data.leaveType,
    role: data.role,
    from: data.fromDate,
    to: data.toDate,
    totalDays: data.totalDays,
    reason: data.reason,
    toWhom: data.toWhom,
    status: <span className={data.status === 'pending' ? 'pending' : data.status === 'approved' ?
      'approved' : data.status === 'rejected' ? 'rejected' : ""
    }>{data.status}</span>,

  }));


  const displayJSON = () => {

    axios.get("/api/fetch")
      .then(res => {
        setJsonData(res.data.reverse())

      })
  }

  useEffect(() => {
    displayJSON();
  }, [])


  function handleinsert(e) {

    e.preventDefault();
    axios.post('/api/create', { addValue: formData })
      .then((res) => {
        console.log(res);
        if (res.status === 200) {
          displayJSON();
          setApply(false);
          notify();
          leavemail();

        }
      })
      .catch(error => {
        console.error('Error updating JSON data:', error);
      });

    // alert("hi");
  }


  var holidays = ['2023-09-13', '2023-09-15', '2023-09-18'];


  const getBusinessDaysExcludingHolidays = (startDate, endDate, holidays) => {


    var businessDays = 0;
    var currentDate = startDate;
    while (currentDate <= endDate) {

      var dayOfWeek = currentDate.getDay();
      var isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      var currentDateFormatted = currentDate.toISOString().split('T')[0];
      if (!isWeekend && !holidays.includes(currentDateFormatted)) {

        businessDays++;
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return businessDays;
  }

  useEffect(() => {

    if (formData.fromDate) {
      const date = new Date(formData.fromDate)
      var day_ofw = date.getDay();
      var is_leave = day_ofw === 0 || day_ofw === 6;
      if (is_leave) {
        alert("Its Weekend")
        setFormData({ ...formData, fromDate: '' })
      } else if (holidays.includes(date.toISOString().split('T')[0])) {
        alert(`Its Holiday ${formData.fromDate}`)
        setFormData({ ...formData, fromDate: '' })

      }

    }

    if (formData.toDate) {
      const date = new Date(formData.toDate)
      var day_ofw = date.getDay();
      var is_leave = day_ofw === 0 || day_ofw === 6;
      if (is_leave) {
        alert("Its Weekend")
        setFormData({ ...formData, toDate: '' })
      } else if (holidays.includes(date.toISOString().split('T')[0])) {
        alert(`Its Holiday ${formData.toDate}`)
        setFormData({ ...formData, toDate: '' })
      }

    }


    if (formData.fromDate && formData.toDate) {

      var startDate = new Date(formData.fromDate);
      var endDate = new Date(formData.toDate);
      var businessDays = getBusinessDaysExcludingHolidays(startDate, endDate, holidays);
      if (businessDays > 5) {
        alert("Only select 5 working days only")
        setFormData({ ...formData, toDate: '' })
      } else { setFormData({ ...formData, totalDays: businessDays }) }


    }
  }, [formData.fromDate, formData.toDate])


  const leavemail = () => {
    axios
      .post("/api/nodemailer", {})
      .then((res) => {
        console.log(res.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };


  const notify = () => toast.success('Leave Form Submitted!', {
    position: "top-center",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
  });;



  return (

    < main className='mt-20'>
      <div className='flex gap-x-8 gap-y-8  flex-wrap w-11/12 m-auto mt-7'>
        {leaveTypeObj.map((item, i) => {
          return (
            <a key={i} href="#" className="block w-56 p-3 border border-gray-200 rounded-lg shadow " style={{ backgroundColor: `${item.color}` }}>
              <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 ">{item.type}</h5>
              <p className="font-normal text-gray-700 ">Available Leave:{item.avlLeave}</p>
            </a>
          )
        })
        }


      </div>
      <div className='apply-btn'>  <button onClick={overlay}>Apply Leave</button></div>
      <Table columns={columns} data={datajs} className={'status-table'} />



      {apply && <div className='parent-border' >
        <div className='leave-border'>
          <div className='heaed-and-close'>
            <b> <h2 align="center">Apply Leave</h2></b>
            <i onClick={() => setApply(false)} className="fa fa-times exit-icon" aria-hidden="true" ></i>
          </div>
          <DynamicForm fields={fields} onSubmit={handleinsert} onChange={onChange} data={formData} validate={validateUserEdit} />
        </div>
      </div>}


    </main>
  )
}

export default Status



