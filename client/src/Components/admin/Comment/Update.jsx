import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { FaTimes } from "react-icons/fa";

function Update({ setIsModalToggle, fetchComment, currentComment }) {
  const [message, setMessage] = useState(currentComment?.message || "");
  const [userId, setUserId] = useState(currentComment?.user_id);
  const [postId, setPostId] = useState(currentComment?.post_id);
  const [status, setStatus] = useState(currentComment.status || "visible");
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

    const commentData = {
      message,
      status,
      post_id: postId,
      user_id: userId,
    };

    console.log("front", commentData);

    try {
      const response = await fetch(
        `http://localhost:9000/api/v1/comment/update/${currentComment.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(commentData),
        }
      );

      if (response.ok) {
        setIsModalToggle(false); // Fermer la modal
        fetchComment(); // Rafraîchir les commentaires
      } else {
        const errorMessage = await response.json();
        console.error(
          "Échec de la modification du commentaire :",
          errorMessage
        );
      }
    } catch (error) {
      console.error("Erreur lors de la modification du commentaire :", error);
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
        <h2>Modifier un commentaire (Admin)</h2>
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
            <option value="visible">Visible</option>
            <option value="hide">Caché</option>
          </select>

          <button className="submit-button" type="submit">
            Ajouter
          </button>
        </form>
      </aside>
    </div>
  );
}

Update.propTypes = {
  setIsModalToggle: PropTypes.func.isRequired,
  fetchComment: PropTypes.func.isRequired,
};

export default Update;
