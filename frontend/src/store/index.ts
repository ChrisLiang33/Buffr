import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import {
  User,
  UserProfile,
  Account,
  Transaction,
  Loan,
  LoadingState,
  AsyncState,
  DashboardStats,
  UserSettings,
  Theme,
} from "@/types";

// App State Interface
interface AppState {
  // User State
  user: User | null;
  userProfile: UserProfile | null;
  authLoading: boolean;
  authError: string | null;

  // Financial State
  accounts: Account[];
  transactions: Transaction[];
  loans: Loan[];
  dashboardStats: DashboardStats | null;

  // UI State
  isLoading: boolean;
  currentPage: string;
  sidebarOpen: boolean;
  theme: Theme;
  settings: UserSettings;

  // Async States
  accountsState: AsyncState<Account[]>;
  transactionsState: AsyncState<Transaction[]>;
  loansState: AsyncState<Loan[]>;

  // Actions
  setUser: (user: User | null) => void;
  setUserProfile: (profile: UserProfile | null) => void;
  setAuthLoading: (loading: boolean) => void;
  setAuthError: (error: string | null) => void;

  setAccounts: (accounts: Account[]) => void;
  addAccount: (account: Account) => void;
  updateAccount: (accountId: string, updates: Partial<Account>) => void;

  setTransactions: (transactions: Transaction[]) => void;
  addTransaction: (transaction: Transaction) => void;
  updateTransaction: (
    transactionId: string,
    updates: Partial<Transaction>
  ) => void;

  setLoans: (loans: Loan[]) => void;
  addLoan: (loan: Loan) => void;
  updateLoan: (loanId: string, updates: Partial<Loan>) => void;

  setDashboardStats: (stats: DashboardStats) => void;

  setLoading: (loading: boolean) => void;
  setCurrentPage: (page: string) => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;

  setTheme: (theme: Theme) => void;
  updateSettings: (settings: Partial<UserSettings>) => void;

  setAccountsState: (state: AsyncState<Account[]>) => void;
  setTransactionsState: (state: AsyncState<Transaction[]>) => void;
  setLoansState: (state: AsyncState<Loan[]>) => void;

  // Reset actions
  resetAuth: () => void;
  resetFinancial: () => void;
  resetUI: () => void;
  resetAll: () => void;
}

// Initial State
const initialState = {
  // User State
  user: null,
  userProfile: null,
  authLoading: false,
  authError: null,

  // Financial State
  accounts: [],
  transactions: [],
  loans: [],
  dashboardStats: null,

  // UI State
  isLoading: false,
  currentPage: "home",
  sidebarOpen: false,
  theme: {
    mode: "light",
    primaryColor: "#3b82f6",
    secondaryColor: "#64748b",
  },
  settings: {
    theme: {
      mode: "light",
      primaryColor: "#3b82f6",
      secondaryColor: "#64748b",
    },
    notifications: {
      email: true,
      push: true,
      sms: false,
    },
    privacy: {
      profileVisibility: "private",
      transactionHistory: "recent",
    },
    security: {
      twoFactorEnabled: false,
      biometricEnabled: false,
    },
  },

  // Async States
  accountsState: {
    data: null,
    loading: false,
    error: null,
  },
  transactionsState: {
    data: null,
    loading: false,
    error: null,
  },
  loansState: {
    data: null,
    loading: false,
    error: null,
  },
};

// Create Store
export const useAppStore = create<AppState>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        // User Actions
        setUser: (user) => set({ user }),
        setUserProfile: (profile) => set({ userProfile: profile }),
        setAuthLoading: (loading) => set({ authLoading: loading }),
        setAuthError: (error) => set({ authError: error }),

        // Account Actions
        setAccounts: (accounts) => set({ accounts }),
        addAccount: (account) =>
          set((state) => ({
            accounts: [...state.accounts, account],
          })),
        updateAccount: (accountId, updates) =>
          set((state) => ({
            accounts: state.accounts.map((account) =>
              account.id === accountId ? { ...account, ...updates } : account
            ),
          })),

        // Transaction Actions
        setTransactions: (transactions) => set({ transactions }),
        addTransaction: (transaction) =>
          set((state) => ({
            transactions: [transaction, ...state.transactions],
          })),
        updateTransaction: (transactionId, updates) =>
          set((state) => ({
            transactions: state.transactions.map((transaction) =>
              transaction.id === transactionId
                ? { ...transaction, ...updates }
                : transaction
            ),
          })),

        // Loan Actions
        setLoans: (loans) => set({ loans }),
        addLoan: (loan) =>
          set((state) => ({
            loans: [...state.loans, loan],
          })),
        updateLoan: (loanId, updates) =>
          set((state) => ({
            loans: state.loans.map((loan) =>
              loan.id === loanId ? { ...loan, ...updates } : loan
            ),
          })),

        // Dashboard Actions
        setDashboardStats: (stats) => set({ dashboardStats: stats }),

        // UI Actions
        setLoading: (loading) => set({ isLoading: loading }),
        setCurrentPage: (page) => set({ currentPage: page }),
        toggleSidebar: () =>
          set((state) => ({ sidebarOpen: !state.sidebarOpen })),
        setSidebarOpen: (open) => set({ sidebarOpen: open }),

        // Theme and Settings Actions
        setTheme: (theme) => set({ theme }),
        updateSettings: (settings) =>
          set((state) => ({
            settings: { ...state.settings, ...settings },
          })),

        // Async State Actions
        setAccountsState: (state) => set({ accountsState: state }),
        setTransactionsState: (state) => set({ transactionsState: state }),
        setLoansState: (state) => set({ loansState: state }),

        // Reset Actions
        resetAuth: () =>
          set({
            user: null,
            userProfile: null,
            authLoading: false,
            authError: null,
          }),

        resetFinancial: () =>
          set({
            accounts: [],
            transactions: [],
            loans: [],
            dashboardStats: null,
            accountsState: { data: null, loading: false, error: null },
            transactionsState: { data: null, loading: false, error: null },
            loansState: { data: null, loading: false, error: null },
          }),

        resetUI: () =>
          set({
            isLoading: false,
            currentPage: "home",
            sidebarOpen: false,
          }),

        resetAll: () => set(initialState),
      }),
      {
        name: "buffr-store",
        partialize: (state) => ({
          user: state.user,
          userProfile: state.userProfile,
          theme: state.theme,
          settings: state.settings,
          accounts: state.accounts,
          transactions: state.transactions.slice(0, 50), // Only persist recent transactions
          loans: state.loans,
        }),
      }
    ),
    {
      name: "buffr-store",
    }
  )
);

// Selectors for better performance
export const useUser = () => useAppStore((state) => state.user);
export const useUserProfile = () => useAppStore((state) => state.userProfile);
export const useAuthLoading = () => useAppStore((state) => state.authLoading);
export const useAuthError = () => useAppStore((state) => state.authError);

export const useAccounts = () => useAppStore((state) => state.accounts);
export const useTransactions = () => useAppStore((state) => state.transactions);
export const useLoans = () => useAppStore((state) => state.loans);
export const useDashboardStats = () =>
  useAppStore((state) => state.dashboardStats);

export const useIsLoading = () => useAppStore((state) => state.isLoading);
export const useCurrentPage = () => useAppStore((state) => state.currentPage);
export const useSidebarOpen = () => useAppStore((state) => state.sidebarOpen);
export const useTheme = () => useAppStore((state) => state.theme);
export const useSettings = () => useAppStore((state) => state.settings);

export const useAccountsState = () =>
  useAppStore((state) => state.accountsState);
export const useTransactionsState = () =>
  useAppStore((state) => state.transactionsState);
export const useLoansState = () => useAppStore((state) => state.loansState);

// Computed selectors
export const useTotalBalance = () =>
  useAppStore((state) =>
    state.accounts.reduce((total, account) => total + account.balance, 0)
  );

export const useActiveLoans = () =>
  useAppStore((state) =>
    state.loans.filter((loan) => loan.status === "active")
  );

export const useRecentTransactions = (limit = 10) =>
  useAppStore((state) => state.transactions.slice(0, limit));

export const useTransactionsByCategory = (category: string) =>
  useAppStore((state) =>
    state.transactions.filter(
      (transaction) => transaction.category === category
    )
  );
