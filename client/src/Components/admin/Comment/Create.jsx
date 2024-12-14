import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { FaTimes } from "react-icons/fa";

function Create({ setIsModalToggle, fetchComment }) {
  const [message, setMessage] = useState("");
  const [userId, setUserId] = useState("");
  const [postId, setPostId] = useState("");
  const [status, setStatus] = useState("En attente");
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);

  // Récupérer les utilisateurs
  const fetchUsers = async () => {
    try {
      const response = await fetch("http://localhost:9000/api/v1/user/list");
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des utilisateurs :", error);
    }
  };

  // Récupérer les posts
  const fetchPosts = async () => {
    try {
      const response = await fetch("http://localhost:9000/api/v1/post/all");
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des posts :", error);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchPosts();
  }, []);

  // Soumettre le commentaire
  const submitComment = async (e) => {
    e.preventDefault();

    if (!message.trim() || !userId || !postId) {
      alert("Veuillez remplir tous les champs.");
      return;
    }

    const commentData = {
      message,
      status,
      post_id: postId,
      user_id: userId,
    };

    console.log("front", commentData);

    try {
      const response = await fetch(
        "http://localhost:9000/api/v1/comment/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(commentData),
        }
      );

      if (response.ok) {
        // Réinitialiser les champs après le succès
        setMessage("");
        setUserId("");
        setPostId("");
        setStatus("en attente");
        setIsModalToggle(false); // Fermer la modal
        fetchComment(); // Rafraîchir les commentaires
      } else {
        const errorMessage = await response.json();
        alert(
          `Erreur : ${
            errorMessage.msg || "Échec de la création du commentaire."
          }`
        );
        console.error("Échec de la création du commentaire :", errorMessage);
      }
    } catch (error) {
      console.error("Erreur lors de la création du commentaire :", error);
      alert("Une erreur est survenue lors de la soumission du commentaire.");
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
        <h2>Créer un commentaire (Admin)</h2>
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
          />

          <label htmlFor="userId">Utilisateur</label>
          <select
            name="userId"
            id="userId"
            required
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
          >
            <option value="">Sélectionnez un utilisateur</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.username}
              </option>
            ))}
          </select>

          <label htmlFor="postId">Post</label>
          <select
            name="postId"
            id="postId"
            required
            value={postId}
            onChange={(e) => setPostId(e.target.value)}
          >
            <option value="">Sélectionnez un post</option>
            {posts.map((post) => (
              <option key={post.id} value={post.id}>
                {post.title}
              </option>
            ))}
          </select>

          <label htmlFor="status">Statut</label>
          <select
            name="status"
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="en attente">En attente</option>
            <option value="validé">Validé</option>
          </select>

          <button className="submit-button" type="submit">
            Ajouter
          </button>
        </form>
      </aside>
    </div>
  );
}

Create.propTypes = {
  setIsModalToggle: PropTypes.func.isRequired,
  fetchComment: PropTypes.func.isRequired,
};

export default Create;
