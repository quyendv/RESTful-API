class UserController {
    getUsers(req, res) {
        return res.send('user controller');
    }
}

module.exports = new UserController();
