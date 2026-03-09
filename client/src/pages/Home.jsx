import React, { useEffect, useState } from 'react'
import "../styles/Home.css"
import Header from '../components/Header'
import Loader from '../components/Loader'
import search from "../assets/search.png"
import people from "../assets/people.png"
import rupees from "../assets/rupees.png"
import india from "../assets/india.png"
import { useNavigate } from 'react-router-dom'
import axios from "axios"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css";
import tokenExists from '../constants/exists'


const Home = ({ setCompanyData, authenticated, setAuthenticated, displaySuccess, listJobs, companyData, setDisplaySuccess }) => {
  const [jobPosition, setJobPosition] = useState("");
  const [skillsRequired, setSkillsRequired] = useState("");
  const [skillsArray, setSkillsArray] = useState([]);

  let navigate = useNavigate();

  useEffect(() => {
    if(tokenExists()){
      setAuthenticated(false);
    }
    else{
      setAuthenticated(true);
    }
  },[authenticated,setAuthenticated])

  useEffect(() => {
    displaySuccess && toast.success(displaySuccess, {
      position: "top-center",
      autoClose: 1000
    })
    setDisplaySuccess("");
  }, [])



  useEffect(() => {
    listJobs();
  }, [])

  const jobFilterDetails = {
    jobPosition,
    skillsArray
  }
  
  useEffect(() => {
    axios.post(`${process.env.REACT_APP_FRONTEND_URL_FOR_JOBS}/filter`, jobFilterDetails, { headers: { "Content-Type": "application/json" } })
      .then(response => {
        setCompanyData(response.data.job);
      })
      .catch(error => {
        console.log(error);
      })
  }, [jobPosition,skillsArray])

  
  const handleSelectedSkills = e => {
    const selectedSkill = e.target.value;
    if(selectedSkill !== "Skills"){
      setSkillsArray(prevSkills => [...prevSkills, selectedSkill]);
    }
    setSkillsRequired(selectedSkill);
  }

  const handleCrossButton = skill => {
    if(skillsArray.length>0 && skillsArray.length<2){
      setSkillsRequired("");
    }
    const removeSkills =  skillsArray.filter(s => s !== skill);
    setSkillsArray(removeSkills);
  }
  
  const clearSkills = () => {
    setSkillsRequired("");
    setSkillsArray([]);
  }
  if(!companyData){
    return <Loader/>
  }
  return (
    <div>
      <Header authenticated={authenticated} setAuthenticated={setAuthenticated} />
      <div className='home'>
        <div className='filterjobs-container'>
          <div>
            <img src={search} className='search-icon' alt='search' />
            <input type="text" name='jobPosition' value={jobPosition} onChange={e => setJobPosition(e.target.value)} placeholder='Type any job title' className='type-job-title' />

          </div>

          <div className='skills-container'>
            <select name="skillsRequired" value={skillsRequired} onChange={handleSelectedSkills} className='skills-dropdown'>
              <option>Skills</option>
              <option value="HTML">HTML</option>
              <option value="CSS">CSS</option>
              <option value="Javascript">Javascript</option>
              <option value="Java">Java</option>
              <option value="Python">Python</option>
              <option value="MongoDB">MongoDB</option>
              <option value="ExpressJS">ExpressJS</option>
              <option value="ReactJS">ReactJS</option>
              <option value="NodeJS">NodeJS</option>
            </select>


            <div className='selected-skills'>
              {skillsArray && skillsArray.map((skill, index) => {
                return (
                  <div key={index}>
                    <span>{skill}</span>
                    <span onClick={() => handleCrossButton(skill)}>X</span>
                  </div>
                )
              })}
            </div>

            <div className='clear-and-addjob-btn'>
              {skillsArray.length>0 && <button className='btns clear-btn' onClick={clearSkills}>Clear</button>}
              {!authenticated && <button className='btns addjob-btn' onClick={() => navigate("/add-job")}>+ Add Job</button>}
            </div>
          </div>
        </div>

        {companyData && companyData.map((company, index) => {
          return (
            <div className='list-jobs' key={index}>
              <div style={{ display: "flex", gap: "20px" }}>
                <div>
                  <img src={company.companyLogoURL} alt='companyLogo' style={{ height: "60px", width: "70px" }} />
                </div>

                <div>
                  <b className='job-title'>{company.jobPosition}</b>
                  <div>
                    <img src={people} alt='people' className='people-img' />
                    <span>11-50</span>
                    <img src={rupees} alt='rupees' className='rupees-img' />
                    <span>{company.salary}</span>
                    <img src={india} alt='india-logo' className='india-img' />
                    <span>{company.location}</span>
                  </div>
                  <div style={{ marginTop: "20px" }}>
                    <span className='office'>{company.remote}</span>
                    <span className='full-time'>{company.jobType}</span>
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div className='displaying-skills'>
                  {company.skillsRequired.map((skill, index) => {
                    return (
                      <span key={index}>{skill}</span>
                    )
                  })}
                </div>

                <div className='editjob-viewdetails'>
                  {!authenticated && <button className='edit-btn' onClick={() => { navigate(`/add-job/${company._id}`); }}>Edit Job</button>}
                  <button className='viewdetails-btn' onClick={() => { navigate(`/view-job/${company._id}`); }}>View Details</button>
                </div>
              </div>

            </div>
          )
        })}


      </div>
      <ToastContainer />
    </div>
  )
}

export default Home
