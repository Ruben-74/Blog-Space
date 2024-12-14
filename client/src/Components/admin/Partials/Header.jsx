import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FaCommentDots,
  FaPowerOff,
  FaSpaceShuttle,
  FaTimes,
  FaUserAlt,
} from "react-icons/fa";
import { BiSolidCategory } from "react-icons/bi";
import { MdArticle, MdReport, MdMessage } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../../store/slicesRedux/user";
import { toggleMenu } from "../../../store/slicesRedux/menu";
import { FaHouse } from "react-icons/fa6";

function Header() {
  const user = useSelector((state) => state.user);
  console.log(user);
  const menu = useSelector((state) => state.menu);
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Utiliser le hook useNavigate

  const [type, setType] = useState(
    window.innerWidth > 768 ? "tabletAndMore" : "mobile"
  );

  useEffect(() => {
    const handleResize = () => {
      setType(window.innerWidth > 768 ? "tabletAndMore" : "mobile");
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  async function onClickLogout() {
    try {
      const response = await fetch("http://localhost:9000/api/v1/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      console.log(response);
      if (response.status === 200) {
        dispatch(logout());
        dispatch(toggleMenu());
        navigate("/"); // Utiliser navigate pour la redirection
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  }

  const shuttleStyle = {
    transform: type === "mobile" ? "rotate(-90deg)" : "none",
    transition: "transform 0.3s ease",
  };

  return (
    <header>
      <div className="header-content">
        {type === "mobile" && (
          <div className="logo-title">
            <FaSpaceShuttle size={50} />
            BlogSpace
          </div>
        )}
        {type === "mobile" && menu.isOpen ? (
          <button
            className="menu-toggle"
            onClick={() => dispatch(toggleMenu())}
            aria-label="Toggle menu"
          >
            <div className="menu-icon">
              <FaTimes size={20} />
            </div>
          </button>
        ) : (
          <button
            className="menu-toggle"
            onClick={() => dispatch(toggleMenu())}
            aria-label="Toggle menu"
          >
            <div className="menu-icon">
              <img src={`/icons/${user.avatar || "user.png"}`} alt="menu" />
            </div>
          </button>
        )}
        <nav
          className={`nav ${
            type === "mobile" && menu.isOpen ? "burger" : "screen"
          }`}
        >
          <NavLink
            to="/"
            className={type === "mobile" ? "logo-column" : "logo-title"}
          >
            <FaSpaceShuttle size={50} style={shuttleStyle} />
            <span>BlogSpace</span>
          </NavLink>

          <div className="links">
            <NavLink
              to="/"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              <FaHouse size={30} />
            </NavLink>
            <NavLink
              to="/post"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              <MdArticle size={30} />
            </NavLink>
            <NavLink
              to="/comment"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              <FaCommentDots size={30} />
            </NavLink>
            <NavLink
              to="/category"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              <BiSolidCategory size={30} />
            </NavLink>
            <NavLink
              to="/user"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              <FaUserAlt size={30} />
            </NavLink>
            <NavLink
              to="/contact"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              <MdMessage size={30} />
            </NavLink>
            <NavLink
              to="/report"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              <MdReport size={30} />
            </NavLink>
          </div>

          <div className="auth-container">
            {user.isLogged && type === "mobile" ? (
              <>
                <NavLink to="/dashboard" className="user-info">
                  <img
                    src={`/icons/${user.avatar}`}
                    alt="User Avatar"
                    className="avatar"
                  />
                </NavLink>

                <button
                  className="logout-button"
                  onClick={onClickLogout}
                  aria-label="Déconnexion"
                >
                  <FaPowerOff size={20} />
                </button>
              </>
            ) : (
              <>
                <NavLink to="/dashboard" className="user-info">
                  <img
                    src={`/icons/${user.avatar}`}
                    alt="User Avatar"
                    className="avatar"
                  />
                </NavLink>

                <button
                  className="logout-button"
                  onClick={onClickLogout}
                  aria-label="Logout"
                >
                  <FaPowerOff />
                </button>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}

export default Header;
