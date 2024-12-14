import { useState } from "react";
import PropTypes from "prop-types";
import { FaTimes } from "react-icons/fa";

function Create({ setIsModalToggle, fetchCategories }) {
  const [label, setLabel] = useState("");
  const [error, setError] = useState("");

  async function submitCategory(e) {
    e.preventDefault();

    if (!label.trim()) {
      setError("Le nom de la catégorie ne peut pas être vide.");
      return;
    }

    const response = await fetch(
      "http://localhost:9000/api/v1/category/create",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        credentials: "include",
        body: JSON.stringify({
          label,
        }),
      }
    );
    if (response.ok) {
      setLabel("");
      setIsModalToggle(false);
      fetchCategories();
    }
  }
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
        <h1>Créer une Catégorie</h1>
        {error && <p className="error-message">{error}</p>}{" "}
        {/* Afficher le message d'erreur */}
        <form onSubmit={submitCategory}>
          <label htmlFor="label">Nom de la catégorie :</label>
          <input
            type="text"
            name="label"
            id="label"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
          />
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
  fetchCategories: PropTypes.func.isRequired,
};

export default Create;
