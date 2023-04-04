import { User } from "./models/User";
import { PaystackService } from "./services/paystack";
import { computeLevenshteinDistance } from "./utils/levenshtein";

const paystack = new PaystackService(process.env.PAYSTACK_API_KEY);

export const resolvers = {
  Query: {
    accountName: async (_, { bankCode, accountNumber }) => {
      const user = await User.findOne({ bankCode, accountNumber });
      if (user && user.accountName) {
        return user.accountName;
      }
      const { accountName } = await paystack.resolveAccount(
        accountNumber,
        bankCode
      );
      return accountName;
    },
  },
  Mutation: {
    verifyUser: async (_, { accountNumber, bankCode, accountName }) => {
      const { accountName: resolvedAccountName } = await paystack.resolveAccount(
        accountNumber,
        bankCode
      );
      const isVerified =
        accountName.toLowerCase() === resolvedAccountName.toLowerCase() ||
        computeLevenshteinDistance(accountName, resolvedAccountName) <= 2;
      const user = await User.findOneAndUpdate(
        { bankCode, accountNumber },
        { $set: { accountName, isVerified } },
        { new: true, upsert: true }
      );
      return user;
    },
  },
  User: {
    name: (user) => user.accountName,
  },
};
