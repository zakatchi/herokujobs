
var Jobs = require('../models/jobs');
var Applicants = require('../models/bid');
var myDatabase = require('./sqlDatabase');
var sequelize = myDatabase.sequelizeInstance;

var express = require('express');
var db = require('../db');
var router = express.Router();
const NodeGeoCoder = require('node-geocoder');
const jobs = require('../models/jobs');

const multer  = require('multer');
const path = require('path');
// const upload = multer({ dest: './public/pdf/' });
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/pdf/');
    },
    filename: function (req, file, cb) {
        const originalname = file.originalname;
        const extension = path.extname(originalname);

        // Ensure the uploaded file has a .pdf extension
        if (extension.toLowerCase() !== '.pdf') {
            return cb(new Error('Only PDF files are allowed'));
        }

        // Rename the file with its original name and the .pdf extension
        cb(null, originalname);
    }
});

const upload = multer({ storage: storage });
const options = {
    provider: 'google',
  
    // Optional depending on the providers
    //fetch: customFetchImplementation,
    apiKey: 'AIzaSyBsLQsmCxwysfq9M9mxdBDm12og5Y7DviE', // for Mapquest, OpenCage, Google Premier
    formatter: null // 'gpx', 'string', ...
  };

  const geocoder = NodeGeoCoder(options);


exports.showJobs = function(req, res)  {
    if (!req.user) { return res.render('adminAlert')}
    else{
    sequelize.query('SELECT * from Jobs ', {model: Jobs}).then((jobs) => {

        res.render('jobList', {
            title:'Job list page',
            jobs: jobs,
            user: req.user
        })
    })
}
};





exports.createJobs = async function(req,res) {
    var post_data = req.body;
    console.log(post_data);
    console.log("creating jobs");

    const longLat = await geocoder.geocode(req.body.locName);
    console.log("dude", longLat);
    console.log("man", req.body);
    
    var jobData = {
        title: req.body.title,
        desc: req.body.desc,
        category: req.body.category,
        locName: req.body.locName,
        longT: longLat[0].longitude,
        latT: longLat[0].latitude
    }
    
    Jobs.create(jobData).then((newComment, created) => {

        if(!newComment) {
            return res.send(400, {
                message: "error"
            });
        }
        
        
        res.redirect('/jobList');
    })

};


// exports.showJobDetails = function(req, res) {
//     console.log("wooo");
//     Jobs.findOne({where: {id: req.params.job_id}}),Applicants.findAll({where: {jobID: req.params.job_id}}).then((jobs)=> {
//         console.log(jobs);
//         res.render('jobDetails', { jobs: jobs, urlPath: req.protocol + "://" + req.get("host") + req.url  });

//     })
    
// };

exports.showJobDetails = function(req, res) {
    if (!req.user) { return res.render('adminAlert')}
    else {
    console.log("wooo", req.user);
    // Use Promise.all to wait for both queries to complete
    Promise.all([
        Jobs.findOne({ where: { id: req.params.job_id } }),
        Applicants.findAll({ where: { jobID: req.params.job_id } })
    ])
    .then(([jobs, applicants]) => {
        //console.log(jobs); // Log the job details
        //console.log(applicants); // Log the applicants

        res.render('jobDetails', { jobs: jobs, applicants: applicants, user:req.user, urlPath: req.protocol + "://" + req.get("host") + req.url });
    })
    .catch(error => {
        console.error(error);
        // Handle errors or send an error response
        res.status(500).send("Internal Server Error");
    });
}
};




exports.delete = function(req,res) {
    var record_num = req.params.job_id;
    console.log("deleting job" + record_num);
    Jobs.destroy({where: {id: record_num}}).then((deletedComment)=> {

        if(!deletedComment) {
            return res.send(400, {
                message: "error"
            });
        }
        //res.status(200).send({message: "Deleted bids: " + record_num});
        res.redirect('/jobList');
    })
};

// exports.applyApplicant = upload.single('file'), function(req,res) {
//     var post_data = req.body;
//     console.log(post_data);
//     console.log("creating applicant", req.body);
    
//     var applicantData = {
//         appName: req.user.name,
//         resumeName: req.file.filename,
//         yearsOfExperience: req.body.yearsofExp,
//         jobID: req.params.job_id
//     }
    
//     Applicants.create(applicantData).then((newComment, created) => {

//         if(!newComment) {
//             return res.send(400, {
//                 message: "error"
//             });
//         }
        
        
//         res.redirect('/jobList');
//     })

// };

const uploadMiddleware = upload.single('file');

// Use the uploadMiddleware in your route handler
exports.applyApplicant = function(req, res) {
    uploadMiddleware(req, res, function (err) {
        if (err) {
            // Handle any Multer-related errors here
            return res.status(400).send('File upload error');
        }
        
        var post_data = req.body;
        //console.log(post_data);
        console.log("Creating applicant", req.user);

        var applicantData = {
            appName: req.user.name,
            resumeName: req.file.originalname,
            yearsOfExperience: req.body.yearsofExp,
            jobID: req.params.job_id
        }

        Applicants.create(applicantData).then((newComment, created) => {
            if (!newComment) {
                return res.status(400).send({
                    message: "Error"
                });
            }

            res.redirect('/jobList');
        });
    });
};