import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function NotFound404() {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    if (countdown === 0) {
      clearInterval(timer);
      navigate("/"); // Redirige vers la page d'accueil après 5 secondes
    }

    return () => clearInterval(timer);
  }, [countdown, navigate]);

  return (
    <div className="not-found">
      <h1 className="not-found__title">404</h1>
      <h2 className="not-found__subtitle">Page Introuvable</h2>
      <p className="not-found__message">
        Désolé, la page que vous cherchez n'existe pas.
      </p>
      <p className="not-found__redirect">
        Vous serez redirigé vers la page d'accueil dans {countdown} secondes.
      </p>
      <button className="not-found__button" onClick={() => navigate("/")}>
        Retourner à l'accueil
      </button>
    </div>
  );
}

export default NotFound404;
