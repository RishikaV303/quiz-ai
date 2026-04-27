import CreateQuiz from "./CreateQuiz";
function Dashboard({ user, onLogout }) {
  return (
    <div className="quiz-bg min-vh-100 p-3 p-md-4">
      {/* Navbar */}
      <nav className="quiz-navbar navbar rounded-3 shadow-sm mb-4 px-3 py-2 d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center gap-2">
          <span style={{ fontSize: 24 }}>🧠</span>
          <span className="fw-bold" style={{ color: "#1a1a2e", fontSize: 18 }}>
            QuizMaster
          </span>
        </div>
        <div className="d-flex align-items-center gap-3">
          <div className="d-none d-sm-flex align-items-center gap-2">
            <div className="quiz-avatar">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <span className="small fw-bold" style={{ color: "#374151" }}>
              {user.name}
            </span>
          </div>
          <button className="btn quiz-btn-outline btn-sm" onClick={onLogout}>
            Logout
          </button>
        </div>
      </nav>

      {/* Welcome banner */}
      <div className="quiz-welcome-banner rounded-3 p-4 mb-4 shadow-sm">
        <div className="row align-items-center">
          <div className="col">
            <h2 className="fw-bold mb-1 text-white">
              Welcome back, {user.name.split(" ")[0]}! 👋
            </h2>
            <p className="mb-0" style={{ color: "rgba(255,255,255,0.6)" }}>
              Ready to challenge yourself? Pick a quiz below.
            </p>
          </div>
          <div className="col-auto d-none d-md-flex gap-4">
            {[
              ["🏆", "0", "Points"],
              ["✅", "0", "Completed"],
            ].map(([icon, val, label]) => (
              <div key={label} className="text-center">
                <div style={{ fontSize: 20 }}>{icon}</div>
                <div className="fw-bold text-white">{val}</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quiz grid */}
      <h5 className="fw-bold mb-3" style={{ color: "#fff" }}>
        Create Your Quiz
      </h5>

      <CreateQuiz user={user} />
    </div>
  );
}
export default Dashboard;
