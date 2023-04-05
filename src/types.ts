export interface PaystackApi {
    resolve: (accountNumber: string, bankCode: string) => Promise<PaystackAccountResponse>
    getAccountName(accountNumber: string, bankCode: string): Promise<string>;
  }
  
  interface PaystackAccountResponse {
    status: boolean;
    message: string;
    data: {
      account_name: string;
    };
  }
  