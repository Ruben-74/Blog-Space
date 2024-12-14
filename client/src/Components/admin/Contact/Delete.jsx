import React from "react";
import PropTypes from "prop-types";
import { FaTimes } from "react-icons/fa";

function DeleteModal({ onConfirm, onClose }) {
  return (
    <div className="modal-overlay">
      <aside className="modal-form active">
        <button
          className="close-button"
          onClick={onClose}
          aria-label="Fermer la modal"
        >
          <FaTimes />
        </button>
        <h2>Confirmer la suppression</h2>
        <p>Êtes-vous sûr de vouloir supprimer ce message ?</p>
        <div className="modal-buttons">
          <button className="delete-button" onClick={onConfirm}>
            Oui, supprimer
          </button>
          <button className="btn-cancel" onClick={onClose}>
            Annuler
          </button>
        </div>
      </aside>
    </div>
  );
}

DeleteModal.propTypes = {
  onConfirm: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default DeleteModal;
