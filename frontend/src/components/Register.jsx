import { useState } from "react";

function Register({ onNavigate }) {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Full name is required.";
    else if (form.name.trim().length < 2) errs.name = "Name must be at least 2 characters.";
    if (!form.email.trim()) errs.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Enter a valid email address.";
    if (!form.password) errs.password = "Password is required.";
    else if (form.password.length < 6) errs.password = "Password must be at least 6 characters.";
    return errs;
  };

  const handleChange = async  (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async  (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);

    try {
  const response = await fetch("http://localhost:5000/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(form)
  });

  const data = await response.json();

  setLoading(false);

  if (data.user) {
    setSuccess(true);
  } else {
    setErrors({ email: data.error || "Registration failed" });
  }

} catch (err) {
  setLoading(false);
  setErrors({ general: "Server error" });
}
  };

  const strengthScore = () => {
    const p = form.password;
    if (!p) return 0;
    let s = 0;
    if (p.length >= 6) s++;
    if (p.length >= 10) s++;
    if (/[A-Z]/.test(p) && /[a-z]/.test(p)) s++;
    if (/[0-9]/.test(p) || /[^A-Za-z0-9]/.test(p)) s++;
    return s;
  };
  const score = strengthScore();
  const strengthLabels = ["", "Weak", "Fair", "Good", "Strong"];
  const strengthColors = ["", "danger", "warning", "info", "success"];

  if (success) {
    return (
      <div className="quiz-bg d-flex align-items-center justify-content-center min-vh-100 p-3">
        <div className="quiz-card card border-0 shadow-lg text-center p-5" style={{ maxWidth: 440, width: "100%" }}>
          <div className="success-icon mb-3">🎉</div>
          <h2 className="fw-bold mb-2" style={{ color: "#1a1a2e" }}>You're all set!</h2>
          <p className="text-muted mb-4">Account created for <strong>{form.name}</strong>. Ready to test your knowledge?</p>
          <button className="btn quiz-btn-primary w-100 py-2" onClick={() => onNavigate("login")}>
            Go to Login →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-bg d-flex align-items-center justify-content-center min-vh-100 p-3">
      <div className="quiz-card card border-0 shadow-lg" style={{ maxWidth: 440, width: "100%" }}>

        {/* Header */}
        <div className="quiz-card-header text-center p-4 pb-3">
          <div className="brand-icon mb-2">🧠</div>
          <h1 className="h4 fw-bold mb-1 text-white">Join QuizMaster</h1>
          <p className="text-white-50 small mb-0">Create your account &amp; start playing</p>
        </div>

        <div className="card-body p-4">

          {/* Stat badges */}
          <div className="d-flex justify-content-center gap-3 mb-4">
            {[["🏆","500+ Quizzes"],["⚡","Live Battles"],["🎖️","Leaderboards"]].map(([icon, label]) => (
              <div key={label} className="quiz-badge text-center px-2 py-1">
                <div style={{ fontSize: 14 }}>{icon}</div>
                <div style={{ fontSize: 10, color: "#6b7280", fontWeight: 600 }}>{label}</div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} noValidate>
            {/* Full Name */}
            <div className="mb-3">
              <label className="form-label fw-semibold small" style={{ color: "#374151" }}>
                Full Name
              </label>
              <div className="input-group">
                <span className="input-group-text quiz-input-icon">👤</span>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className={`form-control quiz-input ${errors.name ? "is-invalid" : form.name ? "is-valid" : ""}`}
                  placeholder="Alex Johnson"
                  autoComplete="name"
                />
                {errors.name && <div className="invalid-feedback">{errors.name}</div>}
              </div>
            </div>

            {/* Email */}
            <div className="mb-3">
              <label className="form-label fw-semibold small" style={{ color: "#374151" }}>
                Email Address
              </label>
              <div className="input-group">
                <span className="input-group-text quiz-input-icon">✉️</span>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className={`form-control quiz-input ${errors.email ? "is-invalid" : form.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) ? "is-valid" : ""}`}
                  placeholder="alex@example.com"
                  autoComplete="email"
                />
                {errors.email && <div className="invalid-feedback">{errors.email}</div>}
              </div>
            </div>

            {/* Password */}
            <div className="mb-3">
              <label className="form-label fw-semibold small" style={{ color: "#374151" }}>
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
                  placeholder="Min. 6 characters"
                  autoComplete="new-password"
                />
                <button type="button" className="input-group-text quiz-input-icon quiz-eye-btn"
                  onClick={() => setShowPassword((v) => !v)} tabIndex={-1}>
                  {showPassword ? "🙈" : "👁️"}
                </button>
                {errors.password && <div className="invalid-feedback">{errors.password}</div>}
              </div>

              {/* Strength meter */}
              {form.password && (
                <div className="mt-2">
                  <div className="d-flex gap-1 mb-1">
                    {[1,2,3,4].map((i) => (
                      <div key={i} className={`quiz-strength-bar ${i <= score ? `bg-${strengthColors[score]}` : "bg-light border"}`} />
                    ))}
                  </div>
                  <span className={`small fw-semibold text-${strengthColors[score]}`}>
                    {strengthLabels[score]}
                  </span>
                </div>
              )}
            </div>

            {/* Submit */}
            <button type="submit" className="btn quiz-btn-primary w-100 py-2 mt-1" disabled={loading}>
              {loading ? (
                <><span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />Creating Account…</>
              ) : (
                "🚀 Create Account"
              )}
            </button>
          </form>

          <hr className="my-3" style={{ borderColor: "#f0f0f0" }} />

          <p className="text-center small mb-0" style={{ color: "#6b7280" }}>
            Already have an account?{" "}
            <button className="btn btn-link p-0 quiz-link" onClick={() => onNavigate("login")}>
              Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;