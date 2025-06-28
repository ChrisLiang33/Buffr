import {
  ApiResponse,
  User,
  UserProfile,
  Account,
  Transaction,
  Loan,
  LoanType,
  LoginFormData,
  SignUpFormData,
  TransferFormData,
  LoanApplicationData,
  DashboardStats,
} from "@/types";

// API Configuration
const API_BASE_URL = "http://localhost:3001/api";
const API_TIMEOUT = 10000; // 10 seconds

// HTTP Client
class ApiClient {
  private baseURL: string;
  private timeout: number;

  constructor(baseURL: string, timeout: number) {
    this.baseURL = baseURL;
    this.timeout = timeout;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    const token = localStorage.getItem("authToken");

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(url, {
        ...config,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === "AbortError") {
          throw new Error("Request timeout");
        }
        throw error;
      }
      throw new Error("An unexpected error occurred");
    }
  }

  // GET request
  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: "GET" });
  }

  // POST request
  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // PUT request
  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // DELETE request
  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: "DELETE" });
  }

  // PATCH request
  async patch<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
    });
  }
}

// Create API client instance
const apiClient = new ApiClient(API_BASE_URL, API_TIMEOUT);

// Auth Service
export class AuthService {
  static async login(
    credentials: LoginFormData
  ): Promise<ApiResponse<{ user: User; token: string }>> {
    return apiClient.post<{ user: User; token: string }>(
      "/auth/login",
      credentials
    );
  }

  static async register(
    userData: SignUpFormData
  ): Promise<ApiResponse<{ user: User; token: string }>> {
    return apiClient.post<{ user: User; token: string }>(
      "/auth/register",
      userData
    );
  }

  static async logout(): Promise<ApiResponse<void>> {
    return apiClient.post<void>("/auth/logout");
  }

  static async refreshToken(): Promise<ApiResponse<{ token: string }>> {
    return apiClient.post<{ token: string }>("/auth/refresh");
  }

  static async resetPassword(email: string): Promise<ApiResponse<void>> {
    return apiClient.post<void>("/auth/reset-password", { email });
  }

  static async updateProfile(
    updates: Partial<UserProfile>
  ): Promise<ApiResponse<UserProfile>> {
    return apiClient.put<UserProfile>("/auth/profile", updates);
  }

  static async getProfile(): Promise<ApiResponse<UserProfile>> {
    return apiClient.get<UserProfile>("/auth/profile");
  }
}

// Account Service
export class AccountService {
  static async getAccounts(): Promise<ApiResponse<Account[]>> {
    return apiClient.get<Account[]>("/accounts");
  }

  static async getAccount(accountId: string): Promise<ApiResponse<Account>> {
    return apiClient.get<Account>(`/accounts/${accountId}`);
  }

  static async createAccount(
    accountData: Partial<Account>
  ): Promise<ApiResponse<Account>> {
    return apiClient.post<Account>("/accounts", accountData);
  }

  static async updateAccount(
    accountId: string,
    updates: Partial<Account>
  ): Promise<ApiResponse<Account>> {
    return apiClient.put<Account>(`/accounts/${accountId}`, updates);
  }

  static async deleteAccount(accountId: string): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`/accounts/${accountId}`);
  }
}

// Transaction Service
export class TransactionService {
  static async getTransactions(params?: {
    page?: number;
    limit?: number;
    category?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<ApiResponse<Transaction[]>> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const endpoint = `/transactions${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`;
    return apiClient.get<Transaction[]>(endpoint);
  }

  static async getTransaction(
    transactionId: string
  ): Promise<ApiResponse<Transaction>> {
    return apiClient.get<Transaction>(`/transactions/${transactionId}`);
  }

  static async createTransaction(
    transactionData: Partial<Transaction>
  ): Promise<ApiResponse<Transaction>> {
    return apiClient.post<Transaction>("/transactions", transactionData);
  }

  static async transferMoney(
    transferData: TransferFormData
  ): Promise<ApiResponse<Transaction>> {
    return apiClient.post<Transaction>("/transactions/transfer", transferData);
  }

  static async updateTransaction(
    transactionId: string,
    updates: Partial<Transaction>
  ): Promise<ApiResponse<Transaction>> {
    return apiClient.put<Transaction>(
      `/transactions/${transactionId}`,
      updates
    );
  }
}

// Loan Service
export class LoanService {
  static async getLoans(): Promise<ApiResponse<Loan[]>> {
    return apiClient.get<Loan[]>("/loans");
  }

  static async getLoan(loanId: string): Promise<ApiResponse<Loan>> {
    return apiClient.get<Loan>(`/loans/${loanId}`);
  }

  static async getLoanTypes(): Promise<ApiResponse<LoanType[]>> {
    return apiClient.get<LoanType[]>("/loans/types");
  }

  static async applyForLoan(
    applicationData: LoanApplicationData
  ): Promise<ApiResponse<Loan>> {
    return apiClient.post<Loan>("/loans/apply", applicationData);
  }

  static async updateLoan(
    loanId: string,
    updates: Partial<Loan>
  ): Promise<ApiResponse<Loan>> {
    return apiClient.put<Loan>(`/loans/${loanId}`, updates);
  }

  static async calculateLoanPayment(
    amount: number,
    duration: number,
    interestRate: number
  ): Promise<
    ApiResponse<{
      monthlyPayment: number;
      totalPayment: number;
      totalInterest: number;
    }>
  > {
    return apiClient.post<{
      monthlyPayment: number;
      totalPayment: number;
      totalInterest: number;
    }>("/loans/calculate", { amount, duration, interestRate });
  }
}

// Dashboard Service
export class DashboardService {
  static async getStats(): Promise<ApiResponse<DashboardStats>> {
    return apiClient.get<DashboardStats>("/dashboard/stats");
  }

  static async getRecentActivity(
    limit = 10
  ): Promise<ApiResponse<Transaction[]>> {
    return apiClient.get<Transaction[]>(
      `/dashboard/recent-activity?limit=${limit}`
    );
  }

  static async getSpendingByCategory(
    period: "week" | "month" | "year" = "month"
  ): Promise<
    ApiResponse<
      {
        category: string;
        amount: number;
        percentage: number;
      }[]
    >
  > {
    return apiClient.get<
      {
        category: string;
        amount: number;
        percentage: number;
      }[]
    >(`/dashboard/spending-by-category?period=${period}`);
  }
}

// Utility Service
export class UtilityService {
  static async getExchangeRates(): Promise<
    ApiResponse<Record<string, number>>
  > {
    return apiClient.get<Record<string, number>>("/utils/exchange-rates");
  }

  static async validateEmail(
    email: string
  ): Promise<ApiResponse<{ isValid: boolean }>> {
    return apiClient.post<{ isValid: boolean }>("/utils/validate-email", {
      email,
    });
  }

  static async validatePhone(
    phone: string
  ): Promise<ApiResponse<{ isValid: boolean }>> {
    return apiClient.post<{ isValid: boolean }>("/utils/validate-phone", {
      phone,
    });
  }

  static async uploadFile(file: File): Promise<ApiResponse<{ url: string }>> {
    const formData = new FormData();
    formData.append("file", file);

    return apiClient.post<{ url: string }>("/utils/upload", formData);
  }
}
