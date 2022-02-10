// import user model
const { User } = require('../models');
// import sign token function from auth
const { signToken } = require('../utils/auth');

// module.exports = {
//   // get a single user by either their id or their username
//   async getSingleUser({ user = null, params }, res) {
//     const foundUser = await User.findOne({
//       $or: [{ _id: user ? user._id : params.id }, { username: params.username }],
//     });

//     if (!foundUser) {
//       return res.status(400).json({ message: 'Cannot find a user with this id!' });
//     }

//     res.json(foundUser);
//   },
//   // create a user, sign a token, and send it back (to client/src/components/SignUpForm.js)
//   async createUser({ body }, res) {
//     const user = await User.create(body);

//     if (!user) {
//       return res.status(400).json({ message: 'Something is wrong!' });
//     }
//     const token = signToken(user);
//     res.json({ token, user });
//   },
//   // login a user, sign a token, and send it back (to client/src/components/LoginForm.js)
//   // {body} is destructured req.body
//   async login({ body }, res) {
//     const user = await User.findOne({ $or: [{ username: body.username }, { email: body.email }] });
//     if (!user) {
//       return res.status(400).json({ message: "Can't find this user" });
//     }

//     const correctPw = await user.isCorrectPassword(body.password);

//     if (!correctPw) {
//       return res.status(400).json({ message: 'Wrong password!' });
//     }
//     const token = signToken(user);
//     res.json({ token, user });
//   },
//   // save a book to a user's `savedBooks` field by adding it to the set (to prevent duplicates)
//   // user comes from `req.user` created in the auth middleware function
//   async saveBook({ user, body }, res) {
//     console.log(user);
//     try {
//       const updatedUser = await User.findOneAndUpdate(
//         { _id: user._id },
//         { $addToSet: { savedBooks: body } },
//         { new: true, runValidators: true }
//       );
//       return res.json(updatedUser);
//     } catch (err) {
//       console.log(err);
//       return res.status(400).json(err);
//     }
//   },
//   // remove a book from `savedBooks`
//   async deleteBook({ user, params }, res) {
//     const updatedUser = await User.findOneAndUpdate(
//       { _id: user._id },
//       { $pull: { savedBooks: { bookId: params.bookId } } },
//       { new: true }
//     );
//     if (!updatedUser) {
//       return res.status(404).json({ message: "Couldn't find user with this id!" });
//     }
//     return res.json(updatedUser);
//   },
// };


const resolvers = {
  Query: {
    User: async () => {
      return User.find({  username, email, password  });
  
    },
  },
    Mutation: {
      createUser: async (parent, args) => {
        const user = await User.create({ username, email, password });
        const token = signToken(user);
        return { token, user };
      }
  },
  saveBook: async (parent, { bookData }, context) => {
    if(context.user){
    return await User.findOneAndUpdate(
      { _id: context.user._id },
      {
        $addToSet: { savedBooks: bookData },
      },
      {
        new: true,
      }
    );
    }
  },
  deleteBook: async (parent, { bookId }, context) => {
    if(context.user){
    return await User.findOneAndUpdate(
      { _id: context.user._id },
      { $pull: { savedBooks: { bookId } } },
      { new: true }
    );
    }
  },

//login user
  login: async (parent, { email, password }) => {
    const user = await User.findOne({ email });

    if (!user) {
      throw new AuthenticationError('No user with this email found!');
    }

    const correctPw = await user.isCorrectPassword(password);

    if (!correctPw) {
      throw new AuthenticationError('Incorrect password!');
    }

    const token = signToken(user);
    return { token, user };
  },



  };


module.exports = resolvers;