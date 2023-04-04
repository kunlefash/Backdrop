import fetch from "node-fetch";

interface PaystackAccountResponse {
  status: boolean;
  message: string;
  data: {
    account_name: string;
  };
}

export class PaystackService {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async resolveAccount(accountNumber: string, bankCode: string) {
    const url = `https://api.paystack.co/bank/resolve?account_number=${accountNumber}&bank_code=${bankCode}`;
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
      },
    });
    const responseJson: PaystackAccountResponse = await response.json();
    if (!responseJson.status) {
      throw new Error(responseJson.message);
    }
    return responseJson.data.account_name;
  }
}

export function computeLevenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = [];
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
    if (i === 0) {
      continue;
    }
    for (let j = 0; j < a.length; j++) {
      matrix[0][j] = j;
      const cost = a[j] === b[i - 1] ? 0 : 1;
      matrix[i][j + 1] = Math.min(
        matrix[i][j] + 1,
        matrix[i - 1][j] + 1,
        matrix[i - 1][j + 1] + cost
      );
    }
  }
  return matrix[b.length][a.length];
}
