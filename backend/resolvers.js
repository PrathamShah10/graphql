import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { randomBytes } from "crypto";
const User = mongoose.model("User");
const BusinessPerson = mongoose.model("BusinessPerson");
export const resolvers = {
  Query: {
    user: async (_, { _id }) => {
      return await User.findOne({ _id: _id });
    },
    business: async (_, { _id }) => {
      return await BusinessPerson.findOne({ _id: _id });
    },
  },
  Mutation: {
    addUser: async (_, { newUserDetails }) => {
      const alreadyUser = await User.findOne({
        username: newUserDetails.username,
      });
      if (alreadyUser) {
        throw new Error("user already exsits");
      }
      const hashedPassword = await bcrypt.hash(newUserDetails.password, 12);
      const newUser = await new User({
        ...newUserDetails,
        password: hashedPassword,
      });
      await newUser.save();
      const buisnessman = await BusinessPerson.findById(
        newUserDetails.buisnessMan
      );
      buisnessman.customers.push(newUser._id);
      await buisnessman.save();
      return newUser;
    },
    addBuisnessMan: async (_, { newUserDetails }) => {
      const alreadyUser = await BusinessPerson.findOne({
        username: newUserDetails.username,
      });
      if (alreadyUser) {
        throw new Error("user already exsits");
      }
      const hashedPassword = await bcrypt.hash(newUserDetails.password, 12);
      const newUser = await new BusinessPerson({
        ...newUserDetails,
        password: hashedPassword,
      });
      await newUser.save();
      return newUser;
    },
    signInUser: async (_, { signDetails }) => {
      const user = await User.findOne({ username: signDetails.username });
      if (!user) {
        throw new Error("crediantials invalid");
      }
      const equality = await bcrypt.compare(
        signDetails.password,
        user.password
      );
      if (!equality) {
        throw new Error("crediantials invalid");
      }
      const token = jwt.sign({ userId: user._id }, "avbdd!@#$]");
      return { token: token, userDetails: user, isCustomer: true };
    },
    signInBuisness: async (_, { signDetails }) => {
      const user = await BusinessPerson.findOne({
        username: signDetails.username,
      });
      if (!user) {
        throw new Error("crediantials invalid");
      }
      const equality = await bcrypt.compare(
        signDetails.password,
        user.password
      );
      if (!equality) {
        throw new Error("crediantials invalid");
      }
      const token = jwt.sign({ userId: user._id }, "avbdd!@#$]");
      return { token: token, userDetails: user, isCustomer: false };
    },
  },
  BusinessPerson: {
    customers: async (buisnessMan) => {
      const res = await BusinessPerson.findById(buisnessMan._id).select(
        "customers"
      );
      const customerNames = [];

      for (const customerId of res.customers) {
        const customer = await User.findById(customerId).select("name email username");
        if (customer) {
          customerNames.push({name: customer.name, email: customer.email, username: customer.username});
        }
      }
      return customerNames;
    },
  },
  User: {
    buisnessMan: async (user) => {
      const res = await BusinessPerson.findById(user.buisnessMan).select(
        "name email username"
      );
      return res;
    }
  }
};
