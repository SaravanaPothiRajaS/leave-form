"use client"
import React, { useState, useEffect } from 'react'

import Table from '../components/Table';
import axios from 'axios';

import { toast } from 'react-toastify';

import * as XLSX from 'xlsx/xlsx.mjs';
import { useMyContext } from '../context/MyContext';
import { useRouter } from 'next/navigation';
import jwtDecode from 'jwt-decode';




const Request = () => {

  const router = useRouter();
  let { role, department, setTotalLeave, email,total, setCompTotal, setEmail, setDepartment, setRole, setName } = useMyContext();

  const [selectedOption, setSelectedOption] = useState('all');
  const [jsonData, setJsonData] = useState([]);
  const [jsoData, setJsoData] = useState([]);
  const [jsonDataCompo, setJsonDataCompo] = useState([]);

  const [employeeData, setEmployeeData] = useState([]);

  const updatedRole = role === "admin" ? "approver" : "user";

  let fromEmail = email;


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
      Header: "Leave Availed",
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



  const compOffColumns = [
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
    },
    {
      Header: "Status",
      accessor: "status"
    }
  ]

  function monthsDiff(startDate, endDate) {
    let fromDate = new Date(startDate);
    let toDate = new Date(endDate);
    let startYear = fromDate.getFullYear();
    let startMonth = fromDate.getMonth();

    let endYear = toDate.getFullYear();
    let endMonth = toDate.getMonth();

    let months = (endYear - startYear) * 12 + (endMonth - startMonth);

    return months + 1;
  }

  const data1 = jsoData.map((data, i) => ({
    name: data.name,
    email: data.email,
    availableLeave: data.availableLeave,
    takenLeave: data.takenLeave,
    department: data.department,
  }));


  let data = [];
  let downloadData = jsonData?.map((data, i) => {

    const matchingData1 = data1.find((item) => item.email === data.email);

    let availableLeave = matchingData1 ? matchingData1.availableLeave : 0;
    let takenLeave = matchingData1 ? matchingData1.takenLeave : 0;



    return {
      name: data.name,
      leaveType: data.leaveType,
      department: data.department,
      from: data.fromDate,
      to: data.toDate,
      totalDays: data.totalDays,
      availableLeave: availableLeave,
      takenLeave: takenLeave,
      reason: data.reason,
      status: data.status,
      id: data.id,
    };
  });;

  if (selectedOption === 'all') {
    //
    if (role === "approver") {
      data = jsonData?.filter((data) => data.status)?.map((data, i) => {

        const matchingData1 = data1.find((item) => item.email === data.email);

        let availableLeave = matchingData1 ? matchingData1.availableLeave : 0;
        let takenLeave = matchingData1 ? matchingData1.takenLeave : 0;



        return {
          name: data.name,
          leaveType: data.leaveType,
          department: data.department,
          from: data.fromDate,
          to: data.toDate,
          totalDays: data.totalDays > 40 ? monthsDiff(data.fromDate, data.toDate) + " Months" : data.totalDays,
          availableLeave: availableLeave,
          takenLeave: takenLeave,
          reason: data.reason,
          status: data.status === 'pending' && 'approved' && 'rejected' ? (
            <>
              <button className='edit-btn' onClick={() => {
                // Update(data.id, 'approved');

                Updateemp(data.email, availableLeave, data.totalDays, takenLeave, data.id, data.leaveType, 'approved', data.name);
              }}>
                Approve
              </button>
              <button className='reject-edit-btn' onClick={() => {
                Update(data.id, 'rejected', data.email, data.name);

              }}>
                Reject
              </button>
            </>
          ) : (
            <span
              className={
                data.status === 'request' ? 'request' : data.status === 'approved' ? 'approved' : data.status === 'rejected' ? 'rejected' : ''
              }
            >
              {data.status}
            </span>
          ),
          id: data.id,
        };
      });

    }
    else if (role === 'admin') {
      data = jsonData?.filter((data) => data.status === 'pending' && 'approved' && 'rejected')?.map((data, i) => {

        const matchingData1 = data1.find((item) => item.email === data.email);

        let availableLeave = matchingData1 ? matchingData1.availableLeave : 0;
        let takenLeave = matchingData1 ? matchingData1.takenLeave : 0;



        return {
          name: data.name,
          leaveType: data.leaveType,
          department: data.department,
          from: data.fromDate,
          to: data.toDate,
          totalDays: data.totalDays,
          availableLeave: availableLeave,
          takenLeave: takenLeave,
          reason: data.reason,
          status: data.status === 'pending' && 'approved' && 'rejected' ? (
            data.role === "approver" ? <>
              <button className='edit-btn' onClick={() => {
                // Update(data.id, 'approved');

                Updateemp(data.email, availableLeave, data.totalDays, takenLeave, data.id, data.leaveType, 'approved', data.name);

              }}>
                Approve
              </button>
              <button className='reject-edit-btn' onClick={() => {
                Update(data.id, 'rejected', data.email, data.name);

              }}>
                Reject
              </button>
            </> : <span className='pending' >pending</span>
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
    }


    if (role === "admin") {
      data = jsonData?.filter((data) => data.status)?.map((data, i) => {

        const matchingData1 = data1.find((item) => item.email === data.email);

        let availableLeave = matchingData1 ? matchingData1.availableLeave : 0;
        let takenLeave = matchingData1 ? matchingData1.takenLeave : 0;



        return {
          name: data.name,
          leaveType: data.leaveType,
          department: data.department,
          from: data.fromDate,
          to: data.toDate,
          totalDays: data.totalDays,
          availableLeave: availableLeave,
          takenLeave: takenLeave,
          reason: data.reason,
          status: data.status === 'pending' ? (
            data.role === "approver" ? <>
              <button className='edit-btn' onClick={() => {
                // Update(data.id, 'approved');

                Updateemp(data.email, availableLeave, data.totalDays, takenLeave, data.id, data.leaveType, 'approved', data.name);

              }}>
                Approve
              </button>
              <button className='reject-edit-btn' onClick={() => {
                Update(data.id, 'rejected', data.email, data.name);

              }}>
                Reject
              </button>
            </> : <span className='pending' >pending</span>
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
    }



    //
  }
  else if (selectedOption === 'request') {
    data = jsonData?.filter((data) => data.status === 'pending').map((data, i) => {
      const matchingData1 = data1.find((item) => item.email === data.email);

      let availableLeave = matchingData1 ? matchingData1.availableLeave : 0;
      let takenLeave = matchingData1 ? matchingData1.takenLeave : 0;

      return {
        name: data.name,
        leaveType: data.leaveType,
        department: data.department,
        from: data.fromDate,
        to: data.toDate,
        totalDays: data.totalDays,
        availableLeave: availableLeave,
        takenLeave: takenLeave,
        reason: data.reason,

        status: data.status === 'pending' ? (
          <>
            <button className='edit-btn' onClick={() => {
              // Update(data.id, 'approved');

              Updateemp(data.email, availableLeave, data.totalDays, takenLeave, data.id, data.leaveType, 'approved', data.name);

            }}>
              Approve
            </button>
            <button className='reject-edit-btn' onClick={() => {
              Update(data.id, 'rejected', data.email, data.name);

            }}>
              Reject
            </button>
          </>
        ) : (
          <span
            className={
              data.status === 'request' ? 'request' : data.status === 'approved' ? 'approved' : data.status === 'rejected' ? 'rejected' : ''
            }
          >
            {data.status}
          </span>
        ),
        id: data.id,
      };
    });

  }

  else if (selectedOption === 'approved') {
    data = jsonData?.filter((data) => data.status === 'approved').map((data, i) => {
      const matchingData1 = data1.find((item) => item.email === data.email);
      let availableLeave = matchingData1 ? matchingData1.availableLeave : 0;
      let takenLeave = matchingData1 ? matchingData1.takenLeave : 0;

      return {
        name: data.name,
        leaveType: data.leaveType,
        department: data.department,
        from: data.fromDate,
        to: data.toDate,
        totalDays: data.totalDays,
        // availableLeave: data.availableLeave,
        takenLeave: takenLeave,
        reason: data.reason,

        status: <span className={data.status === 'pending' ? 'pending' : data.status === 'approved' ?
          'approved' : data.status === 'rejected' ? 'rejected' : ""
        } >{data.status}</span>,
        approve: '',
        email: data.email,

        id: data.id,

        availableLeave: availableLeave,
      };
    });

  } else if (selectedOption === 'rejected') {
    data = jsonData?.filter((data) => data.status === 'rejected').map((data, i) => {
      const matchingData1 = data1.find((item) => item.email === data.email);
      let availableLeave = matchingData1 ? matchingData1.availableLeave : 0;
      let takenLeave = matchingData1 ? matchingData1.takenLeave : 0;
      return {
        name: data.name,
        leaveType: data.leaveType,
        department: data.department,
        from: data.fromDate,
        to: data.toDate,
        totalDays: data.totalDays,
        // availableLeave: data.availableLeave,
        takenLeave: takenLeave,
        reason: data.reason,

        status: <span className={data.status === 'pending' ? 'pending' : data.status === 'approved' ?
          'approved' : data.status === 'rejected' ? 'rejected' : ""
        } >{data.status}</span>,
        approve: '',
        email: data.email,

        id: data.id,

        availableLeave: availableLeave,
      };
    });
  } else if (selectedOption === 'compensatory') {
    data = jsonDataCompo?.map((data, i) => {

      return {
        name: data.name,
        department: data.department,
        date: data.date,
        day: data.day,
        status: data.status === 'pending' ? (
          <>
            <button className='edit-btn' onClick={() => {
              // UpdateempCompOff(data.email, data.day, data.name,'approved');
              UpdateCompOff(data.id, data.email, data.day, data.name, 'approved');
              // notify();
              // leavemail(, 'approved', data.email)
            }}>
              Approve
            </button>
            <button className='reject-edit-btn' onClick={() => {
              UpdateCompOff(data.id, data.email, data.day, data.name, 'rejected');

              // notifys();
              // leavemail( data.name,'rejected')
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
      };
    });
  }
  const pendingJSON = () => {
    let token = localStorage.token
    let headers = { authorization: token }
    const decoded = jwtDecode(token);
    setEmail(decoded.email);
    setRole(decoded.role)
    setDepartment(decoded.department)
    setName(decoded.name)
    if (token) {
      if (department) {
        axios.post("/api/fetchemp", { department: department, role: updatedRole }, { headers })
          .then(res => {
            setTotalLeave(res.data.pendingCount)
          })
      }
      if (department) {
        axios.post("/api/compOffStatus", { department: department, role: updatedRole }, { headers })
          .then(res => {
            setCompTotal(res.data.compPendingCount)

          });
      }
    } else { router.push('/login') }

  }
  const displayJSON = () => {
    let token = localStorage.token
    let headers = { authorization: token }
    if (token) {
      if (department && updatedRole) {
        axios.post("/api/fetchemp", { department: department, role: updatedRole }, { headers })
          .then(res => {
            setJsonData(res.data?.filteredData?.reverse())
          })
      }
      if (department && updatedRole) {
        axios.post("/api/compOffStatus", { department: department, role: updatedRole }, { headers })
          .then(res => {
            setJsonDataCompo(res.data?.filteredData?.reverse())

          });
      }
    } else { router.push('/login') }
    pendingJSON();
  }

  useEffect(() => {
    displayJSON();
    displayJSO();
  }, [department, updatedRole])



  const displayJSO = () => {
    let token = localStorage.token
    let headers = { authorization: token }
    if (token) {
      axios.post("/api/request", {}, { headers })
        .then(res => {
          setJsoData(res.data)

        })
    } else { router.push('/login') }

  }

  const UpdateempCompOff = (email, day, name, status) => {
    let token = localStorage.token
    let headers = { authorization: token }
    if (token) {
      axios
        .post(`/api/CompLeave`, { email, day }, { headers })
        .then((res) => {
          if (res.status === 200) {
            compOffmail(name, status, email,total)
            if (status === "approved") {
              notify();
              displayJSON();
              displayJSO();
            } else {
              notifys()
              displayJSON();
              displayJSO();
            }
          }
        });
    } else { router.push('/login') }

  }
  //req
  const UpdateCompOff = (id, email, day, name, status) => {
    let token = localStorage.token
    let headers = { authorization: token }
    if (token) {
      axios
        .post(`/api/updateCompStatus`, { id, status }, { headers })
        .then((res) => {
          if (res.status === 200) {
            UpdateempCompOff(email, day, name, status)

          }
        });
    } else { router.push('/login') }

  }

  const Update = (id, status, email, name) => {
    let token = localStorage.token
    let headers = { authorization: token }
    if (token) {
      axios
        .post(`/api/update`, { id, status }, { headers })
        .then((res) => {
          if (res.status === 200) {

            notifys();
            leavemail(name, status, email,total)
            displayJSON();
            displayJSO();
          }
        });
    } else { router.push('/login') }

  };
  const Updateemp = (email, availableLeave, totalDays, takenLeave, id, leaveType, status, name) => {
    let token = localStorage.token
    let headers = { authorization: token }
    if (token) {
      axios
        .post(`/api/availableleave`, { email, availableLeave, totalDays, takenLeave, id, leaveType }, { headers })
        .then((res) => {
          if (res.status === 200) {
            axios
              .post(`/api/update`, { id, status }, { headers })
              .then((res) => {
                if (res.status === 200) {
                  displayJSON();
                  displayJSO();
                  notify();
                  leavemail(name, status, email,total)


                }
              });
          }
        });
    } else { router.push('/login') }

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


  function downloadExcel(downloadData) {

    const jsonDataCopy = downloadData;
    jsonDataCopy.forEach((item) => {
      delete item.id;
    });


    const ws = XLSX.utils.json_to_sheet(jsonDataCopy);
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


  const leavemail = (name, status, email,total) => {
    let token = localStorage.token
    let headers = { authorization: token }
    if (token) {
      axios
        .post("/api/nodemail", { name: name, status: status, email: email, fromEmail: fromEmail,total:total, department:department }, { headers })
        .then((res) => {
        })
        .catch((error) => {
          console.error(error);
        });
    } else { router.push('/login') }


  };
  const compOffmail = (name, status, email,total) => {
    let token = localStorage.token
    let headers = { authorization: token }
    if (token) {
      axios
        .post("/api/compoffnodemail", { name: name, status: status, email: email, fromEmail: fromEmail,total:total, department:department }, { headers })
        .then((res) => {
        })
        .catch((error) => {
          console.error(error);
        });
    } else { router.push('/login') }


  };

  return (role === "admin" || role === "approver") ? (
    <>
      <main>
        <div className='select-request w-11/12 m-auto'>
          <label>Select a Option:</label>
          <select onChange={handleSelectChange} value={selectedOption} className='h-8 w-32 rounded-md border-0 bg-transparent py-0 pl-2 pr-7 text-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm'>
            <option value="all" defaultChecked > All</option>
            <option value="request"> Requests</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="compensatory">Compensatory</option>
          </select>
        </div>
        <Table columns={selectedOption === "compensatory" ? compOffColumns : columns} data={data} className={'status-table'}
        />
        {(role === "admin" || role === "approver") ? <div className='w-11/12 m-auto'>
          <button onClick={() => downloadExcel(downloadData)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center">
            <svg className="fill-current w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z" /></svg>
            <span title='Download histoty as excel file'>History(Excel)</span>
          </button>
        </div> : ''}
      </main>
    </>
  ) : ("")
}

export default Request;