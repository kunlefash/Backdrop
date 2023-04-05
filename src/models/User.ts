import { computeLevenshteinDistance } from "../utils/levenshtein";
import { PaystackApi } from "../types";

export interface User {
  id: number;
  name: string;
  accountNumber: string;
  bankCode: string;
  isVerified: boolean;
}

export async function verifyUser(
  user: User,
  accountName: string,
  paystackApi: PaystackApi
): Promise<boolean> {
  const paystackAccountName = await paystackApi.getAccountName(
    user.accountNumber,
    user.bankCode
);


  const distance = computeLevenshteinDistance(
    accountName.toLowerCase(),
    paystackAccountName.toLowerCase()
  );

  const isMatch = distance <= 2;

  if (isMatch) {
    user.isVerified = true;
    return true;
  }

  return false;
}
