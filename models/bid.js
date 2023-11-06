// models/comments.js
var myDatabase = require('../controllers/sqlDatabase');
var sequelizeInstance = myDatabase.sequelizeInstance;
var Sequelize = myDatabase.Sequelize;

const Applicants = sequelizeInstance.define('Applicants', {
    appID: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    created: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
    },
    appName: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: '',
        trim: true
    },
    resumeName: {
        type: Sequelize.STRING,
        defaultValue: '',
        trim: true
    },
    yearsOfExperience: {
        type: Sequelize.STRING,
        defaultValue: '',
        trim: true
    },
    jobID: {
        type: Sequelize.STRING,
        defaultValue: '',
        trim: true
    }
});

// force: true will drop the table if it already exists
Applicants.sync({ force: true, logging: false }).then(() => {
    Applicants.upsert({
        appName: "Argel",
        resumeName: "Argel_CV.pdf",
        yearsOfExperience: "4",
        jobID: "2"
    });
    Applicants.upsert({
        appName: "Royce",
        resumeName: "Argel_CV.pdf",
        yearsOfExperience: "4",
        jobID: "2"
    });
    Applicants.upsert({
        appName: "Adam",
        resumeName: "Argel_CV.pdf",
        yearsOfExperience: "4",
        jobID: "2"
    });Applicants.upsert({
        appName: "Syazwan",
        resumeName: "Argel_CV.pdf",
        yearsOfExperience: "4",
        jobID: "2"
    });Applicants.upsert({
        appName: "Thomas",
        resumeName: "Argel_CV.pdf",
        yearsOfExperience: "4",
        jobID: "1"
    });;Applicants.upsert({
        appName: "Megan Fox",
        resumeName: "Argel_CV.pdf",
        yearsOfExperience: "4",
        jobID: "1"
    });;Applicants.upsert({
        appName: "Mary Jane",
        resumeName: "Argel_CV.pdf",
        yearsOfExperience: "4",
        jobID: "1"
    });
    // Table created
    console.log("Applicants table synced");

});

module.exports = sequelizeInstance.model('Applicants', Applicants);