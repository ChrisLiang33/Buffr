import HomeBtn from "./components/homerow/HomeBtn.jsx";
import LoanBtn from "./components/homerow/LoanBtn.jsx";
import TransactionBtn from "./components/homerow/TransactionBtn.jsx";

const HomeRow = () => {
	return(
		<div className="flex flex-col justify-between text-center whitespace-nowrap rounded-3xl shadow-2xl backdrop-blur-lg bg-white bg-opacity-70 text-slate-600">
		<div className="flex gap-0 justify-between px-5">
			<div className="flex flex-col flex-1"><a href="https://www.google.com"><HomeBtn /></a></div>
			<div className="flex flex-col flex-1"><a href="https://www.google.com"><LoanBtn /></a></div>
			<div className="flex flex-col flex-1"><a href="https://www.google.com"><TransactionBtn /></a></div>
		</div>
		</div>
	);
}

export default HomeRow;