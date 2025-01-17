import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../public/assets/quiz (2).png";

const Navbar = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user?.isAdmin;
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Track sidebar state

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    alert("You have been logged out successfully."); // Alert on logout
    navigate("/login");
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div>
      <nav>
        <h1
          style={{
            textDecoration: "underline",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            src={logo}
            width="50px"
            height="50px"
            alt=""
            style={{ marginRight: "10px" }}
          />
          QuizMaster
        </h1>
        
        {/* Sidebar for Mobile View */}
        <div className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
          <button className="sidebar-toggle" onClick={toggleSidebar}>
            <i className="fa-solid fa-bars"></i>
          </button>
          <ul>
            <li>
              <Link to="/home">
                <i className="fa-solid fa-house"></i> Home
              </Link>
            </li>
            <li>
              <Link to="/register">
                <i className="fa-solid fa-address-card"></i> Register
              </Link>
            </li>
            {user ? (
              <li>
                <Link onClick={handleLogout} to="/login">
                  <i className="fa-solid fa-right-from-bracket"></i> Logout
                </Link>
              </li>
            ) : (
              <li>
                <Link to="/login">
                  <i className="fa-solid fa-arrow-right-to-bracket"></i> Login
                </Link>
              </li>
            )}
            <li>
              <Link to="/quiz">
                <i className="fa-solid fa-list"></i> Quiz List
              </Link>
            </li>
            <li>
              <Link to="/leaderboards">
                <i className="fa-solid fa-ranking-star"></i> Leaderboards
              </Link>
            </li>
            {isAdmin && (
              <>
                <li>
                  <Link to="/createquiz">
                    <i className="fa-solid fa-plus"></i> Create Quiz
                  </Link>
                </li>
                <li>
                  <Link to="/updatequiz">
                    <i className="fa-solid fa-pen-to-square"></i> Update Quiz
                  </Link>
                </li>
                <li>
                  <Link to="/deletequiz">
                    <i className="fa-solid fa-trash"></i> Delete Quiz
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>

        {/* Desktop View Navigation */}
        <ul className="desktop-nav">
          <li>
            <Link to="/home">
              <i className="fa-solid fa-house"></i> Home
            </Link>
          </li>
          <li>
            <Link to="/register">
              <i className="fa-solid fa-address-card"></i> Register
            </Link>
          </li>
          {user ? (
            <li>
              <Link onClick={handleLogout} to="/login">
                <i className="fa-solid fa-right-from-bracket"></i> Logout
              </Link>
            </li>
          ) : (
            <li>
              <Link to="/login">
                <i className="fa-solid fa-arrow-right-to-bracket"></i> Login
              </Link>
            </li>
          )}
          <li>
            <Link to="/quiz">
              <i className="fa-solid fa-list"></i> Quiz List
            </Link>
          </li>
          <li>
            <Link to="/leaderboards">
              <i className="fa-solid fa-ranking-star"></i> Leaderboards
            </Link>
          </li>
          {isAdmin && (
            <>
              <li>
                <Link to="/createquiz">
                  <i className="fa-solid fa-plus"></i> Create Quiz
                </Link>
              </li>
              <li>
                <Link to="/updatequiz">
                  <i className="fa-solid fa-pen-to-square"></i> Update Quiz
                </Link>
              </li>
              <li>
                <Link to="/deletequiz">
                  <i className="fa-solid fa-trash"></i> Delete Quiz
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </div>
  );
};

export default Navbar;
