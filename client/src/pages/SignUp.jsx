import { useState } from "react";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { signUpAction, clearMessage } from "../redux/actions/authActions";
import { Link } from "react-router-dom";
import ContextAuthModal from "../components/modals/ContextAuthModal";
import { RxCross1 } from "react-icons/rx";
import ButtonLoadingSpinner from "../components/loader/ButtonLoadingSpinner";
import Logo from "../assets/SocialEcho.png";

const SignUpNew = () => {
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [avatarError, setAvatarError] = useState(null);
  const [focused, setFocused] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const signUpError = useSelector((state) => state.auth?.signUpError);

  const handleNameChange = (e) => setName(e.target.value);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setIsModerator(e.target.value.includes("mod.socialecho.com"));
  };

  const handlePasswordChange = (e) => setPassword(e.target.value);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) { setAvatar(null); setAvatarError(null); return; }
    if (!["image/jpeg","image/png","image/jpg"].includes(file.type)) {
      setAvatar(null); setAvatarError("Please upload a valid image (jpeg, jpg, png)");
    } else if (file.size > 10 * 1024 * 1024) {
      setAvatar(null); setAvatarError("Image must be less than 10MB");
    } else {
      setAvatar(file); setAvatarError(null);
    }
  };

  const [isConsentGiven, setIsConsentGiven] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModerator, setIsModerator] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setLoadingText("Creating account...");
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("avatar", avatar);
    formData.append("role", "general");
    formData.append("isConsentGiven", isConsentGiven.toString());
    const timeout = setTimeout(() => {
      setLoadingText("This is taking longer than usual. Please wait...");
    }, 5000);
    await dispatch(signUpAction(formData, navigate, isConsentGiven, email));
    setLoading(false);
    setIsConsentGiven(false);
    clearTimeout(timeout);
  };

  const handleClearError = () => dispatch(clearMessage());

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
            <Link to="/signin" className="auth-tab">Sign In</Link>
            <Link to="/signup" className="auth-tab auth-tab-active">Sign Up</Link>
          </div>

          {signUpError && Array.isArray(signUpError) && signUpError.map((err, i) => (
            <div className="auth-alert auth-alert-error" key={i}>
              <span>{err}</span>
              <button onClick={handleClearError}><RxCross1 /></button>
            </div>
          ))}

          <form onSubmit={handleSubmit} className="auth-form" autoComplete="off">
            <div className={`auth-field ${focused === "name" ? "auth-field-focused" : ""}`}>
              <label htmlFor="name" className="auth-label">Username</label>
              <div className="auth-input-wrap">
                <svg className="auth-input-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                <input
                  id="name" type="text" value={name} onChange={handleNameChange}
                  onFocus={() => setFocused("name")} onBlur={() => setFocused("")}
                  className="auth-input" placeholder="Choose a username" required autoComplete="off"
                />
              </div>
            </div>

            <div className="auth-field">
              <label className="auth-label">Profile Photo <span className="auth-label-opt">(optional)</span></label>
              <label htmlFor="avatar" className="auth-file-label">
                <svg xmlns="http://www.w3.org/2000/svg" className="auth-file-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                <span className="auth-file-text">{avatar ? avatar.name : "Upload photo (jpeg, jpg, png, max 10MB)"}</span>
                <input id="avatar" type="file" className="hidden" name="avatar" accept="image/*" onChange={handleAvatarChange} autoComplete="off" />
              </label>
              {avatarError && <p className="auth-file-error">{avatarError}</p>}
            </div>

            <div className={`auth-field ${focused === "email" ? "auth-field-focused" : ""}`}>
              <label htmlFor="email" className="auth-label">Email Address</label>
              <div className="auth-input-wrap">
                <svg className="auth-input-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                <input
                  id="email" type="email" value={email} onChange={handleEmailChange}
                  onFocus={() => setFocused("email")} onBlur={() => setFocused("")}
                  className="auth-input" placeholder="you@example.com" required autoComplete="off"
                />
              </div>
            </div>

            <div className={`auth-field ${focused === "password" ? "auth-field-focused" : ""}`}>
              <label htmlFor="password" className="auth-label">Password</label>
              <div className="auth-input-wrap">
                <svg className="auth-input-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                <input
                  id="password" type={showPassword ? "text" : "password"} value={password} onChange={handlePasswordChange}
                  onFocus={() => setFocused("password")} onBlur={() => setFocused("")}
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

            <button type="submit" disabled={loading} className={`auth-btn-primary ${loading ? "auth-btn-loading" : ""}`}>
              {loading ? <ButtonLoadingSpinner loadingText={loadingText} /> : "Create Account"}
            </button>

            <button type="button" onClick={() => setIsModalOpen(true)} className={`auth-consent-btn ${isConsentGiven && !isModerator ? "auth-consent-active" : ""}`}>
              <span className={`auth-consent-dot ${isConsentGiven && !isModerator ? "auth-consent-dot-active" : ""}`} />
              {isConsentGiven && !isModerator ? "Context-Based Auth: Enabled" : "Context-Based Auth: Disabled"}
            </button>
          </form>

          <ContextAuthModal
            isModalOpen={isModalOpen}
            setIsModalOpen={setIsModalOpen}
            setIsConsentGiven={setIsConsentGiven}
            isModerator={isModerator}
          />
        </div>
      </div>
    </div>
  );
};

export default SignUpNew;
