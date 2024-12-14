import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { FaTimes } from "react-icons/fa";

function Update({ setIsModalToggle, fetchCategories, currentCategory }) {
  const [label, setLabel] = useState(currentCategory.label);
  const [isLoading, setIsLoading] = useState(false);

  // Utilise useEffect pour initialiser l'input avec la valeur de currentCategory

  async function submitCategory(e) {
    e.preventDefault();

    setIsLoading(true);

    const response = await fetch(
      `http://localhost:9000/api/v1/category/update/${currentCategory.id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ label }),
      }
    );

    if (response.ok) {
      setIsModalToggle(false);
      fetchCategories();
    }

    setIsLoading(false);
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
        <h1>Modifier une Catégorie</h1>
        <form onSubmit={submitCategory}>
          <label htmlFor="label">Nom de la catégorie :</label>
          <input
            type="text"
            name="label"
            id="label"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
          />
          <button className="submit-button" type="submit" disabled={isLoading}>
            {isLoading ? "Modification en cours..." : "Modifier"}
          </button>
        </form>
      </aside>
    </div>
  );
}

Update.propTypes = {
  setIsModalToggle: PropTypes.func.isRequired,
  fetchCategories: PropTypes.func.isRequired,
  currentCategory: PropTypes.shape({
    id: PropTypes.number.isRequired,
    label: PropTypes.string.isRequired,
  }).isRequired,
};

export default Update;
