import React, { useEffect } from "react";
import Form from "../Partials/Form";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaSpaceShuttle } from "react-icons/fa";
import {
  login,
  loginFailed,
  setMsg,
  updateField,
} from "../../store/slicesRedux/user";
import { toggleMenu } from "../../store/slicesRedux/menu";

function Login() {
  // le state de l'utilisateur
  const user = useSelector((state) => state.user);
  // le state du menu
  const menu = useSelector((state) => state.menu);

  const { authError } = useSelector((state) => state.user); // Message d'erreur éventuel
  // on récupère la fonction dispatch pour envoyer des actions
  const dispatch = useDispatch();
  // on récupère la fonction navigate pour la redirection
  const navigate = useNavigate();

  useEffect(() => {
    if (menu.isOpen) dispatch(toggleMenu());
    // on remet le mot de passe à vide pour éviter qu'il soit prérempli si on revient sur la page
    return () => {
      dispatch(updateField({ username: user.email, password: "" }));
    };
  }, []);

  async function submitHandler(e) {
    e.preventDefault();

    if (!user.email || !user.password) {
      dispatch(setMsg("Remplissez tous les champs"));
      return;
    }

    try {
      const response = await fetch("http://localhost:9000/api/v1/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Login response data:", data);

        // Vérifie si l'utilisateur est actif
        if (data.user.is_active === 0) {
          dispatch(loginFailed({ error: "Votre compte est désactivé." }));
          return; // Ne pas continuer si le compte est désactivé
        }

        dispatch(login(data)); // Dispatch la connexion avec les infos de l'utilisateur
        navigate("/"); // Rediriger vers la page d'accueil
      } else {
        const errorData = await response.json();
        if (errorData.msg === "Utilisateur non trouvé") {
          dispatch(
            loginFailed({
              error: "Compte inexistant. Veuillez vérifier votre email.",
            })
          );
        } else {
          dispatch(loginFailed({ error: errorData.msg }));
        }
      }
    } catch (err) {
      dispatch(setMsg("Erreur lors de la connexion. Veuillez réessayer.")); // Gestion d'une erreur de connexion
    }
  }

  return (
    <section className="form-container">
      <FaSpaceShuttle size={50} />
      <hr />
      <h1>Welcome back to BlogSpace</h1>

      {/* Div pour regrouper le paragraphe et le lien */}
      <div className="info-line">
        <p>New in this platform?</p>
        <Link to={"/auth/register"}>Sign up</Link>
      </div>
      <Form submitHandler={submitHandler} isRegister={false}>
        {authError && <p>{authError}</p>}
        <button type="submit">Login</button>
      </Form>
    </section>
  );
}

export default Login;
