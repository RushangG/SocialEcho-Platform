import { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router";
import axios from "axios";
import LoadingSpinner from "../components/loader/ButtonLoadingSpinner";

const BASE_URL = process.env.REACT_APP_API_URL;

const VerifyEmail = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const codeFromUrl = searchParams.get("code");
  const emailFromUrl = searchParams.get("email");
  const email = location.state ? location.state : emailFromUrl;

  const [code, setCode] = useState(codeFromUrl ? codeFromUrl : "");
  const [error, setError] = useState("");

  const handleCodeChange = (e) => {
    setCode(e.target.value);
  };

  const handleVerify = useCallback(() => {
    setLoading(true);
    const verificationLink = `${BASE_URL}/auth/verify?code=${code}&email=${email}`;
    axios
      .get(verificationLink)
      .then((res) => {
        if (res.status === 200) {
          navigate("/email-verified");
          setCode("");
          setError("");
          setLoading(false);
        }
      })
      .catch((err) => {
        setError(
          err.response.data.message || "Invalid code, please try again."
        );

        setLoading(false);
      });
  }, [code, email, navigate, setLoading, setError]);

  useEffect(() => {
    // Automatically trigger handleVerify if both code and email are present in the URL
    if (codeFromUrl && emailFromUrl) {
      handleVerify();
    }
  }, [codeFromUrl, emailFromUrl, handleVerify]);

  if (error === "Email is already verified") {
    navigate("/signin");
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 px-4 py-10">
      <div className="mx-auto flex w-full max-w-lg items-center justify-center">
        <div className="w-full rounded-2xl bg-white/95 p-6 shadow-lg ring-1 ring-slate-200 backdrop-blur-sm sm:p-8">
          <div className="mb-5 flex items-start gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 22a10 10 0 0010-10V9l-10-5-10 5v3a10 10 0 0010 10z" />
              </svg>
            </div>
            <div className="min-w-0">
              <h2 className="text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">
                Verify your email
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Enter the code from your email to finish setting up your account.
              </p>
            </div>
          </div>

          {!codeFromUrl && !emailFromUrl && (
            <p className="mb-4 text-sm text-slate-600">
              A verification code was sent to your email address. Please either
              <span className="font-semibold"> follow </span>
              the link in the email or
              <span className="font-semibold"> enter </span>
              the code below.
            </p>
          )}

          <div className="mb-4">
            <input
              type="text"
              placeholder="Verification code"
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 shadow-sm outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
              value={code}
              onChange={handleCodeChange}
            />
          </div>
          {error && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              disabled={loading}
              className="inline-flex w-full items-center justify-center rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
              onClick={handleVerify}
            >
              {loading ? <LoadingSpinner loadingText={"Verifying..."} /> : "Verify"}
            </button>
            <button
              className="inline-flex w-full items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-100 sm:w-auto"
              onClick={() => {
                navigate("/signup");
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
