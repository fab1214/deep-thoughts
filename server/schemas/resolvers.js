const { User, Thought } = require('../models');

const resolvers = {
  Query: {
      //find thoughts by username
    thoughts: async (parent, { username }) => {
        const params = username ? { username } : {};
      return Thought.find(params).sort({ createdAt: -1 });
    },

    //find thought by id (pass in id object as paramets)
    thought: async (parent, {_id }) => {
        return Thought.findOne({_id});
    },

    //get all users
    users: async () => {
        return User.find()
        .select('-__v -password')
        .populate('friends')
        .populate('thoughts');
    },

    //get a user by username (pass in username object as parameter)
    users: async (parent, { username }) => {
        return User.findOne({ username })
        .select('-__v -password')
        .populate('friends')
        .populate('thoughts');
    }
  },
};

module.exports = resolvers;
