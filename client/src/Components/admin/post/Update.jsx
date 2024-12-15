import React, { useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { FaTimes, FaUpload } from "react-icons/fa";
import { PostContext } from "../../../store/post/PostContext";

function Update({ setIsModalToggle, fetchPost, currentPost }) {
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);
  const state = useContext(PostContext);
  const [title, setTitle] = useState(currentPost?.title);
  const [description, setDescription] = useState(currentPost?.description);
  const [categoryId, setCategoryId] = useState(currentPost?.categoryId || 2);
  const [userId, setUserId] = useState(currentPost?.userId);
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");

  const fetchCategories = async () => {
    try {
      const response = await fetch(
        "http://localhost:9000/api/v1/category/list"
      );
      const data = await response.json();
      setCategories(data);
    } catch (err) {
      console.error(
        "Erreur lors de la récupération des catégories :",
        err.message
      );
      setError("Impossible de récupérer les catégories.");
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch("http://localhost:9000/api/v1/user/list");
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      console.error(
        "Erreur lors de la récupération des utilisateurs :",
        err.message
      );
      setError("Impossible de récupérer les utilisateurs.");
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchUsers();
  }, []);

  // 📁 Validation des fichiers image
  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      if (!file.type.startsWith("image/")) {
        setError("Veuillez sélectionner un fichier image valide.");
        setImage(null);
        return;
      }

      if (file.size > 2 * 1024 * 1024) {
        setError("L'image doit être inférieure à 2 Mo.");
        setImage(null);
        return;
      }

      if (image && image.preview) {
        URL.revokeObjectURL(image.preview);
      }

      const previewURL = URL.createObjectURL(file);
      file.preview = previewURL;

      setImage(file);
      setError("");
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentPost?.id) {
      setError("L'ID du post est introuvable.");
      return;
    }

    if (!title || !description || !categoryId || !userId) {
      setError("Tous les champs doivent être remplis.");
      return;
    }

    const postData = new FormData();
    postData.append("title", title);
    postData.append("description", description);
    postData.append("categoryId", categoryId);
    postData.append("userId", userId);

    if (image) {
      postData.append("image", image); // Upload de l'image
    }

    try {
      await state.updatePost(postData, currentPost.id);
      // Réinitialisez les états
      setTitle("");
      setDescription("");
      setCategoryId("");
      setImage(null);
      setIsModalToggle(false);
      fetchPost(); // Récupérer les posts mis à jour
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <div className="modal-overlay">
      <aside className="modal-form active">
        <button
          className="close-button"
          onClick={() => setIsModalToggle(false)}
        >
          <FaTimes />
        </button>

        <form onSubmit={handleSubmit} className="create-post-form">
          <h2>Modifier votre Post</h2>

          {/* 📝 Titre */}
          <label>
            Titre :
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Titre du post"
              required
            />
          </label>

          {/* 📝 Description */}
          <label>
            Description :
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Votre description"
              required
            />
          </label>

          {/* 🔄 Catégorie */}
          <label>
            Catégorie :
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              required
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.label}
                </option>
              ))}
            </select>
          </label>

          {/* 👤 Utilisateur */}
          <label>
            Utilisateur :
            <select
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              required
            >
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.username}
                </option>
              ))}
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
              {/* Affiche l'aperçu de l'image locale */}
              <img
                src={image.preview}
                alt="Aperçu"
                style={{ maxWidth: "200px" }}
              />
            </div>
          ) : currentPost.image ? (
            <div className="image-preview">
              {/* Affiche l'image existante provenant du serveur */}
              <img
                src={`http://localhost:9000/images/${currentPost.image.url}`}
                alt={currentPost.image.alt_img}
                style={{ maxWidth: "200px" }}
              />
            </div>
          ) : (
            <p>Aucune image disponible</p>
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
