import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { FaTimes } from "react-icons/fa";

function Create({ setIsModalToggle, fetchUsers }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatars, setAvatars] = useState([]);
  const [role, setRole] = useState("");
  const [error, setError] = useState("");
  const [avatarId, setAvatarId] = useState("");

  useEffect(() => {
    const fetchAvatars = async () => {
      try {
        const response = await fetch("http://localhost:9000/api/v1/avatar/all");
        if (!response.ok) {
          throw new Error("Failed to fetch avatars");
        }
        const data = await response.json();
        setAvatars(data);
      } catch (err) {
        console.error("Failed to fetch avatars:", err);
        setError("Erreur de chargement des avatars.");
      }
    };

    fetchAvatars();
  }, []);

  async function submitUser(e) {
    e.preventDefault();

    if (!username.trim()) {
      setError("Le nom d'utilisateur ne peut pas être vide.");
      return;
    }
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      setError("Veuillez entrer un email valide.");
      return;
    }
    if (!password.trim()) {
      setError("Le mot de passe ne peut pas être vide.");
      return;
    }

    const response = await fetch("http://localhost:9000/api/v1/user/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        username,
        email,
        password,
        role,
        avatarId,
      }),
    });

    if (response.ok) {
      setUsername("");
      setEmail("");
      setPassword("");
      setRole("");
      setAvatarId(""); // Réinitialiser l'avatarId
      setAvatars([]);
      setIsModalToggle(false);
      fetchUsers();
    } else {
      const errorData = await response.json();
      setError(errorData.message || "Une erreur est survenue.");
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
        <h2>Créer un utilisateur</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={submitUser}>
          <label htmlFor="username">Username :</label>
          <input
            type="text"
            name="username"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <label htmlFor="email">Email :</label>
          <input
            type="text"
            name="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label htmlFor="password">Password :</label>
          <input
            type="password"
            name="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <label htmlFor="password">Role :</label>
          <select
            name="role"
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="admin">Admin</option>
            <option value="user">User</option>
          </select>

          <label htmlFor="avatarId">Avatar :</label>
          <select
            name="avatarId"
            id="avatarId"
            value={avatarId}
            onChange={(e) => setAvatarId(e.target.value)}
          >
            <option value="">Sélectionnez un avatar</option>
            {avatars.map((avatar) => (
              <option key={avatar.id} value={avatar.id}>
                {avatar.label}
              </option>
            ))}
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
  fetchUsers: PropTypes.func.isRequired,
};

export default Create;
