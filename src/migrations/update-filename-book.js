module.exports = {
    up: function (queryInterface, Sequelize) {
        // logic for transforming into the new state
        return queryInterface.addColumn('Books', 'filename', Sequelize.STRING); // Chú ý table là 'Books' chứa các model 'Book' nhé, đừng nhầm
    },

    // up lỗi thì chạy down để remove cái lỗi đi, giống mình làm với cloudinary ấy
    down: function (queryInterface, Sequelize) {
        // logic for reverting the changes
        return queryInterface.removeColumn('Books', 'filename'); // Chú ý table là 'Books' chứa các model 'Book' nhé, đừng nhầm
    },
};
