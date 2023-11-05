// models/comments.js
var myDatabase = require('../controllers/sqlDatabase');
var sequelizeInstance = myDatabase.sequelizeInstance;
var Sequelize = myDatabase.Sequelize;

const Jobs = sequelizeInstance.define('Jobs', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    created: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
    },
    title: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: '',
        trim: true
    },
    desc: {
        type: Sequelize.STRING,
        defaultValue: '',
        trim: true
    },
    category: {
        type: Sequelize.STRING,
        defaultValue: '',
        trim: true
    },
    locName: {
        type: Sequelize.STRING,
        defaultValue: '',
        trim: true
    },
    longT: {
        type: Sequelize.STRING,
        defaultValue: '',
        trim: true
    },
    latT: {
        type: Sequelize.STRING,
        defaultValue: '',
        trim: true
    }
});

// force: true will drop the table if it already exists
Jobs.sync({ force: true, logging: false }).then(() => {
    Jobs.upsert({
        title: "Accountant",
        desc: "As a senior accountant..",
        category: "Office",
        locName: "NTU",
        longT: "103.6808217",
        latT: "1.347064"
    });
    Jobs.upsert({
        title: "Engineer",
        desc: "As a senior engineer..",
        category: "Industrial",
        locName: "NTU",
        longT: "103.6808217",
        latT: "1.347064"
    });
    Jobs.upsert({
        title: "Doctor",
        desc: "As a doctor..",
        category: "Hospital",
        locName: "NTU",
        longT: "103.6808217",
        latT: "1.347064"
    });
    Jobs.upsert({
        title: "Retail salesman",
        desc: "As a retail salesman..",
        category: "Shopping mall",
        locName: "NTU",
        longT: "103.6808217",
        latT: "1.347064"
    });
    Jobs.upsert({
        title: "Quant trader",
        desc: "As a quant trader..",
        category: "Office",
        locName: "NTU",
        longT: "103.6808217",
        latT: "1.347064"
    });
    // Table created
    console.log("Jobs table synced");

});

module.exports = sequelizeInstance.model('Jobs', Jobs);