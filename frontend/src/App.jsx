import { Routes, Route } from "react-router-dom";
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
    <>
      <Routes>
        <Route path="/account" element={<AccountPage />} />
        <Route path="/" element={<LoginPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/transactions" element={<TransactionPage />} />
        <Route path="/loans" element={<LoansPage />} />
        <Route path="/send" element={<SendingPage />} />
        <Route path="/qrcode" element={<QRPage />} />
        <Route path="/addwallet" element={<AddWallet />} />
        <Route path="/settings" element={<Setting />} />
        <Route path="/notification" element={<NotificationPage />} />
        <Route path="/addmoney" element={<AddMoney />} />
        <Route path="/card" element={<CardDetail />} />
        <Route path="/send/tocontact" element={<ToContact />} />
      </Routes>
    </>
  );
}

export default App;
