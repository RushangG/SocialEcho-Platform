import { useNavigate } from "react-router";

const EmailVerifiedMessage = () => {
  const navigate = useNavigate();

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
            Email verified
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Your email has been verified and your account has been created successfully.
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

export default EmailVerifiedMessage;
