const Job = require("../models/jobs");
const mongoose = require("mongoose");
const AppError = require("../utils/AppError");

const getJobs = async (req, res, next) => {
    try {
        const jobs = await Job.find({});
        res.json({
            status: "SUCCESS",
            jobs
        })
    } catch (error) {
        next(error);
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
            return next(new AppError("All fields are required", 400));

        }
        await Job.create({ companyName, companyLogoURL, jobPosition, salary, jobType, remote, location, jobDescription, aboutCompany, skillsRequired: skillsRequired.split(",").map(skill => skill.trim()), information });
        res.json({
            status: "SUCCESS",
            message: "Job added successfully",
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
        next(error);
    }

}

const updateJob = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { companyName, companyLogoURL, jobPosition, salary, jobType, remote, location, jobDescription, aboutCompany, skillsRequired, information } = req.body;

        const skills = typeof skillsRequired === 'string' ? skillsRequired.split(",").map(skill => skill.trim()) : skillsRequired;
        const job = await Job.findByIdAndUpdate(id, { companyName, companyLogoURL, jobPosition, salary, jobType, remote, location, jobDescription, aboutCompany, skillsRequired: skills, information });

        res.json({
            status: "SUCCESS",
            message: "Job Updated Successfully",
            job
        })
    } catch (error) {
        next(error);
    }

}

const getJobBySkillsAndJobTitle = async (req, res, next) => {
    try {

        const { jobPosition, skillsArray } = req.body;
        if (jobPosition.length === 0 && skillsArray.length > 0) {
            const job = await Job.find({
                skillsRequired: { $in: skillsArray }
            })
            console.log("res=" + job.length);
            res.json({
                status: "SUCCESS",
                job
            })
        } else {
            const job = await Job.find({
                $or: [
                    { jobPosition: new RegExp(jobPosition, "i") },
                    { skillsRequired: { $in: skillsArray } }
                ]
            })
            res.json({
                status: "SUCCESS",
                job
            })
        }
    } catch (error) {
        next(error);
    }


}

const getJobById = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return next(new AppError("Invalid ID format", 400));
        }

        const job = await Job.findById(id);

        if (!job) {
            return next(new AppError("Job not found", 404));
        }

        res.json({
            status: "SUCCESS",
            job
        });
    } catch (error) {
        next(error);
    }
}

module.exports = { getJobs, createJob, updateJob, getJobById, getJobBySkillsAndJobTitle }