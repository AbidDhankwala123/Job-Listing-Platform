const Job = require("../models/jobs");
const mongoose = require("mongoose");

const getJobs = async (req, res, next) => {
    try {
        const jobs = await Job.find({});
        res.json({
            status: "SUCCESS",
            jobs
        })
    } catch (error) {
        next(new Error(error.message));
    }
}
/*
{
    "companyName": "JP Morgan",
    "companyLogoURL": "http://jpmorgan.com",
    "jobPosition": "Full Stack Developer",
    "salary": "100000",
    "jobType": "Full-time",
    "remote": "Remote",
    "location": "Mumbai",
    "jobDescription": "This is my first job",
    "aboutCompany": "This is a very nice company",
    "skillsRequired": ["Mern","java"],
    "information": "NA"
}
*/
const createJob = async (req, res, next) => {
    try {
        const { companyName, companyLogoURL, jobPosition, salary, jobType, remote, location, jobDescription, aboutCompany, skillsRequired, information } = req.body;


        if (!companyName || !companyLogoURL || !jobPosition || !salary || !jobType || !remote || !location || !jobDescription || !aboutCompany || !skillsRequired || !information) {
            res.status(400);
            next(new Error("All fields are required"));
        }
        await Job.create({ companyName, companyLogoURL, jobPosition, salary, jobType, remote, location, jobDescription, aboutCompany, skillsRequired, information });

        res.json({
            status: "SUCCESS",
            message: "Job created successfully",
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
        })
    } catch (error) {
        next(new Error(error.message));
    }

}

const updateJob = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { companyName, companyLogoURL, jobPosition, salary, jobType, remote, location, jobDescription, aboutCompany, skillsRequired, information } = req.body;
        await Job.findByIdAndUpdate(id, { companyName, companyLogoURL, jobPosition, salary, jobType, remote, location, jobDescription, aboutCompany, skillsRequired, information });

        res.json({
            status: "SUCCESS",
            message: "Job updated successfully"
        })
    } catch (error) {
        next(new Error(error.message));
    }

}

const getJobBySkillsAndJobTitle = async (req, res, next) => {
    try {
        const { jobPosition, skillsRequired } = req.body;
        const job = await Job.find({ $or: [{ jobPosition: jobPosition }, { skillsRequired: { $in: skillsRequired } }] })
        if(job.length === 0){
            res.status(404);
            return next(new Error("Job not found"));
        }
        res.json({
            status: "SUCCESS",
            job
        })
    } catch (error) {
        next(new Error(error.message));
    }


}

const getJobById = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            res.status(400);
            return next(new Error("Invalid ID format"));
        }

        const job = await Job.findById(id);

        if (!job) {
            res.status(404);
            return next(new Error("Job not found"));
        }

        res.json({
            status: "SUCCESS",
            job
        });
    } catch (error) {
        console.log(error);
        next(new Error(error.message));
    }
}

module.exports = { getJobs, createJob, updateJob, getJobById, getJobBySkillsAndJobTitle }