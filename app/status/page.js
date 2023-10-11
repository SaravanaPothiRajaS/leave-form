
"use client"

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import 'font-awesome/css/font-awesome.min.css';
import Table from '../components/Table';
import DynamicForm from '../components/DynamicForm';
import { validateUserEdit } from '../components/ValidationSchema';
import axios from 'axios'
const { v4: uuidv4 } = require('uuid');
import { toast } from 'react-toastify';
import { useMyContext } from '../context/MyContext';



const Status = () => {

  let {role,setRole}=useMyContext();
const [compoOff, setCompoOff] = useState(false);
  const[compoData,setCompoData]=useState(
    {
      name: "edwinraj",
      department: "test",
      date: "",
      day: 1,
      approver: 'HR',
      status: "pending",
      id: uuidv4(),
      email: "edwinraj1462003@gmail.com"
    }
  )
  console.log(compoData);
  const [formData, setFormData] = useState({
    name: "edwinraj",
    leaveType: '',
    department: '',
    fromDate: '',
    toDate: '',
    totalDays: 0,
    reason: '',
    approver: 'HR',
    status: 'pending',
    id: uuidv4(),
    email: "edwinraj1462003@gmail.com"
  });
  const [jsonData, setJsonData] = useState([]);
  const[holidayData,setHolidayData]=useState([])
  const [jsonDataCompo, setJsonDataCompo] = useState([]);
  
  console.log(formData);

  const onChange = (name, value) => {

    setFormData({
      ...formData,

      [name]: value,
    });
  };

const CompoOnChange = (name, value) => {

    setCompoData({
      ...compoData,

      [name]: value,
    });
  };



  const compoFields = [
    {
      name: 'date',
      label: 'Choose Date:',
      type: 'date',
      disabled: false,
    },
    {
      name: 'day',
      label: 'Day:',
      type: 'select',
      options: [
        { value: 0.5, label: 'Half day' },
        { value: 1, label: 'Full day' },
      ],
      disabled: false,
    },
    {
      name: 'approver',
      label: 'Approver:',
      type: 'text',
      disabled: true,

    },
  ]


  const fields = [
    {
      name: 'leaveType',
      label: 'Leave Type:',
      type: 'select',
      options: [
        { value: 'Casual Leave', label: 'Casual Leave' },
        { value: 'Maternity', label: 'Maternity' },
        { value: 'Paternity', label: 'Paternity' },
        { value: 'Leave  on Propation', label: 'Leave  on Propation' },
        { value: 'Loss of Pay', label: 'Loss of Pay' },
        { value: 'Compensatory Leave', label: 'Compensatory Leave' },
      ],
      disabled: false,
    },
    {
      name: 'department',
      label: 'Department:',
      type: 'select',
      options: [
        { value: 'Technology', label: 'Technology' },
        { value: 'Finance', label: 'Finance' },
        { value: 'Leadership', label: 'Leadership' },
        { value: 'Testing', label: 'Testing' },
        { value: 'DevOps', label: 'DevOps' },
      ],
      disabled: false,

    },
    {
      name: 'fromDate',
      label: 'Choose From Date:',
      type: 'date',
      disabled: false,
    },
    {
      name: 'toDate',
      label: 'Choose To Date:',
      type: 'date',
      disabled: false,
    },
    {
      name: 'totalDays',
      label: 'Total Days:',
      type: 'text',
      disabled: true,
    },
    {
      name: 'reason',
      label: 'Reason:',
      type: 'textarea',
      disabled: false,
    },
    {
      name: 'approver',
      label: 'Approver:',
      type: 'text',
      disabled: true,

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
      Header: "Department",
      accessor: "department"
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

  const columnsCompoff = [
    {
      Header: "Name",
      accessor: "name"
    },
    {
      Header: "Department",
      accessor: "department"
    },
    {
      Header: "Date",
      accessor: "date"
    },
    {
      Header: "Day",
      accessor: "day"
    }
  ]

  const datajs = jsonData.map((data, i) => ({
    name: data.name,
    leaveType: data.leaveType,
    department: data.department,
    from: data.fromDate,
    to: data.toDate,
    totalDays: data.totalDays,
    reason: data.reason,
    approver: data.approver,
    status: <span className={data.status === 'pending' ? 'pending' : data.status === 'approved' ?
      'approved' : data.status === 'rejected' ? 'rejected' : ""
    }>{data.status}</span>,

  }));


  const displayJSON = () => {

    axios.get("/api/fetch")
      .then(res => {
        setJsonData(res.data.reverse())

      });

      axios.get("/api/compOffStatus")
      .then(res => {
        setJsonDataCompo(res.data.reverse())

      });

      axios.get("/api/holidayfetch")
      .then(res => {
          setHolidayData(res.data)

      });
      
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

  }
  function handleinsertCompo(e) {

    e.preventDefault();
    axios.post('/api/compOffCreate', { addValue: compoData })
      .then((res) => {
        console.log(res);
        if (res.status === 200) {
          displayJSON();
          setCompoOff(false);
          notify();
          leavemail();

        }
      })
      .catch(error => {
        console.error('Error updating JSON data:', error);
      });

  }


  var holidays = [];

  for (const item of holidayData) {
    holidays?.push(item.Date);
  }
  
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


  return role==='user' || role==='approver' ? (

    < main className='parent-tag mt-28'>
      <div className='flex gap-x-8 gap-y-8  flex-wrap w-11/12 m-auto mt-7 items-center justify-between'>
        <article className="w-auto p-3 border border-gray-200 rounded-lg shadow flex flex-col ld-card">
          <div className='flex justify-between gap-6'>
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 ">Casual Leave:</h5>
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-green-900 ">15</h5>
          </div>
          <div className='flex justify-between gap-6'>
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 ">Compensatory Leave:</h5>
              <h5 className="mb-2 text-2xl font-bold tracking-tight text-green-900 ">2</h5>
          </div>


        </article>
        <div className='apply-btn flex gap-10'>
          <button onClick={() => setCompoOff(true)}>Apply Compensatory</button>
          <button onClick={overlay}>Apply Leave</button></div>
      </div>
            <Table columns={columns} data={datajs} className={'status-table'} />



      {apply && <div className='parent-border' onClick={() => setApply(false)} >
        <div className='leave-border d-animate-overlay' onClick={(e) => e.stopPropagation()}>
          <div className='heaed-and-close'>
            <b> <h2 align="center">Apply Leave</h2></b>
            <i onClick={() => setApply(false)} className="fa fa-times exit-icon" aria-hidden="true" ></i>
          </div>
          <DynamicForm fields={fields} onSubmit={handleinsert} onChange={onChange} data={formData} />
        </div>
      </div>}

{compoOff && <div className='parent-border' onClick={() => setCompoOff(false)} >
        <div className='leave-border d-animate-overlay' onClick={(e) => e.stopPropagation()}>
          <div className='heaed-and-close'>
            <b> <h2 align="center">Apply Compensatory</h2></b>
            <i onClick={() => setCompoOff(false)} className="fa fa-times exit-icon" aria-hidden="true" ></i>
          </div>
          <DynamicForm fields={compoFields}
           onSubmit={handleinsertCompo} 
          onChange={CompoOnChange} 
          data={compoData}
       
          />
        </div>
      </div>}


    </main>
  ):("")
}

export default Status


