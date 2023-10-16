"use client";

import axios from "axios";
import { useEffect, useState } from "react"


export default function Help() {
  const [jsonData, setJsonData] = useState([])

  const displayJSON = () => {

    axios.get("/api/holidayfetch")
      .then(res => {
        setJsonData(res.data)

      })
  }

  useEffect(() => {
    displayJSON();
  }, [])



  return <div className="w-5/6 m-auto mt-16">

    <h2 className="font-semibold mb-5 mt-20">I. INTRODUCTION</h2>

    <p class="mb-3 text-gray-900 ">

      1PS Software and Solutions Private Limited has to ensure that employees in the organization getadequate time to rest and relax away from work.
      This Leave Policy outlines different types ofleaves that can be availed by the employees.
      This policy also outlines the procedures andguidelines while availing leave like eligibility, approval process, communication and more, Thispolicy takes effect from 01 Jan 2023.
      II.
      All the employees must notify the Manager and HR in terms of leave/WFH through the Microsoftform (http://form.
      raisetech.
      iol).
    </p>

    <h2 className="font-semibold mb-5">II. TYPES OF LEAVE:</h2>






    <h2 className="font-semibold mb-5"> (a) DECLARED HOLIDAYS:1.</h2>


    <div className="pb-6">
      <table className="w-11/12 text-center border bg-white shadow-lg p-6 m-auto">
        <thead className=" bg-slate-300  ">
          <tr >
            <th >Date</th>
            <th>Day</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {jsonData.map((data, i) => (
            <tr key={i} >
              <td className=" pt-2 pb-2">{data.Date}</td>
              <td className=" pt-2 pb-2">{data.Day}</td>
              <td className=" pt-2 pb-2">{data.Description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    <h2 className="font-semibold mb-5 ">(b) CASUAL LEAVE (including sick leave):</h2>
    <p class="text-gray-900 mb-3">

      Each confirmed employee will be eligible for an annual leave of 23 days per annum (Jan - Dec).
      Ofthe 23 days, 5 days should be 'Block leave* taken at a stretch.
      The balance of 18 days can beavailed as per employees' requirement and convenience.
      *Block leave must be taken by all confirmed employees to get extended rest and refreshment.
      Every confirmed employee is entitled to get 5 working days of Block leave during a calendar year (atotal of 9 days including the earlier and following weekends).
      The eligible employees must blocktheir dates at the beginning of the calendar year.
      Once blocked, the dates cannot be changed.

    </p>

    <h2 className="font-semibold mb-5"> (c) MATERNITY LEAVE:</h2>

    <p class="text-gray-900 mb-3">

      <b>1</b>.All permanent female employees shall be entitled to maternity leave as per Maternity BenefitAct 2016, with full pay for a period of continuous 26 weeks.<br />
      <b>2</b>.Leave taken for prenatal treatment for the first 9 months of pregnancy will be considered asregular leave and not maternity leave.<br />
      <b>3</b>.A woman employee can take maternity leave from 4 weeks before the expected date ofdelivery.<br />
      <b>4</b>.in case of miscarriage, a woman shall, on production of such proof as may be prescribed, beentitled to leave with wages at the rate of maternity benefit for a period of six weeksimmediately following the day of her miscarriage.<br />
      <b>5</b> .Women employees should approach the respective head for approval of leave and notify theHR.<br />
      <b>6</b> .The enmployee must also submit a certificate from the Doctor while coming back and joining theoffice after leave.<br />
    </p>


    <h2 className="font-semibold mb-5">(d) PATERNITY LEAVE:</h2>
    <p class="text-gray-900 mb-3">


      <b>1</b>.All permanent male employees are eligible for paternity leave.<br />
      <b>2</b>.A maximum of 10 days of paternity leave can be availed by an employee.<br />
      <b>3</b>.The paternity leave must be taken within 15 days of childbirth, failing which the leave will lapse.<br />
      <b>4</b>.The leave must be taken at a stretch.<br />
      <b>5</b>.Paternity leave will commence from the actual date of delivery baby.<br />
    </p>

    <h2 className="font-semibold mb-5"> (e) LEAVE ON PROBATION:</h2>
    <p class="text-gray-900 mb-3">

      An employee under probation is eligible for one day leave per month until their contirmation.
      Theextra days of leave shall be treated as LOP.
    </p>
    <h2 className="font-semibold mb-5"> (f) LOSS OF PAY (LOP):</h2>
    <p class="text-gray-900 mb-3">

      <b>1</b>.Unauthorised absence will be considered as LOP and may be subject to disciplinary action.<br />
      <b>2</b>.Any leave beyond the annual availability will be considered as LOP.<br />
    </p>
    <h2 className="font-semibold mb-5">Note:</h2>
    <p class="text-gray-900 mb-3">

      <b>1</b>.All employees must apply leave to the respective team lead through leave form.<br />
      <b>2</b>.Leave application for a duration of more than one week should be made at least 15 days inadvance.<br />
      <b>3</b>.Continuous absence without any intimation will be considered as wilful negligence and subjectto disciplinary action.<br />
      <b>4</b>.Compensatory off for the declared holidays (appended below) may be availed withthe approval of the Managers.
      The compensatory off shall lapse if not claimed within a monthfrom the date of the declared holiday.<br />
    </p>

  </div>
}