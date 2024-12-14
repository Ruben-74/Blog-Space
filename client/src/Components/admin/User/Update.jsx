import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { FaTimes } from "react-icons/fa";

function Update({ setIsModalToggle, fetchUsers, currentUser }) {
  const [username, setUsername] = useState(currentUser.username);
  const [email, setEmail] = useState(currentUser.email);
  const [password, setPassword] = useState("");
  const [avatarId, setAvatarId] = useState(currentUser.avatar_id);
  const [role, setRole] = useState(currentUser.role);
  const [avatars, setAvatars] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchAvatars = async () => {
    try {
      const response = await fetch("http://localhost:9000/api/v1/avatar/all");
      if (!response.ok) throw new Error("Failed to fetch avatars");
      const data = await response.json();
      setAvatars(data);
    } catch (err) {
      console.error("Failed to fetch avatars:", err);
      setError("Erreur de chargement des avatars.");
    }
  };

  useEffect(() => {
    fetchAvatars();
  }, []);

  async function submitUpdate(e) {
    e.preventDefault();
    setError("");

    // Input validation
    if (!username.trim()) {
      setError("Le nom d'utilisateur ne peut pas être vide.");
      return;
    }
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      setError("Veuillez entrer un email valide.");
      return;
    }
    if (password && password.length < 6) {
      setError("Le mot de passe doit comporter au moins 6 caractères.");
      return;
    }

    setLoading(true);
    try {
      const data = {
        id: currentUser.id,
        username,
        email,
        password,
        role,
        avatar_id: avatarId,
      };
      const response = await fetch(
        `http://localhost:9000/api/v1/user/update/${currentUser.id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || "Une erreur est survenue.");
      } else {
        fetchUsers();
        setIsModalToggle(false);
      }
    } catch {
      setError("Une erreur réseau est survenue. Veuillez réessayer.");
    } finally {
      setLoading(false);
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
        <h2>Modifier un utilisateur</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={submitUpdate}>
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
            type="email"
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

          <label htmlFor="role">Role : </label>
          <select
            name="role"
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
          <label htmlFor="avatarId">Avatar :</label>
          <select
            name="avatarId"
            id="avatarId"
            value={avatarId}
            onChange={(e) => setAvatarId(e.target.value)}
          >
            {avatars.map((avatar) => (
              <option key={avatar.id} value={avatar.id}>
                {avatar.label}
              </option>
            ))}
          </select>
          <button className="submit-button" type="submit" disabled={loading}>
            {loading ? "Mise à jour en cours..." : "Mettre à jour"}
          </button>
        </form>
      </aside>
    </div>
  );
}

Update.propTypes = {
  setIsModalToggle: PropTypes.func.isRequired,
  fetchUsers: PropTypes.func.isRequired,
  currentUser: PropTypes.object.isRequired,
};

export default Update;
