// import logo from './logo.svg';
// import CreateQuix from './components/CreateQuiz';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <CreateQuix />
//       </header>
//     </div>
//   );
// }

// export default App;

import "./App.css";
import { useState } from "react";
import Register from "./components/Register";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";

export default function App() {
  const [page, setPage] = useState("register"); // "register" | "login" | "dashboard"
  const [currentUser, setCurrentUser] = useState(null);

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    setPage("dashboard");
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setPage("login");
  };

  return (
    <>
      {/* Bootstrap 5 CDN */}
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.2/css/bootstrap.min.css"
        integrity="sha512-b2QcS5SsA8tZodcDtGRELiGv5SaKSk1vDHDaQRda0htPYWZ6046lr3kJ5bAAQdpV2mmA/4v0wQF9MyU6/pDIAg=="
        crossOrigin="anonymous"
      />

      {page === "register" && <Register onNavigate={setPage} />}
      {page === "login" && (
        <Login onNavigate={setPage} onLoginSuccess={handleLoginSuccess} />
      )}
      {page === "dashboard" && currentUser && (
        <Dashboard user={currentUser} onLogout={handleLogout} />
      )}
    </>
  );
}
