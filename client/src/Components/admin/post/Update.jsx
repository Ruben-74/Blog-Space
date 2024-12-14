import React, { useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { FaTimes, FaUpload } from "react-icons/fa";
import { PostContext } from "../../../store/post/PostContext";

function Update({ setIsModalToggle, fetchPost, currentPost }) {
  const state = useContext(PostContext);

  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);

  const [categoryId, setCategoryId] = useState("");
  const [userId, setUserId] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");

  const fetchCategories = async () => {
    try {
      const response = await fetch(
        "http://localhost:9000/api/v1/category/list"
      );
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des catégories :", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch("http://localhost:9000/api/v1/user/list");
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des utilisateurs :", error);
    }
  };

  useEffect(() => {
    if (currentPost) {
      setTitle(currentPost.title || "");
      setDescription(currentPost.description || "");
      setCategoryId(currentPost.categoryId || "");
      setUserId(currentPost.userId || "");
    }
    fetchCategories();
    fetchUsers();
  }, [currentPost]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setError("Veuillez télécharger un fichier image valide.");
        setImage(null);
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        setError("Le fichier doit faire moins de 2 Mo.");
        setImage(null);
        return;
      }
      setImage(file);
      setError(""); // Reset error if the file is valid
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const postData = new FormData();
    postData.append("id", currentPost.id);
    postData.append("title", title);
    postData.append("description", description);
    postData.append("categoryId", categoryId);
    postData.append("userId", userId);
    if (image) {
      postData.append("image", image);
    }

    try {
      console.log("Objet postData:", postData);
      await state.updatePost(postData);
      console.error("Mise a jour");
      setIsModalToggle(false);
      fetchPost();
    } catch (err) {
      console.error("Erreur lors de la mise à jour du post:", err);
      setError("Erreur lors de la mise à jour du post. Veuillez réessayer.");
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
        <form onSubmit={handleSubmit} className="create-post-form">
          <h2>Modifier votre Post</h2>
          <label>
            Titre:
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </label>
          <label>
            Description:
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </label>
          <label>
            Catégorie:
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              required
            >
              {categories.length > 0 ? (
                categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.label}
                  </option>
                ))
              ) : (
                <option value="" disabled>
                  Aucune catégorie disponible
                </option>
              )}
            </select>
          </label>
          <label>
            Utilisateur:
            <select
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              required
            >
              {users.length > 0 ? (
                users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.username}
                  </option>
                ))
              ) : (
                <option value="" disabled>
                  Aucun utilisateur disponible
                </option>
              )}
            </select>
          </label>
          <label className="file-upload-label">
            <span className="upload-button">
              <FaUpload /> Téléchargez l'image
            </span>
            <input
              type="file"
              className="file-input"
              onChange={handleImageChange}
            />
          </label>
          {image ? (
            <div className="image-preview">
              <img
                src={URL.createObjectURL(image)}
                alt="Aperçu de l'image"
                style={{ maxWidth: "200px" }}
              />
            </div>
          ) : (
            currentPost.image && (
              <div className="image-preview">
                <img
                  src={`http://localhost:9000/images/${currentPost.image.url}`} // Assurez-vous que l'URL est correcte ici
                  alt="Image existante"
                  style={{ maxWidth: "200px" }}
                />
              </div>
            )
          )}

          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="submit-button">
            Mettre à jour
          </button>
        </form>
      </aside>
    </div>
  );
}

Update.propTypes = {
  setIsModalToggle: PropTypes.func.isRequired,
  fetchPost: PropTypes.func.isRequired,
  currentPost: PropTypes.object.isRequired,
};

export default Update;
