import React, { useState } from "react";
import PropTypes from "prop-types";
import { FaTimes } from "react-icons/fa";

function ReportDetail({ setIsModalToggle, currentReport, fetchReports }) {
  const [status, setStatus] = useState(currentReport.status || "");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const submitReport = async (e) => {
    e.preventDefault();
    setError(""); // Reset error message on new submission
    setSuccess("");

    if (!status) {
      setError("Veuillez sélectionner un statut.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:9000/api/v1/report/update/${currentReport.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            status: status,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Erreur lors de l'envoi du signalement.");
      }

      setSuccess("Statut mis à jour avec succès !");
      fetchReports(); // Rafraîchir la liste des signalements

      setTimeout(() => {
        setIsModalToggle(false);
      }, 1000);
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la mise à jour. Veuillez réessayer.");
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

        <h2>Détails du signalement</h2>
        <table className="message-details-table">
          <tbody>
            <tr>
              <th>ID</th>
              <td>{currentReport.id}</td>
            </tr>
            <tr>
              <th>Créateur</th>
              <td>{currentReport.username}</td>
            </tr>
            <tr>
              <th>Raison</th>
              <td>{currentReport.reason}</td>
            </tr>
            <tr>
              <th>Message</th>
              <td>{currentReport.message}</td>
            </tr>
            <tr>
              <th>Status</th>
              <td>{currentReport.status}</td>
            </tr>
            <tr>
              <th>Date de Publication</th>
              <td>{new Date(currentReport.created_at).toLocaleString()}</td>
            </tr>
          </tbody>
        </table>

        <form onSubmit={submitReport}>
          <label htmlFor="status">Statut</label>
          <select
            name="status"
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="pending">En attente</option>
            <option value="rejeted">rejeté</option>
            <option value="accepted">Accepté</option>
          </select>

          <button className="submit-button" type="submit">
            Ajouter
          </button>
        </form>

        {error && <p className="error-msg">{error}</p>}
        {success && <p className="success-msg">{success}</p>}
      </aside>
    </div>
  );
}

ReportDetail.propTypes = {
  setIsModalToggle: PropTypes.func.isRequired,
  currentReport: PropTypes.shape({
    id: PropTypes.number.isRequired,
    username: PropTypes.string.isRequired,
    reason: PropTypes.string.isRequired,
    message: PropTypes.string,
    status: PropTypes.string.isRequired,
    created_at: PropTypes.string.isRequired,
  }).isRequired,
};

export default ReportDetail;
