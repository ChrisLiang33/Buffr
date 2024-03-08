import AddBtn from "./components/rows3/AddBtn.jsx";
import UserBank from "./components/rows3/UserBank.jsx";
import BackBtn from "./components/rows3/BackBtn.jsx";

const Test = () => {
  const bankAccounts = [
    {
      bankName: "NedBank",
      lastThree: "823",
      accountType: "Savings Account",
      iconUrl:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/247bd62102ec3870b110d6548e3d82bbe83d401cbda68751c163dab72f7bd240?",
    },
    {
      bankName: "NedBank",
      lastThree: "676",
      accountType: "Current Account",
      iconUrl:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/247bd62102ec3870b110d6548e3d82bbe83d401cbda68751c163dab72f7bd240?",
    },
    {
      bankName: "Bank Windhoek",
      lastThree: "184",
      accountType: "Savings Account",
      iconUrl:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/1c8b7ef552ded2088e1ea9c987529443462f14c07c42d367c9acb0353568a595?",
    },
  ];

  return (
    <>
      <br />
      <div className="flex flex-col min-h-screen">
        <div className="flex-1">
          <div className="flex gap-5 justify-between px-4 py-2 bg-white max-w-[393px]">
            <BackBtn />
            <div className="my-auto text-lg font-medium leading-7 text-center text-slate-950">
              Accounts
            </div>
            <div className="flex justify-center items-center px-4 w-14 h-14 bg-white aspect-square rounded-full"></div>
          </div>
          <div className="text-sm font-medium leading-5 max-w-[164px] text-slate-500">
            Available Bank Accounts
          </div>
          {bankAccounts.map((bankAccount, index) => (
            <UserBank
              key={index}
              bankName={bankAccount.bankName}
              lastThree={bankAccount.lastThree}
              accountType={bankAccount.accountType}
              iconUrl={bankAccount.iconUrl}
            />
          ))}
        </div>
        <div className="flex justify-center items-center min-h-screen">
          <AddBtn text="Add Account" />
        </div>
      </div>
    </>
  );
};

export default Test;
