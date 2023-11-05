var express = require("express");
var jobbing = express.Router();
var jobs = require("../controllers/jobs");


jobbing.get('/', jobs.showJobs);

jobbing.get('/createjob', (req,res)=>{res.render('create_job')});
jobbing.post('/createjob', jobs.createJobs);
jobbing.get('/job/:job_id', jobs.showJobDetails);
jobbing.post('/job/:job_id', jobs.delete);
jobbing.post('/job/:job_id/apply', jobs.applyApplicant);
module.exports = jobbing;