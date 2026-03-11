import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signInAction, clearMessage } from "../redux/actions/authActions";
import { RxCross1 } from "react-icons/rx";
import { MdOutlineAdminPanelSettings } from "react-icons/md";
import ButtonLoadingSpinner from "../components/loader/ButtonLoadingSpinner";
import Logo from "../assets/SocialEcho.png";

const SignIn = () => {
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setLoadingText("Signing in...");
    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);
    const timeout = setTimeout(() => {
      setLoadingText(
        "This is taking longer than usual. Please wait while backend services are getting started."
      );
    }, 5000);
    await dispatch(signInAction(formData, navigate));
    setLoading(false);
    clearTimeout(timeout);
  };

  const signInError = useSelector((state) => state.auth?.signInError);
  const successMessage = useSelector((state) => state.auth?.successMessage);

  const handleClearMessage = () => {
    dispatch(clearMessage());
  };

  return (
    <div className="auth-root">
      {/* LEFT PANEL */}
      <div className="auth-left">
        <div className="auth-left-inner">
          <div className="auth-brand">
            <img src={Logo} alt="SocialEcho" className="auth-logo-hero" />
            <h1 className="auth-hero-title">SocialEcho</h1>
            <p className="auth-hero-sub">Where your voice finds its echo.</p>
          </div>
          <ul className="auth-feature-list">
            <li><span className="auth-feat-icon">✦</span> Connect with communities that matter</li>
            <li><span className="auth-feat-icon">✦</span> Smart content moderation built-in</li>
            <li><span className="auth-feat-icon">✦</span> Context-aware secure authentication</li>
            <li><span className="auth-feat-icon">✦</span> Real-time feeds & conversations</li>
          </ul>
          <div className="auth-left-orb auth-orb-1" />
          <div className="auth-left-orb auth-orb-2" />
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="auth-right">
        <div className="auth-form-card">
          <div className="auth-tabs">
            <Link to="/signin" className="auth-tab auth-tab-active">Sign In</Link>
            <Link to="/signup" className="auth-tab">Sign Up</Link>
          </div>

          {signInError && (
            <div className="auth-alert auth-alert-error">
              <span>{signInError}</span>
              <button onClick={handleClearMessage}><RxCross1 /></button>
            </div>
          )}
          {successMessage && (
            <div className="auth-alert auth-alert-success">
              <span>{successMessage}</span>
              <button onClick={handleClearMessage}><RxCross1 /></button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form" autoComplete="off">
            <div className={`auth-field ${focused === "email" ? "auth-field-focused" : ""}`}>
              <label htmlFor="email" className="auth-label">Email Address</label>
              <div className="auth-input-wrap">
                <svg className="auth-input-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                <input
                  id="email" type="email" value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocused("email")}
                  onBlur={() => setFocused("")}
                  className="auth-input" placeholder="you@example.com" required autoComplete="off"
                />
              </div>
            </div>

            <div className={`auth-field ${focused === "password" ? "auth-field-focused" : ""}`}>
              <label htmlFor="password" className="auth-label">Password</label>
              <div className="auth-input-wrap">
                <svg className="auth-input-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                <input
                  id="password" type={showPassword ? "text" : "password"} value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocused("password")}
                  onBlur={() => setFocused("")}
                  className="auth-input" placeholder="••••••••" required autoComplete="off"
                />
                <button
                  type="button"
                  className="auth-input-toggle"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M3 3l18 18M10.477 10.48A3 3 0 0113.52 13.52M9.88 9.88L7.05 7.05M9.88 9.88L7.05 7.05M6.228 6.228C4.24 7.385 2.812 9.17 2.25 10c1.5 2.25 4.5 6 9.75 6 1.273 0 2.416-.214 3.43-.574M9.88 9.88A3 3 0 0014.12 14.12" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M2.25 12C3.75 9.75 6.75 6 12 6s8.25 3.75 9.75 6c-1.5 2.25-4.5 6-9.75 6S3.75 14.25 2.25 12z" />
                      <circle cx="12" cy="12" r="3" strokeWidth={1.7} />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`auth-btn-primary ${loading ? "auth-btn-loading" : ""}`}
            >
              {loading ? <ButtonLoadingSpinner loadingText={loadingText} /> : "Sign In"}
            </button>
          </form>

          <div className="auth-footer-link">
            <Link to="/admin" className="auth-admin-link">
              <MdOutlineAdminPanelSettings />
              <span>Admin Portal</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
