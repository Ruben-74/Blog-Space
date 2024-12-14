import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { FaTimes, FaEnvelope } from "react-icons/fa";

function MessageDetail({ setIsModalToggle, currentMessage, renderStatus }) {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Focus sur le champ de message au premier rendu de la modal
  useEffect(() => {
    const messageField = document.getElementById("message");
    if (messageField) {
      messageField.focus();
    }
  }, []);

  const submitComment = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(""); // Reset error message on new submission
    setSuccess(false); // Reset success message

    try {
      const response = await fetch(
        `http://localhost:9000/api/v1/contact/reply`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            email: currentMessage.email, // Récupère l'email de l'utilisateur
            subject: `Réponse à votre message`, // Sujet de l'email
            content: message, // Contenu de la réponse
          }),
        }
      );

      if (!response.ok) {
        const errorDetails = await response.json();
        throw new Error(
          errorDetails.msg || "Erreur lors de l'envoi du commentaire."
        );
      }

      setSuccess(true); // Message de succès
      setMessage(""); // Reset message field
      setIsModalToggle(false); // Ferme la modal après l'envoi
    } catch (err) {
      console.error(err);
      setError("Erreur lors de l'envoi du commentaire. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <aside className="modal-form active">
        <button
          className="close-button"
          onClick={() => setIsModalToggle(false)}
          aria-label="Fermer la modal"
        >
          <FaTimes />
        </button>

        <h2>Détails du Message</h2>
        <table className="message-details-table">
          <tbody>
            <tr>
              <th>ID</th>
              <td>{currentMessage.id}</td>
            </tr>
            <tr>
              <th>Nom d'utilisateur</th>
              <td>{currentMessage.username}</td>
            </tr>
            <tr>
              <th>Email</th>
              <td>{currentMessage.email}</td>
            </tr>
            <tr>
              <th>Contenu</th>
              <td>{currentMessage.content}</td>
            </tr>
            <tr>
              <th>Status</th>
              <td>{renderStatus(currentMessage.status)}</td>
            </tr>
            <tr>
              <th>Date de Publication</th>
              <td>{new Date(currentMessage.publish_date).toLocaleString()}</td>
            </tr>
          </tbody>
        </table>

        <h2>Répondre au message</h2>
        <form onSubmit={submitComment}>
          <label htmlFor="message">Message</label>
          <textarea
            name="message"
            id="message"
            required
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows="5"
            style={{ resize: "vertical" }}
            disabled={isLoading}
          />
          <button type="submit" className="reply-button" disabled={isLoading}>
            {isLoading ? (
              <span className="spinner"></span> // Vous pouvez ajouter un spinner ici
            ) : (
              <FaEnvelope size={15} />
            )}
            {isLoading ? "Envoi..." : "Répondre"}
          </button>
        </form>

        {success && (
          <p className="success-message">Commentaire envoyé avec succès !</p>
        )}
        {error && <p className="error-message">{error}</p>}
      </aside>
    </div>
  );
}

MessageDetail.propTypes = {
  setIsModalToggle: PropTypes.func.isRequired,
  currentMessage: PropTypes.object.isRequired,
  renderStatus: PropTypes.func.isRequired,
};

export default MessageDetail;
