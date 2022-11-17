const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('nodejs_06', 'root', 'Nalquin4599!', {
    host: 'localhost',
    dialect: 'mysql',
    logging: false,
});

const connect = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
};

module.exports = { connect };
