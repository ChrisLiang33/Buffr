import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import AccountPage from "./Pages/AccountPage.jsx";
import HomePage from "./Pages/HomePage.jsx";
import TransactionPage from "./Pages/TransactionPage.jsx";
import LoansPage from "./Pages/LoansPage.jsx";
import SendingPage from "./Pages/SendingPage.jsx";
import QRPage from "./Pages/QRPage.jsx";
import AddWallet from "./components/AddWallet.jsx";
import Setting from "./Pages/SettingPage.jsx";
import NotificationPage from "./Pages/NotificationPage.jsx";
import AddMoney from "./components/AddMoney.jsx";
import CardDetail from "./components/CardDetail.jsx";
import ToContact from "./components/ToContact.jsx";
import LoginPage from "./Pages/LoginPage.jsx";

function App() {
  return (
    <NotificationProvider>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route
            path="/account"
            element={
              <ProtectedRoute>
                <AccountPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/transactions"
            element={
              <ProtectedRoute>
                <TransactionPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/loans"
            element={
              <ProtectedRoute>
                <LoansPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/send"
            element={
              <ProtectedRoute>
                <SendingPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/qrcode"
            element={
              <ProtectedRoute>
                <QRPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/addwallet"
            element={
              <ProtectedRoute>
                <AddWallet />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Setting />
              </ProtectedRoute>
            }
          />
          <Route
            path="/notification"
            element={
              <ProtectedRoute>
                <NotificationPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/addmoney"
            element={
              <ProtectedRoute>
                <AddMoney />
              </ProtectedRoute>
            }
          />
          <Route
            path="/card"
            element={
              <ProtectedRoute>
                <CardDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/send/tocontact"
            element={
              <ProtectedRoute>
                <ToContact />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </NotificationProvider>
  );
}

export default App;
