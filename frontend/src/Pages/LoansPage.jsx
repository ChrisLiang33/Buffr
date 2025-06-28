import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext";
import { useNotification } from "../contexts/NotificationContext";
import { useOffline } from "../hooks/useOffline";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import ErrorMessage from "../components/ui/ErrorMessage";
import OtherFooter from "../components/OtherFooter";
import {
  IoAdd,
  IoDocumentText,
  IoCalculator,
  IoTime,
  IoCheckmarkCircle,
  IoClose,
  IoArrowBack,
} from "react-icons/io5";

const LoansPage = () => {
  const { user, userData } = useAuthContext();
  const { showSuccess, showError, showInfo } = useNotification();
  const { isOffline } = useOffline();

  const [loans, setLoans] = useState([]);
  const [loanTypes, setLoanTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showLoanForm, setShowLoanForm] = useState(false);
  const [selectedLoanType, setSelectedLoanType] = useState(null);
  const [formData, setFormData] = useState({
    amount: "",
    purpose: "",
    duration: "12",
    monthlyIncome: "",
  });

  // Mock loan types data
  useEffect(() => {
    const mockLoanTypes = [
      {
        id: 1,
        name: "Personal Loan",
        description: "Flexible loan for personal expenses",
        minAmount: 1000,
        maxAmount: 50000,
        interestRate: 12.5,
        duration: "12-60 months",
        requirements: ["Valid ID", "Proof of Income", "Bank Statement"],
        icon: "💰",
      },
      {
        id: 2,
        name: "Business Loan",
        description: "Loan for business expansion and working capital",
        minAmount: 5000,
        maxAmount: 200000,
        interestRate: 15.0,
        duration: "12-84 months",
        requirements: [
          "Business Registration",
          "Financial Statements",
          "Business Plan",
        ],
        icon: "🏢",
      },
      {
        id: 3,
        name: "Education Loan",
        description: "Loan for educational expenses and tuition fees",
        minAmount: 2000,
        maxAmount: 100000,
        interestRate: 10.5,
        duration: "12-72 months",
        requirements: [
          "Admission Letter",
          "Fee Structure",
          "Parent/Guardian Guarantee",
        ],
        icon: "🎓",
      },
      {
        id: 4,
        name: "Home Improvement Loan",
        description: "Loan for home renovation and improvements",
        minAmount: 3000,
        maxAmount: 150000,
        interestRate: 13.0,
        duration: "12-60 months",
        requirements: [
          "Property Documents",
          "Quotes from Contractors",
          "Building Permits",
        ],
        icon: "🏠",
      },
    ];

    setLoanTypes(mockLoanTypes);

    // Mock existing loans
    const mockLoans = [
      {
        id: 1,
        type: "Personal Loan",
        amount: 15000,
        remainingAmount: 12000,
        monthlyPayment: 450,
        nextPaymentDate: "2024-02-15",
        status: "active",
        appliedDate: "2023-08-15",
        duration: 36,
      },
    ];

    setLoans(mockLoans);
    setLoading(false);
  }, []);

  const handleLoanApplication = async (e) => {
    e.preventDefault();

    if (isOffline) {
      showError("You are offline. Please check your connection and try again.");
      return;
    }

    if (!selectedLoanType) {
      showError("Please select a loan type");
      return;
    }

    const amount = parseFloat(formData.amount);
    if (
      amount < selectedLoanType.minAmount ||
      amount > selectedLoanType.maxAmount
    ) {
      showError(
        `Amount must be between $${selectedLoanType.minAmount} and $${selectedLoanType.maxAmount}`
      );
      return;
    }

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const newLoan = {
        id: Date.now(),
        type: selectedLoanType.name,
        amount: amount,
        remainingAmount: amount,
        monthlyPayment: calculateMonthlyPayment(
          amount,
          selectedLoanType.interestRate,
          parseInt(formData.duration)
        ),
        nextPaymentDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
        status: "pending",
        appliedDate: new Date().toISOString().split("T")[0],
        duration: parseInt(formData.duration),
        purpose: formData.purpose,
      };

      setLoans((prev) => [...prev, newLoan]);
      setShowLoanForm(false);
      setSelectedLoanType(null);
      setFormData({
        amount: "",
        purpose: "",
        duration: "12",
        monthlyIncome: "",
      });

      showSuccess(
        "Loan application submitted successfully! We will review and get back to you within 2-3 business days."
      );
    } catch (error) {
      showError("Failed to submit loan application. Please try again.");
    }
  };

  const calculateMonthlyPayment = (principal, annualRate, months) => {
    const monthlyRate = annualRate / 100 / 12;
    return (
      (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
      (Math.pow(1 + monthlyRate, months) - 1)
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "text-green-600 bg-green-100";
      case "pending":
        return "text-yellow-600 bg-yellow-100";
      case "approved":
        return "text-blue-600 bg-blue-100";
      case "rejected":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "active":
        return <IoCheckmarkCircle className="w-4 h-4" />;
      case "pending":
        return <IoTime className="w-4 h-4" />;
      case "approved":
        return <IoCheckmarkCircle className="w-4 h-4" />;
      case "rejected":
        return <IoClose className="w-4 h-4" />;
      default:
        return <IoDocumentText className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-50">
        <LoadingSpinner size="xl" text="Loading loans..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Link to="/home" className="text-gray-600 hover:text-gray-800">
                <IoArrowBack className="w-6 h-6" />
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Loans</h1>
            </div>
            <button
              onClick={() => setShowLoanForm(true)}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <IoAdd className="w-5 h-5" />
              <span>Apply for Loan</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {error && (
          <ErrorMessage
            message={error}
            onClose={() => setError(null)}
            className="mb-6"
          />
        )}

        {isOffline && (
          <ErrorMessage
            message="You are currently offline. Some features may be limited."
            type="warning"
            className="mb-6"
          />
        )}

        {/* Current Loans */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Your Loans
          </h2>
          {loans.length === 0 ? (
            <div className="bg-white rounded-lg p-6 text-center">
              <IoDocumentText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">
                You don't have any loans yet.
              </p>
              <button
                onClick={() => setShowLoanForm(true)}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Apply for Your First Loan
              </button>
            </div>
          ) : (
            <div className="grid gap-4">
              {loans.map((loan) => (
                <div
                  key={loan.id}
                  className="bg-white rounded-lg p-6 shadow-sm"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {loan.type}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Applied on {loan.appliedDate}
                      </p>
                    </div>
                    <div
                      className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                        loan.status
                      )}`}
                    >
                      {getStatusIcon(loan.status)}
                      <span className="capitalize">{loan.status}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Original Amount</p>
                      <p className="text-lg font-semibold">
                        ${loan.amount.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Remaining</p>
                      <p className="text-lg font-semibold">
                        ${loan.remainingAmount.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Monthly Payment</p>
                      <p className="text-lg font-semibold">
                        ${loan.monthlyPayment.toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Next Payment</p>
                      <p className="text-lg font-semibold">
                        {loan.nextPaymentDate}
                      </p>
                    </div>
                  </div>

                  {loan.purpose && (
                    <div className="mt-4 pt-4 border-t">
                      <p className="text-sm text-gray-600">
                        Purpose: {loan.purpose}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Loan Types */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Available Loan Types
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {loanTypes.map((loanType) => (
              <div
                key={loanType.id}
                className="bg-white rounded-lg p-6 shadow-sm"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{loanType.icon}</span>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {loanType.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {loanType.description}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Interest Rate</p>
                    <p className="text-lg font-semibold">
                      {loanType.interestRate}%
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Duration</p>
                    <p className="text-lg font-semibold">{loanType.duration}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Min Amount</p>
                    <p className="text-lg font-semibold">
                      ${loanType.minAmount.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Max Amount</p>
                    <p className="text-lg font-semibold">
                      ${loanType.maxAmount.toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Requirements:
                  </p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {loanType.requirements.map((req, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <IoCheckmarkCircle className="w-4 h-4 text-green-500" />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => {
                    setSelectedLoanType(loanType);
                    setShowLoanForm(true);
                  }}
                  className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Apply Now
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Loan Application Modal */}
      {showLoanForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  {selectedLoanType
                    ? `Apply for ${selectedLoanType.name}`
                    : "Loan Application"}
                </h2>
                <button
                  onClick={() => {
                    setShowLoanForm(false);
                    setSelectedLoanType(null);
                    setFormData({
                      amount: "",
                      purpose: "",
                      duration: "12",
                      monthlyIncome: "",
                    });
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <IoClose className="w-6 h-6" />
                </button>
              </div>

              {selectedLoanType && (
                <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-2">
                    {selectedLoanType.name}
                  </h3>
                  <p className="text-sm text-blue-700 mb-2">
                    {selectedLoanType.description}
                  </p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-blue-600">Interest Rate:</span>{" "}
                      {selectedLoanType.interestRate}%
                    </div>
                    <div>
                      <span className="text-blue-600">Duration:</span>{" "}
                      {selectedLoanType.duration}
                    </div>
                  </div>
                </div>
              )}

              <form onSubmit={handleLoanApplication} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Loan Amount
                  </label>
                  <input
                    type="number"
                    value={formData.amount}
                    onChange={(e) =>
                      setFormData({ ...formData, amount: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter amount"
                    required
                    min={selectedLoanType?.minAmount || 0}
                    max={selectedLoanType?.maxAmount || 1000000}
                  />
                  {selectedLoanType && (
                    <p className="text-xs text-gray-500 mt-1">
                      Range: ${selectedLoanType.minAmount.toLocaleString()} - $
                      {selectedLoanType.maxAmount.toLocaleString()}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Purpose
                  </label>
                  <textarea
                    value={formData.purpose}
                    onChange={(e) =>
                      setFormData({ ...formData, purpose: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Describe the purpose of your loan"
                    rows="3"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration (months)
                  </label>
                  <select
                    value={formData.duration}
                    onChange={(e) =>
                      setFormData({ ...formData, duration: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="12">12 months</option>
                    <option value="24">24 months</option>
                    <option value="36">36 months</option>
                    <option value="48">48 months</option>
                    <option value="60">60 months</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Monthly Income
                  </label>
                  <input
                    type="number"
                    value={formData.monthlyIncome}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        monthlyIncome: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your monthly income"
                    required
                  />
                </div>

                {formData.amount && selectedLoanType && (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">
                      Loan Summary
                    </h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Principal Amount:</span>
                        <span>
                          ${parseFloat(formData.amount).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Interest Rate:</span>
                        <span>{selectedLoanType.interestRate}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Duration:</span>
                        <span>{formData.duration} months</span>
                      </div>
                      <div className="flex justify-between font-medium">
                        <span>Monthly Payment:</span>
                        <span>
                          $
                          {calculateMonthlyPayment(
                            parseFloat(formData.amount),
                            selectedLoanType.interestRate,
                            parseInt(formData.duration)
                          ).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowLoanForm(false);
                      setSelectedLoanType(null);
                      setFormData({
                        amount: "",
                        purpose: "",
                        duration: "12",
                        monthlyIncome: "",
                      });
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Submit Application
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <OtherFooter />
    </div>
  );
};

export default LoansPage;
