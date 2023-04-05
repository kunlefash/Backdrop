import { User } from "./models/User";
import { PaystackService } from "./services/paystack";
import { computeLevenshteinDistance } from "./utils/levenshtein";
import { typeDefs } from "./schema";
require("dotenv").config();

const paystack = new PaystackService(process.env.PAYSTACK_API_KEY);

export const resolvers = {
  Query: {
    accountName: async ({
      bankCode,
      accountNumber,
    }: {
      bankCode: String;
      accountNumber: String;
    }) => {
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
    verifyUser: async ({
      accountNumber,
      bankCode,
      accountName,
    }: {
      accountNumber: String;
      bankCode: String;
      accountName: String;
    }) => {
      const { accountName: resolvedAccountName } =
        await paystack.resolveAccount(accountNumber, bankCode);
      const isVerified =
        accountName.toString().toLowerCase() ===
          resolvedAccountName.toLowerCase() ||
        computeLevenshteinDistance(
          accountName.toString(),
          resolvedAccountName
        ) <= 2;

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
