const { Users } = require('../models');

const userController = {

    createUser(req, res) {
        Users.create(req.body)
            .then(user => res.json(user))
            .catch(err => res.status(400).json(err));
    },

    getAllUsers(req, res) {
        Users.find({})
            .then(user => res.json(user))
            .catch(err => {
                console.log(err);
                res.status(500).json(err);
            });
    },

    getUserById(req, res) {
        Users.findOne({ _id: req.params.userId })
            .populate({ path: 'thoughts', select: '-__v' })
            .populate({ path: 'friends', select: '-__v' })
            .select('-__v')
            .then(user => {
                if (!user) {
                    res.status(404).json({ message: 'No User with this ID!' });
                    return;
                }
                res.json(user)
            })
            .catch(err => {
                console.log(err);
                res.status(400).json(err)
            })
    },

    updateUser(req, res) {
        Users.findOneAndUpdate({ _id: req.params.userId }, { $set: req.body}, { new: true, runValidators: true })
            .then(user => {
                if (!user) {
                    res.status(404).json({ message: 'No User with this ID!' });
                    return;
                }
                res.json(user);
            })
            .catch(err => res.json(err))
    },

    deleteUser(req, res) {
        Users.findOneAndDelete({ _id: req.params.userId })
            .then(user => {
                if (!user) {
                    res.status(404).json({ message: 'No User with this ID!' });
                    return;
                }
                res.json(user);
            })
            .catch(err => res.status(400).json(err));
    },

    addFriend(req, res) {
        Users.findOneAndUpdate({ _id: req.params.userId }, {$push: {friends: req.params.friendId}}, { new: true, runValidators: true })
            .then((user) => {
                if (!user) {
                    res.status(404).json({ message: "No User with this ID!" });
                    return;
                }
                res.json(user);
            })
            .catch((err) => res.status(500).json(err));
    },

    deleteFriend(req, res) {
        Users.findOneAndUpdate({ _id: req.params.userId }, { $pull: { friends: req.params.friendId } }, { new: true, runValidators: true })
            .then(user => {
                if (!user) {
                    res.status(404).json({ message: 'No User with this ID!' });
                    return;
                }
                res.json(user);
            })
            .catch(err => res.status(400).json(err));
    }

};

module.exports = userController;