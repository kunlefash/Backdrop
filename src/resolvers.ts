import { PaystackService } from "./services/paystack";
import { computeLevenshteinDistance } from "./utils/levenshtein";
import { typeDefs } from "./schema";
import { User } from "./models/User"
require("dotenv").config();

const paystack = new PaystackService(process.env.PAYSTACK_API_KEY);

export const resolvers = {
  Query: {
    accountName: async ({
      bankCode,
      accountNumber,
    }: {
      bankCode: string;
      accountNumber: string;
    }) => {
      const user = await User.findOne({ bankCode, accountNumber });
      if (user && user.accountName) {
        return user.accountName;
      }
      const resolvedAccount = await paystack.resolveAccount(
        accountNumber,
        bankCode
      );
      return resolvedAccount.accountName;
    },
  },
  Mutation: {
    verifyUser: async ({
      accountNumber,
      bankCode,
      accountName,
    }: {
      accountNumber: string;
      bankCode: string;
      accountName: string;
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
