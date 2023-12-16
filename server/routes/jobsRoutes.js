const express = require("express");
const router = express.Router();
const { createJob, getJobs,updateJob,getJobById,getJobBySkillsAndJobTitle } = require("../controllers/jobsController");
const isAuthenticated = require("../middleware/authMiddleware");

// router.get("/",getJobs);//List all the jobs
router.post("/",isAuthenticated, createJob);// Create a new job listing (protected route)
router.put("/:id",isAuthenticated,updateJob);//Update any job posted
router.get("/:id",getJobById);// Show the detailed description of a job post
router.get("/",getJobBySkillsAndJobTitle);// List all jobs with filters based on skills and job position

module.exports = router;
