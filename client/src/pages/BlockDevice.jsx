import { useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router";
import LoadingSpinner from "../components/loader/ButtonLoadingSpinner";
import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL;

const BlockDevice = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const idFromUrl = searchParams.get("id");
  const emailFromUrl = searchParams.get("email");

  const handleBlock = useCallback(() => {
    setLoading(true);
    const blockLink = `${BASE_URL}/auth/block-login?id=${idFromUrl}&email=${emailFromUrl}`;
    axios
      .get(blockLink)
      .then((res) => {
        if (res.status === 200) {
          setLoading(false);
          navigate("/signin");
        }
      })
      .catch((err) => {
        setLoading(false);
      });
  }, [idFromUrl, emailFromUrl, setLoading, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 px-4 py-10">
      <div className="mx-auto flex w-full max-w-lg items-center justify-center">
        <div className="w-full rounded-2xl bg-white/95 p-6 shadow-lg ring-1 ring-slate-200 backdrop-blur-sm sm:p-8">
          <div className="mb-5 flex items-start gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0 3.75h.008v.008H12v-.008zM21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="min-w-0">
              <h3 className="text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">
                Block this device?
              </h3>
              <p className="mt-1 text-sm text-slate-600">
                If you didn’t try to log in, you can block this device to keep your account safe.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => navigate("/signin")}
              className="inline-flex w-full items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-100 sm:w-auto"
            >
              Cancel
            </button>
            <button
              disabled={loading}
              onClick={handleBlock}
              className="inline-flex w-full items-center justify-center rounded-xl bg-red-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-100 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
            >
              {loading ? <LoadingSpinner loadingText={"Blocking..."} /> : "Block device"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlockDevice;
