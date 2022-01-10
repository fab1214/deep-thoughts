const { User, Thought } = require("../models");
//authentication error
const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth');

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
        if(context.user){
        const userData = await User.findOne({_id: context.user._id})
        .select('-__v -password')
        .populate('thoughts')
        .populate('friends');
  
      return userData;
    }
    throw new AuthenticationError('Not logged in');
    },

    //find thoughts by username
    thoughts: async (parent, { username }) => {
      const params = username ? { username } : {};
      return Thought.find(params).sort({ createdAt: -1 });
    },

    //find thought by id (pass in id object as paramets)
    thought: async (parent, { _id }) => {
      return Thought.findOne({ _id });
    },

    //get all users
    users: async () => {
        return User.find()
          .select('-__v -password')
          .populate('friends')
          .populate('thoughts');
      },      

    //get a user by username (pass in username object as parameter)
    user: async (parent, { username }) => {
      return User.findOne({ username })
        .select("-__v -password")
        .populate("friends")
        .populate("thoughts");
    },
  },

  Mutation: {
    addUser: async (parent, args) => {
      const user = await User.create(args);
      const token = signToken(user);

      return {token, user};
    },
    //pass in parent, and email and password as parameters
    login: async (parent, { email, password }) => {
        //find user by email
        const user = await User.findOne({ email });
        //if user not found, throw AuthenticationError message
        if(!user){
            throw new AuthenticationError('Incorrect credentials');
        }
        
        //run isCorrectPassword function from User.js on entered password (parameter)
        const correctPw = await user.isCorrectPassword(password);

        //if password not correct, throw AutheticationError message
        if(!correctPw){
            throw new AuthenticationError('Incorrect credentials');
        }

        const token = signToken(user);
        return { token, user };
    },

    addThought: async (parent, args, context) => {
        if(context.user){
            const thought = await Thought.create({...args, username: context.user.username });

            await User.findByIdAndUpdate(
                { _id: context.user._id },
                { $push: { thoughts: thought._id } },
                { new: true }
            );

            return thought;
        }

        throw new AuthenticationError('You need to be logged in');
    },

    addReaction: async (parent, { thoughtId, reactionBody }, context) => {
        if (context.user) {
          const updatedThought = await Thought.findOneAndUpdate(
            { _id: thoughtId },
            { $push: { reactions: { reactionBody, username: context.user.username } } },
            { new: true, runValidators: true }
          );
      
          return updatedThought;
        }
      
        throw new AuthenticationError('You need to be logged in!');
      },

      //pass in friendId as parameter
      addFriend: async (parent, { friendId }, context) => {
        if (context.user) {
            //update exisiting User with friends array
          const updatedUser = await User.findOneAndUpdate(
            { _id: context.user._id },
            //addToSet prevent duplicates
            { $addToSet: { friends: friendId } },
            { new: true }
          ).populate('friends');
      
          return updatedUser;
        }
      
        throw new AuthenticationError('You need to be logged in!');
      }
  },
};

module.exports = resolvers;
