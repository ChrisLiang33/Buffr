import { Routes, Route } from "react-router-dom";
import AccountPage from "./AccountPage.jsx";
import HomePage from "./HomePage.jsx";
import TransactionPage from "./TransactionPage.jsx";
import LoansPage from "./LoansPage.jsx";
import SendingPage from "./SendingPage.jsx";
import QRPage from "./QRPage.jsx";
import AddWallet from "./AddWallet.jsx";
import Setting from "./Setting.jsx";
import Notification from "./Notification.jsx";

function App() {
  return (
    <>
      <Routes>
        <Route path="/account" element={<AccountPage />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/transactions" element={<TransactionPage />} />
        <Route path="/loans" element={<LoansPage />} />
        <Route path="/send" element={<SendingPage />} />
        <Route path="/qrcode" element={<QRPage />} />
        <Route path="/addwallet" element={<AddWallet />} />
        <Route path="/settings" element={<Setting />} />
        <Route path="/notification" element={<Notification />} />
      </Routes>
    </>
  );
}

export default App;
