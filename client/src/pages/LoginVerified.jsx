import { useState, useCallback, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import { Link } from "react-router-dom";
import axios from "axios";
const BASE_URL = process.env.REACT_APP_API_URL;

const LoginVerified = () => {
  const [isVerified, setIsVerified] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const idFromUrl = searchParams.get("id");
  const emailFromUrl = searchParams.get("email");

  const handleVerify = useCallback(() => {
    const verifyUrl = `${BASE_URL}/auth/verify-login?id=${idFromUrl}&email=${emailFromUrl}`;
    axios
      .get(verifyUrl)
      .then((res) => {
        if (res.status === 200) {
          setIsVerified(true);
        }
      })
      .catch((err) => {
        setIsVerified(false);
      });
  }, [idFromUrl, emailFromUrl, setIsVerified]);

  useEffect(() => {
    // Automatically trigger handleVerify if both id and email are present in the URL
    if (idFromUrl && emailFromUrl) {
      handleVerify();
    }
  }, [idFromUrl, emailFromUrl, handleVerify]);

  if (!isVerified) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 px-4 py-10">
        <div className="mx-auto flex w-full max-w-2xl items-center justify-center">
          <div className="w-full rounded-2xl bg-white/95 p-6 shadow-lg ring-1 ring-slate-200 backdrop-blur-sm sm:p-8">
            <div className="mb-4 flex items-start gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0 3.75h.008v.008H12v-.008zM21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="min-w-0">
                <h2 className="text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">
                  Verification pending
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  Please check your email for the verification link. If you’ve already verified, try signing in again.
                </p>
              </div>
            </div>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <Link
                className="inline-flex w-full items-center justify-center rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100 sm:w-auto"
                to="/signin"
              >
                Go to Sign In
              </Link>
              <Link
                className="inline-flex w-full items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-100 sm:w-auto"
                to="/signup"
              >
                Back to Sign Up
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 px-4 py-10">
      <div className="mx-auto flex w-full max-w-lg items-center justify-center">
        <div className="w-full rounded-2xl bg-white/95 p-6 text-center shadow-lg ring-1 ring-slate-200 backdrop-blur-sm sm:p-8">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m7 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">
            Login verified
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            You have been verified and can now sign in.
          </p>
          <button
            onClick={() => navigate("/signin")}
            className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100"
          >
            Continue to Sign In
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginVerified;
