import Login from './pages/Login';
import Register from './pages/Register';
import AddJob from './pages/AddJob';
import ViewJob from './pages/ViewJob';
import Home from './pages/Home';
import { BrowserRouter, Routes, Route, useParams } from "react-router-dom"
import { useState } from 'react';
import axios from "axios"

function App() {
  const [authenticated, setAuthenticated] = useState(true);
  const [displaySuccess, setDisplaySuccess] = useState("");
  const [companyData, setCompanyData] = useState([]);
  
  const listJobs = () => {
    axios.get(process.env.REACT_APP_FRONTEND_URL_FOR_JOBS)
      .then(response => {
        setCompanyData(response.data.jobs);
      })
      .catch(error => console.log(error))
  }
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home setCompanyData={setCompanyData} companyData={companyData} setDisplaySuccess={setDisplaySuccess} listJobs={listJobs} authenticated={authenticated} setAuthenticated={setAuthenticated} displaySuccess={displaySuccess} />} />
          <Route path='/register' element={<Register authenticated={authenticated} setAuthenticated={setAuthenticated} setDisplaySuccess={setDisplaySuccess} />} />
          <Route path='/login' element={<Login authenticated={authenticated} setAuthenticated={setAuthenticated} setDisplaySuccess={setDisplaySuccess} />} />
          <Route path='/add-job' element={<AddJob listJobs={listJobs} setDisplaySuccess={setDisplaySuccess} />} />
          <Route path='/add-job/:jobId' element={<AddJob listJobs={listJobs} setDisplaySuccess={setDisplaySuccess} />} />
          <Route path='/view-job/:jobId' element={<ViewJob authenticated={authenticated} setAuthenticated={setAuthenticated} />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
