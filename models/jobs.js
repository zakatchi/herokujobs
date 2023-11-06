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
        title: "Backend Engineer",
        desc: "Design, develop, and maintain server-side applications and services, including APIs, databases, and microservices",
        category: "Office",
        locName: "ByteDance",
        longT: "103.849980",
        latT: "1.289440"
    });
    Jobs.upsert({
        title: "Gym Manager",
        desc: "Manage day to day operations of gym, keep track of inventory, keep track of sales of memberships and promote.",
        category: "Office",
        locName: "Kings Arcade shopping centre",
        longT: "103.810700",
        latT: "1.323270"
    });
    Jobs.upsert({
        title: "Life guard",
        desc: "As a Lifeguard, your primary responsibility is to ensure the safety and well-being of swimmers and visitors at aquatic facilities.",
        category: "Office",
        locName: "Siloso Beach",
        longT: "103.830322",
        latT: "1.249404"
    });
    Jobs.upsert({
        title: "Security guard",
        desc: "Patrol residential area hourly, secure area",
        category: "Office",
        locName: "NTU Hall of residence 12",
        longT: "103.681938",
        latT: "1.351900"
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