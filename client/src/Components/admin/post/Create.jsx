import React, { useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { FaTimes, FaUpload } from "react-icons/fa";
import { PostContext } from "../../../store/post/PostContext";

function Create({ setIsModalToggle, fetchPost }) {
  const state = useContext(PostContext);
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [userId, setUserId] = useState("");
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");

  const fetchCategories = async () => {
    try {
      const response = await fetch(
        "http://localhost:9000/api/v1/category/list"
      );
      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des catégories");
      }
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Erreur:", error);
      setError("Erreur lors de la récupération des catégories");
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
    fetchCategories();
    fetchUsers();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validExtensions = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
      ]; // Extensions d'image valides

      if (!validExtensions.includes(file.type)) {
        setError(
          "Veuillez télécharger un fichier image avec une extension valide (.jpg, .jpeg, .png, .gif, .webp)."
        );
        setImage(null);
        return;
      }

      if (file.size > 2 * 1024 * 1024) {
        setError("Le fichier doit faire moins de 2 Mo.");
        setImage(null);
        return;
      }

      setImage(file);
      setError(""); // Réinitialiser l'erreur si le fichier est valide
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) {
      setError("Veuillez sélectionner une image à télécharger.");
      return;
    }

    // Créer l'objet postData
    const postData = new FormData();
    postData.append("title", title);
    postData.append("description", description);
    postData.append("categoryId", categoryId);
    postData.append("userId", userId);
    postData.append("image", image);

    try {
      await state.createPost(postData);
      // Réinitialisez les états
      setTitle("");
      setDescription("");
      setCategoryId("");
      setImage(null);
      setIsModalToggle(false);
      fetchPost(); // Récupérer les posts mis à jour
    } catch (err) {
      console.error(err.message);

      if (err.message === "L'image existe déjà dans la base de données.") {
        setError(
          "Désolé, cette image existe déjà. Veuillez en choisir une autre."
        );
      } else {
        setError("Une erreur est survenue. Veuillez réessayer.");
      }
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
          <div className="back-button-container">
            <h2>Créer votre Post</h2>
          </div>
          {error && <p className="error-message">{error}</p>}
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
              <option value="">Sélectionner une catégorie</option>
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
              <option value="">Sélectionner un utilisateur</option>
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
              required // Assurez-vous qu'un fichier est requis
            />
          </label>
          {image && (
            <div className="image-preview">
              <img
                src={URL.createObjectURL(image)}
                alt="Aperçu de l'image"
                style={{ maxWidth: "200px" }}
              />
            </div>
          )}
          <button type="submit" className="submit-button">
            Poster
          </button>
        </form>
      </aside>
    </div>
  );
}

Create.propTypes = {
  setIsModalToggle: PropTypes.func.isRequired,
  fetchPost: PropTypes.func.isRequired,
};

export default Create;
