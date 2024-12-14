import React, { useState } from "react";
import { FaSpaceShuttle } from "react-icons/fa";

function Contact() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState(""); // État pour le message de succès

  async function submitHandler(e) {
    e.preventDefault();

    if (!username.trim()) {
      setError("Le nom d'utilisateur ne peut pas être vide.");
      return;
    }
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      setError("Veuillez entrer un email valide.");
      return;
    }
    if (!content.trim()) {
      setError("Le contenu ne peut pas être vide.");
      return;
    }

    const response = await fetch(
      "http://localhost:9000/api/v1/contact/create",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          username,
          email,
          content,
        }),
      }
    );

    if (response.ok) {
      setUsername("");
      setEmail("");
      setContent("");
      setError("");
      setSuccessMessage("Votre message a été envoyé avec succès !"); // Message de succès
    } else {
      const text = await response.text();
      console.error(text);
      try {
        const errorData = JSON.parse(text);
        setError(errorData.message || "Une erreur est survenue.");
        setSuccessMessage(""); // Réinitialiser le message de succès en cas d'erreur
      } catch (err) {
        setError("Une erreur est survenue, veuillez réessayer.");
        setSuccessMessage(""); // Réinitialiser le message de succès en cas d'erreur
      }
    }
  }

  return (
    <section className="form-container">
      <FaSpaceShuttle size={50} style={{ transform: "rotate(-90deg)" }} />
      <hr />
      <h1>Contact Us ?</h1>
      <div className="info-line">
        <p>Have you a problem?</p>
      </div>
      {error && <div className="error-message">{error}</div>}{" "}
      {/* Afficher les erreurs */}
      {successMessage && (
        <div className="success-message">{successMessage}</div>
      )}{" "}
      {/* Afficher le message de succès */}
      <form onSubmit={submitHandler}>
        <label htmlFor="username">Username</label>
        <input
          type="text"
          name="username"
          id="username"
          required
          autoComplete="username"
          tabIndex="1"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <label htmlFor="email">Email</label>
        <input
          type="email"
          name="email"
          id="email"
          required
          autoComplete="email"
          tabIndex="2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label htmlFor="content">Content</label>
        <textarea
          name="content"
          id="content"
          required
          autoComplete="content"
          tabIndex="3"
          rows="5"
          style={{ resize: "vertical" }}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <button type="submit">Envoyer</button>
      </form>
    </section>
  );
}

export default Contact;
