import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaPowerOff, FaSpaceShuttle, FaTimes } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../store/slicesRedux/user";
import { toggleMenu } from "../../store/slicesRedux/menu";

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
            <NavLink to="/automobile" aria-label="Automobile">
              Automobile
            </NavLink>
            <NavLink to="/aero" aria-label="Aviation">
              Aviation
            </NavLink>
            <NavLink to="/contact" aria-label="contact">
              Contactez-nous
            </NavLink>
          </div>

          <div className="auth-container">
            {user.isLogged ? (
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
                <NavLink
                  to="/auth/login"
                  className="login-link"
                  aria-label="connexion"
                >
                  S'identifier
                </NavLink>
                <NavLink
                  to="/auth/register"
                  className="register-link"
                  aria-label="s'inscrire"
                >
                  Démarrer
                </NavLink>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}

export default Header;
