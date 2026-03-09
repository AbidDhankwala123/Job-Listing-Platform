import React, { useState, useEffect } from 'react'
import "../styles/AddJob.css"
import { useNavigate, useParams } from 'react-router-dom'
import axios from "axios"
import { toast, ToastContainer } from "react-toastify"

const AddJob = ({ listJobs, setDisplaySuccess }) => {

  const [companyName, setCompanyName] = useState("");
  const [companyLogoURL, setCompanyLogoURL] = useState("");
  const [jobPosition, setJobPosition] = useState("");
  const [salary, setSalary] = useState("");
  const [jobType, setJobType] = useState("");
  const [remote, setRemote] = useState("");
  const [location, setLocation] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [aboutCompany, setAboutCompany] = useState("");
  const [skillsRequired, setSkillsRequired] = useState([]);
  const [information, setInformation] = useState("");
  const { jobId } = useParams();

  const companyDetailsObject = {
    companyName,
    companyLogoURL,
    jobPosition,
    salary,
    jobType,
    remote,
    location,
    jobDescription,
    aboutCompany,
    skillsRequired,
    information
  }

  let navigate = useNavigate();

  const addJob = e => {
    e.preventDefault();

    axios.post(process.env.REACT_APP_FRONTEND_URL_FOR_JOBS, companyDetailsObject, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("jwttoken")
      }
    })
      .then(response => {
        listJobs();
        navigate("/");
        setDisplaySuccess(response.data.message);
      })
      .catch(error => {
        if (error.response.status === 401) {
          toast.error("Session expired. Redirecting to Home Page", {
            position: "top-center",
            autoClose: 2000
          })
          localStorage.clear();
          setTimeout(() => {
            navigate("/");
          }, 2000);
          return;
        }
        toast.error(error.response.data.message, {
          position: "top-center",
          autoClose: 1000
        });
        console.log(error);
      })
  }

  useEffect(() => {
    if (jobId) {
      axios.get(`${process.env.REACT_APP_FRONTEND_URL_FOR_JOBS}/${jobId}`)
        .then(response => {
          console.log(response);
          setCompanyName(response.data.job.companyName);
          setCompanyLogoURL(response.data.job.companyLogoURL);
          setJobPosition(response.data.job.jobPosition);
          setSalary(response.data.job.salary);
          setJobType(response.data.job.jobType);
          setRemote(response.data.job.remote);
          setLocation(response.data.job.location);
          setJobDescription(response.data.job.jobDescription);
          setAboutCompany(response.data.job.aboutCompany);
          setSkillsRequired(response.data.job.skillsRequired);
          setInformation(response.data.job.information);

        })
        .catch(error => {
          toast.error(error.response.data.message, {
            position: "top-center"
          });
          console.log(error);
        })
    }

  }, [])

  const editJob = e => {
    e.preventDefault();
    axios.put(`${process.env.REACT_APP_FRONTEND_URL_FOR_JOBS}/${jobId}`, companyDetailsObject, {
      headers:
      {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("jwttoken")
      }
    })
      .then(response => {
        console.log(response);
        setDisplaySuccess(response.data.message);
        navigate("/");
      })
      .catch(error => {
        console.log(error);
        if (error.response.status === 401) {
          toast.error("Session expired. Redirecting to Home Page", {
            position: "top-center",
            autoClose: 2000
          })
          localStorage.clear();
          setTimeout(() => {
            navigate("/");
          }, 2000);
          return;
        }
        toast.error(error.response.data.message);
      })
  }
  return (
    <div className='addjob-container'>
      <div className='addjob-form'>
        <h2>{jobId ? "Edit Job Description" : "Add job description"}</h2>
        <form className='addform' onSubmit={jobId ? editJob : addJob}>
          <div className="addform-div">
            <span>Company Name</span>
            <input type="text" name="companyName" required value={companyName} onChange={e => setCompanyName(e.target.value)} placeholder='Enter your company name here' className='job-input' />
          </div>
          <div className="addform-div">
            <span>Add logo URL</span>
            <input type="text" name="companyLogoURL" required value={companyLogoURL} onChange={e => setCompanyLogoURL(e.target.value)} placeholder='Enter the link' className='job-input' />
          </div>
          <div className="addform-div">
            <span>Job position</span>
            <input type="text" name="jobPosition" required value={jobPosition} onChange={e => setJobPosition(e.target.value)} placeholder='Enter job position' className='job-input' />
          </div>
          <div className="addform-div">
            <span>Monthly salary</span>
            <input type="text" name="salary" required value={salary} onChange={e => setSalary(e.target.value)} placeholder='Enter Amount in rupees' className='job-input' />
          </div>
          <div className="addform-div">
            <span>Job Type</span>
            <select name="jobType" className='dropdown' required value={jobType} onChange={e => setJobType(e.target.value)}>
              <option>Select</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Internship">Internship</option>
            </select>
          </div>
          <div className="addform-div">
            <span>Remote/office</span>
            <select name="remote" className='dropdown' required value={remote} onChange={e => setRemote(e.target.value)}>
              <option>Select</option>
              <option value="Remote">Remote</option>
              <option value="Office">Office</option>
            </select>
          </div>
          <div className="addform-div">
            <span>Location</span>
            <input type="text" name="location" required value={location} onChange={e => setLocation(e.target.value)} placeholder='Enter Location' className='job-input' />
          </div>
          <div className="addform-div">
            <span>Job Description</span>
            <textarea name="jobDescription" required value={jobDescription} onChange={e => setJobDescription(e.target.value)} placeholder='Type the job description' className='job-description' />
          </div>
          <div className="addform-div">
            <span>About Company</span>
            <textarea name="aboutCompany" required value={aboutCompany} onChange={e => setAboutCompany(e.target.value)} placeholder='Type about your company' className='about-company' />
          </div>
          <div className="addform-div">
            <span>Skills Required</span>
            <input type="text" name="skillsRequired" required value={skillsRequired} onChange={e => setSkillsRequired(e.target.value)} placeholder='Enter the must have skills' className='job-input' />
          </div>
          <div className="addform-div">
            <span>Information</span>
            <input type="text" name="information" required value={information} onChange={e => setInformation(e.target.value)} placeholder='Enter the additional information' className='job-input' />
          </div>
          <div className='btns-container'>
            <button className='btns cancel-btn' onClick={() => navigate("/")}>Cancel</button>
            <button className='btns addjob-btn'>{jobId ? "Edit Job" : "+ Add Job"}</button>
          </div>
        </form>
      </div>
      <div className='wallpaper-container'>
        <p>{jobId ? "Recruiter edit job details here" : "Recruiter add job details here"}</p>
      </div>
      <ToastContainer />
    </div>
  )
}

export default AddJob
