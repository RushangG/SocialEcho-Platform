import { useNavigate, Link } from "react-router-dom";
import logo from "../assets/SocialEcho.png";
import { useState } from "react";
import ButtonLoadingSpinner from "../components/loader/ButtonLoadingSpinner";
import { IoIosArrowRoundBack } from "react-icons/io";
import { signInAction } from "../redux/actions/adminActions";
import { useDispatch, useSelector } from "react-redux";
import { MdOutlineAdminPanelSettings } from "react-icons/md";

const AdminSignIn = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [signingIn, setSigningIn] = useState(false);
  const [focused, setFocused] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const signInError = useSelector((state) => state.admin?.signInError);

  const handleUsernameChange = (e) => setUsername(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);

  const handleSubmit = (e) => {
    setSigningIn(true);
    e.preventDefault();
    dispatch(signInAction({ username, password })).then(() => {
      setSigningIn(false);
      navigate("/admin");
    });
  };

  return (
    <div className="auth-root">
      {/* LEFT PANEL */}
      <div className="auth-left auth-left-admin">
        <div className="auth-left-inner">
          <div className="auth-brand">
            <div className="auth-admin-badge">
              <MdOutlineAdminPanelSettings className="auth-admin-badge-icon" />
            </div>
            <img src={logo} alt="SocialEcho" className="auth-logo-hero" />
            <h1 className="auth-hero-title">Admin Portal</h1>
            <p className="auth-hero-sub">Manage and moderate SocialEcho with full control.</p>
          </div>
          <ul className="auth-feature-list">
            <li><span className="auth-feat-icon">✦</span> Full platform oversight</li>
            <li><span className="auth-feat-icon">✦</span> User & community management</li>
            <li><span className="auth-feat-icon">✦</span> Content moderation controls</li>
            <li><span className="auth-feat-icon">✦</span> Analytics & reporting</li>
          </ul>
          <div className="auth-left-orb auth-orb-1" />
          <div className="auth-left-orb auth-orb-2" />
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="auth-right">
        <div className="auth-form-card">
          <div className="auth-admin-header">
            <div className="auth-admin-icon-wrap">
              <MdOutlineAdminPanelSettings className="auth-admin-form-icon" />
            </div>
            <h2 className="auth-admin-title">Administrator Sign In</h2>
            <p className="auth-admin-desc">Restricted access — authorized personnel only</p>
          </div>

          {signInError && (
            <div className="auth-alert auth-alert-error">
              <span>{signInError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form" autoComplete="off">
            <div className={`auth-field ${focused === "username" ? "auth-field-focused" : ""}`}>
              <label htmlFor="admin-username" className="auth-label">Username</label>
              <div className="auth-input-wrap">
                <svg className="auth-input-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <input
                  id="admin-username" type="text" value={username} onChange={handleUsernameChange}
                  onFocus={() => setFocused("username")} onBlur={() => setFocused("")}
                  className="auth-input" placeholder="Admin username" aria-label="Username" autoComplete="off"
                />
              </div>
            </div>

            <div className={`auth-field ${focused === "password" ? "auth-field-focused" : ""}`}>
              <label htmlFor="admin-password" className="auth-label">Password</label>
              <div className="auth-input-wrap">
                <svg className="auth-input-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                <input
                  id="admin-password" type={showPassword ? "text" : "password"} value={password} onChange={handlePasswordChange}
                  onFocus={() => setFocused("password")} onBlur={() => setFocused("")}
                  className="auth-input" placeholder="Enter your password" aria-label="Password" autoComplete="off"
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

            <button type="submit" disabled={signingIn} className={`auth-btn-primary auth-btn-admin ${signingIn ? "auth-btn-loading" : ""}`}>
              {signingIn ? <ButtonLoadingSpinner loadingText="Signing in..." /> : "Sign In to Admin"}
            </button>
          </form>

          <div className="auth-footer-link">
            <Link to="/" className="auth-back-link">
              <IoIosArrowRoundBack className="auth-back-icon" />
              <span>Back to SocialEcho</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSignIn;
