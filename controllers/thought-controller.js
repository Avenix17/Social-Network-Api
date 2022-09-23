const { Thoughts, Users } = require('../models');

const thoughtController = {
    
    // functions for different route actions

    createThought(req, res) {
        Thoughts.create(req.body)
            .then((thought) => {
                return Users.findOneAndUpdate({ _id: req.params.userId }, { $push: { thoughts: thought._id } }, { new: true, runValidators: true });
            })
            .then(user => {
                if (!user) {
                    res.status(404).json({ message: 'No user with this particular ID!' });
                    return;
                }
                res.json(user)
            })
            .catch(err => res.json(err));
    },

    getAllThoughts(req, res) {
        Thoughts.find({})
            .then(thought => res.json(thought))
            .catch(err => {
                console.log(err);
                res.status(500).json(err);
            });
    },

    getThoughtById(req, res) {
        Thoughts.findOne({ _id: req.params.id })
            .populate({ path: 'reactions', select: '-__v' })
            .select('-__v')
            .then(thought => {
                if (!thought) {
                    res.status(404).json({ message: 'No thoughts with this particular ID!' });
                    return;
                }
                res.json(thought)
            })
            .catch(err => {
                console.log(err);
                res.sendStatus(400);
            });
    },

    updateThought(req, res) {
        Thoughts.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true, runValidators: true })
            .then(thought => {
                if (!thought) {
                    res.status(404).json({ message: 'No thoughts with this particular ID!' });
                    return;
                }
                res.json(thought);
            })
            .catch(err => res.json(err));
    },

    deleteThought(req, res) {
        Thoughts.findOneAndDelete({ _id: req.params.id })
            .then(({ username }) => {
                return Users.findOneAndUpdate(
                    { username: username },
                    { $pull: { thoughts: req.params.id } },
                    { new: true }
                )
            })
            .then(thought => {
                if (!thought) {
                    res.status(404).json({ message: 'No thoughts with this particular ID!' });
                    return;
                }
                res.json(thought);
            })
            .catch(err => res.status(400).json(err));
    },

    addReaction(req, res) {
        Thoughts.findOneAndUpdate({ _id: req.params.thoughtId }, { $addToSet: { reactions: req.body } }, { new: true, runValidators: true })
            .then(thought => {
                if (!thought) {
                    res.status(404).json({ message: 'No thoughts with this particular ID!' });
                    return;
                }
                res.json(thought);
            })
            .catch(err => res.status(400).json(err))

    },

    deleteReaction(req, res) {
        Thoughts.findOneAndUpdate({ _id: req.params.thoughtId }, { $pull: { reactions: { reactionId: req.params.reactionId } } }, { new: true, runValidators: true })
            .then(thought => {
                if (!thought) {
                    res.status(404).json({ message: 'No thoughts with this particular ID!' });
                    return;
                }
                res.json(thought);
            })
            .catch(err => res.status(400).json(err));
    }

};

module.exports = thoughtController;