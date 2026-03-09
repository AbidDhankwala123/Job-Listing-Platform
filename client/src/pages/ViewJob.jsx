import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import "../styles/ViewJob.css"
import stipend from "../assets/stipend.png"
import duration from "../assets/duration.png"
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import moment from 'moment'
import Loader from '../components/Loader'

const ViewJobDetails = ({ authenticated, setAuthenticated }) => {
  const { jobId } = useParams()
  let navigate = useNavigate();
  const [companyData, setCompanyData] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);//to move the scrollbar on the top
    axios.get(`${process.env.REACT_APP_FRONTEND_URL_FOR_JOBS}/${jobId}`)
      .then(response => {
        setCompanyData(response.data.job);
      })
      .catch(error => console.log(error))
  }, [])

  return (
    <div className='viewjob-container'>
      <Header authenticated={authenticated} setAuthenticated={setAuthenticated} />
      {companyData ?
        <><div className='jobdescription-summary'>
          <p><strong>{companyData.jobPosition} work from {companyData.remote} job at {companyData.companyName}</strong></p>
        </div><div className='jobdescription'>
            <div className='jobdescription-time'>
              <span>{moment(new Date(companyData.createdAt)).fromNow()}</span>
              <span>.</span>
              <span>{companyData.jobType}</span>
              <img src={companyData.companyLogoURL} style={{ height: "40px", width: "40px" }} alt='companyLogo' />
              <span>{companyData.companyName}</span>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <p className='companyname-text'>{companyData.jobPosition}</p>
              {!authenticated && <button className='editjob-btn' onClick={() => { navigate(`/add-job/${companyData._id}`) }}>Edit Job</button>}
            </div>

            <div style={{ marginBottom: "50px" }}>
              <p className='location'>{companyData.location} | India</p>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", width: "250px", marginBottom: "40px" }}>
              <div>
                <img src={stipend} alt='stipend' /><span className='stipend'>Stipend</span>
                <p className='salary'>Rs {companyData.salary}/month</p>
              </div>
              <div>
                <img src={duration} alt='duration' /><span className='duration'>Duration</span>
                <p className='duration-time'>6 months</p>
              </div>
            </div>

            <div style={{ marginBottom: "30px" }}>
              <h3 style={{ fontFamily: "DM Sans", marginBottom: "10px" }}>About Company</h3>
              <p style={{ fontFamily: "DM Sans", color: "#595959", lineHeight: "164.5%" }}>{companyData.aboutCompany}</p>
            </div>

            <div style={{ marginBottom: "30px" }}>
              <h3 style={{ fontFamily: "DM Sans", marginBottom: "10px" }}>About the  job/internship</h3>
              <p style={{ fontFamily: "DM Sans", color: "#595959", lineHeight: "164.5%" }}>{companyData.jobDescription}
              </p>
            </div>

            <div style={{ marginBottom: "30px" }}>
              <h3 style={{ fontFamily: "DM Sans", marginBottom: "10px" }}>Skiils(s) Required</h3>
              <div className='skills-div'>
                {companyData && companyData.skillsRequired ? companyData.skillsRequired.map((skill, index) => {
                  return (
                    <span className='skills' key={index}>{skill}</span>

                  )
                }) : ""}
              </div>
            </div>

            <div>
              <h3 style={{ fontFamily: "DM Sans", marginBottom: "10px" }}>Additional Information</h3>
              <p style={{ fontFamily: "DM Sans", color: "#595959", lineHeight: "164.5%" }}>{companyData.information}</p>
            </div>

          </div></> : <Loader />}
    </div>
  )
}

export default ViewJobDetails
