import { useState } from "react";

function Login({ onNavigate, onLoginSuccess }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);

  const validate = () => {
    const errs = {};
    if (!form.email.trim()) errs.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errs.email = "Enter a valid email address.";
    if (!form.password) errs.password = "Password is required.";
    return errs;
  };

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      setLoading(false);

      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
        onLoginSuccess(data.user);
      } else {
        setErrors({ general: "Invalid credentials" });
      }
    } catch (err) {
      setLoading(false);
      setErrors({ general: "Server error" });
    }
  };

  const handleForgot = () => {
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setErrors({
        email: "Enter your email above first, then click Forgot Password.",
      });
      return;
    }
    setForgotSent(true);
    setTimeout(() => setForgotSent(false), 4000);
  };

  return (
    <div className="quiz-bg d-flex align-items-center justify-content-center min-vh-100 p-3">
      <div
        className="quiz-card card border-0 shadow-lg"
        style={{ maxWidth: 420, width: "100%" }}
      >
        {/* Header */}
        <div className="quiz-card-header text-center p-4 pb-3">
          <div className="brand-icon mb-2">🎯</div>
          <h1 className="h4 fw-bold mb-1 text-white">Welcome Back!</h1>
          <p className="text-white-50 small mb-0">
            Sign in to continue your quiz journey
          </p>
        </div>

        <div className="card-body p-4">
          {/* Motivational banner */}
          <div className="quiz-motivate-banner d-flex align-items-center gap-2 rounded-3 px-3 py-2 mb-4">
            <span style={{ fontSize: 20 }}>🔥</span>
            <span className="small fw-semibold" style={{ color: "#92400e" }}>
              You've got quizzes waiting for you!
            </span>
          </div>

          {/* General error */}
          {errors.general && (
            <div
              className="alert quiz-alert-error d-flex align-items-center gap-2 py-2 mb-3"
              role="alert"
            >
              <span>❌</span>
              <span className="small">{errors.general}</span>
            </div>
          )}

          {/* Forgot password confirmation */}
          {forgotSent && (
            <div
              className="alert quiz-alert-success d-flex align-items-center gap-2 py-2 mb-3"
              role="alert"
            >
              <span>📧</span>
              <span className="small">
                Password reset link sent to <strong>{form.email}</strong>
              </span>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            {/* Email */}
            <div className="mb-3">
              <label
                className="form-label fw-semibold small"
                style={{ color: "#374151" }}
              >
                Email Address
              </label>
              <div className="input-group">
                <span className="input-group-text quiz-input-icon">✉️</span>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className={`form-control quiz-input ${errors.email ? "is-invalid" : ""}`}
                  placeholder="alex@example.com"
                  autoComplete="email"
                />
                {errors.email && (
                  <div className="invalid-feedback">{errors.email}</div>
                )}
              </div>
            </div>

            {/* Password */}
            <div className="mb-2">
              <label
                className="form-label fw-semibold small"
                style={{ color: "#374151" }}
              >
                Password
              </label>
              <div className="input-group">
                <span className="input-group-text quiz-input-icon">🔑</span>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  className={`form-control quiz-input ${errors.password ? "is-invalid" : ""}`}
                  placeholder="Your password"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="input-group-text quiz-input-icon quiz-eye-btn"
                  onClick={() => setShowPassword((v) => !v)}
                  tabIndex={-1}
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
                {errors.password && (
                  <div className="invalid-feedback">{errors.password}</div>
                )}
              </div>
            </div>

            {/* Forgot password */}
            <div className="text-end mb-4">
              <button
                type="button"
                className="btn btn-link p-0 quiz-link small"
                onClick={handleForgot}
              >
                Forgot password?
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="btn quiz-btn-primary w-100 py-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  />
                  Signing In…
                </>
              ) : (
                "🎮 Start Playing"
              )}
            </button>
          </form>

          <hr className="my-3" style={{ borderColor: "#f0f0f0" }} />

          <p className="text-center small mb-0" style={{ color: "#6b7280" }}>
            Don't have an account?{" "}
            <button
              className="btn btn-link p-0 quiz-link"
              onClick={() => onNavigate("register")}
            >
              Sign Up Free
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
