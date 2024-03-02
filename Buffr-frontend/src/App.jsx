import { Routes, Route } from "react-router-dom";
import AccountPage from "./AccountPage.jsx";
import HomePage from "./HomePage.jsx";
import HomeFooter from "./HomeFooter.jsx";
import TransactionPage from "./TransactionPage.jsx";
import LoansPage from "./LoansPage.jsx";

function App() {
  return (
    <>
      <Routes>
        <Route path="/account" element={<AccountPage />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/transactions" element={<TransactionPage />} />
        <Route path="/loans" element={<LoansPage />} />
      </Routes>
      <HomeFooter />
    </>
  );
}

export default App;
