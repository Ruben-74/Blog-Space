import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { FaTimes } from "react-icons/fa";

function Create({ setIsModalToggle, fetchReports }) {
  const [reason, setReason] = useState("");
  const [userId, setUserId] = useState("");
  const [commentId, setCommentId] = useState("");
  const [users, setUsers] = useState([]);
  const [comments, setComments] = useState([]);

  const fetchUsers = async () => {
    try {
      const response = await fetch("http://localhost:9000/api/v1/user/list");
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des utilisateurs :", error);
    } finally {
      setLoadingUsers(false);
    }
  };

  const fetchComment = async () => {
    try {
      const response = await fetch("http://localhost:9000/api/v1/comment/all", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      const data = await response.json();
      setComments(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des commentaires :", error);
    } finally {
      setLoadingComments(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchComment();
  }, []);

  const submitReport = async (e) => {
    e.preventDefault();
    if (!reason.trim() || !userId || !commentId) {
      alert("Veuillez remplir tous les champs.");
      return;
    }

    const reportData = { reason, commentId, userId };

    try {
      const response = await fetch(
        "http://localhost:9000/api/v1/report/create",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(reportData),
        }
      );

      if (response.ok) {
        setUserId("");
        setReason("");
        setCommentId("");
        setIsModalToggle(false);
        fetchReports();
      } else {
        const errorMessage = await response.json();
        alert(
          `Erreur : ${
            errorMessage.msg || "Échec de la création du signalement."
          }`
        );
      }
    } catch (error) {
      alert("Une erreur est survenue lors de la soumission du signalement.");
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
        <h2>Créer un signalement</h2>
        <form onSubmit={submitReport}>
          <label htmlFor="reason">Raison</label>
          <textarea
            id="reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows="5"
          />
          <label htmlFor="userId">Utilisateur</label>
          <select value={userId} onChange={(e) => setUserId(e.target.value)}>
            <option value="">Sélectionnez</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.username}
              </option>
            ))}
          </select>
          <label htmlFor="commentId">Message</label>
          <select
            value={commentId}
            onChange={(e) => setCommentId(e.target.value)}
          >
            <option value="">Message</option>
            {comments.map((comment) => (
              <option key={comment.id} value={comment.id}>
                {comment.message}
              </option>
            ))}
          </select>
          <button className="submit-button" type="submit">
            Soumettre
          </button>
        </form>
      </aside>
    </div>
  );
}

Create.propTypes = {
  setIsModalToggle: PropTypes.func.isRequired,
  fetchReports: PropTypes.func.isRequired,
};

export default Create;
