import { useState } from "react";
import PropTypes from "prop-types";
import { IoClose } from "react-icons/io5";
import { useSelector } from "react-redux";

const Report = ({ isOpen, onClose, commentId }) => {
  const [reason, setReason] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState(null); // Handle error state
  const user = useSelector((state) => state.user);

  const reasons = [
    "Contenu à caractère sexuel",
    "Contenu violent ou abject",
    "Contenu abusif ou incitant à la haine",
    "Harcèlement ou intimidation",
    "Actes dangereux ou pernicieux",
    "Informations incorrectes",
    "Maltraitance d'enfants",
    "Incitation au terrorisme",
    "Spam ou contenu trompeur",
    "Problème juridique",
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if the reason is selected and the user is logged in
    if (!reason.trim()) {
      setError("Veuillez sélectionner une raison.");
      return;
    }

    if (!user.userId) {
      setError("Utilisateur non authentifié.");
      return;
    }

    const reportData = {
      reason,
      commentId,
    };

    setIsLoading(true); // Show loading state
    setError(null); // Reset any previous errors

    try {
      const response = await fetch(
        "http://localhost:9000/api/v1/report/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(reportData),
        }
      );

      if (response.ok) {
        // Report submitted successfully
        setIsSubmitted(true);
        setReason(""); // Reset the form
      } else {
        const errorMessage = await response.json();
        setError(errorMessage.msg || "Une erreur est survenue.");
      }
    } catch (error) {
      console.error("Erreur lors de la soumission du signalement :", error);
      setError("Une erreur est survenue lors de la soumission du signalement.");
    } finally {
      setIsLoading(false); // Hide loading state
    }
  };

  return (
    <div className={`report-overlay ${isOpen ? "active" : ""}`}>
      <aside className="report-form active">
        <button
          className="close-button"
          onClick={onClose}
          aria-label="Close modal"
        >
          <IoClose size={20} />
        </button>

        <h2 className="report-title">Signaler un commentaire</h2>

        {isSubmitted ? (
          <p>Votre signalement a été envoyé.</p>
        ) : (
          <form className="form-modal" onSubmit={handleSubmit}>
            <h3 className="report-subtitle">
              Raisons pour signaler un commentaire
            </h3>
            <ul className="report-reasons">
              {reasons.map((item, index) => (
                <li key={index}>
                  <label htmlFor={`reason-${index}`}>
                    <input
                      type="radio"
                      name="reason"
                      id={`reason-${index}`}
                      value={item}
                      checked={reason === item}
                      onChange={(e) => setReason(e.target.value)}
                    />
                    {item}
                  </label>
                </li>
              ))}
            </ul>
            {error && <p className="error-message">{error}</p>}{" "}
            {/* Display error message */}
            <button type="submit" className="submit-button">
              Signaler
            </button>
          </form>
        )}
      </aside>
    </div>
  );
};

Report.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  commentId: PropTypes.number.isRequired,
};

export default Report;
