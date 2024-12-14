import { useEffect, useState } from "react";
import Loading from "../../Loading";
import { FaEdit, FaPlus, FaTrash } from "react-icons/fa";
import CreateModal from "../User/Create";
import UpdateModal from "../User/Update";
import DeleteModal from "../User/Delete";
import { useDispatch, useSelector } from "react-redux";
import { setMobile } from "../../../store/slicesRedux/view"; // Import de l'action setMobile

function User() {
  const [users, setUsers] = useState([]);
  const { isMobile } = useSelector((state) => state.view);
  const dispatch = useDispatch();
  const [isCreateModalToggle, setIsCreateModalToggle] = useState(false);
  const [isUpdateModalToggle, setIsUpdateModalToggle] = useState(false);
  const [isDeleteToggle, setIsDeleteToggle] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:9000/api/v1/user/list", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch users: " + response.statusText);
      }

      const data = await response.json();
      setUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(); // Appeler la fonction pour récupérer les utilisateurs au démarrage
    const handleResize = () => {
      dispatch(setMobile(window.innerWidth <= 768));
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [dispatch]);

  const handleToggleActive = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:9000/api/v1/user/toggle/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error(
          "Erreur lors du changement de statut de l'utilisateur."
        );
      }

      fetchUsers(); // Reload user list after toggling status
    } catch (error) {
      console.error("Error toggling user status:", error);
      setError("Erreur lors de la mise à jour du statut.");
    }
  };

  const handleEditClick = (user) => {
    setCurrentUser(user);
    setIsUpdateModalToggle(true);
  };

  const handleDeleteClick = (user) => {
    setCurrentUser(user);
    setIsDeleteToggle(true);
  };

  const onClickDeleteUser = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:9000/api/v1/user/remove/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete user.");
      }

      fetchUsers();
      setIsDeleteToggle(false); // Close the modal after deletion
    } catch (error) {
      console.error("Error deleting user:", error);
      setError("Erreur lors de la suppression de l'utilisateur.");
    }
  };

  if (loading) return <Loading />;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <section>
      <h1 className="title-content">Listes des Utilisateurs</h1>

      <div className="container-list">
        <button
          className="btn-create"
          onClick={() => setIsCreateModalToggle(!isCreateModalToggle)}
        >
          <FaPlus />
          Ajouter un utilisateur
        </button>
      </div>

      {isMobile ? (
        <div className="cards-container">
          {/* Affichage sous forme de cartes pour mobile */}
          {users.map((user) => (
            <div className="card" key={user.id}>
              <div className="card-header">
                <div className="user-info">
                  <h3>{user.username}</h3>
                  <p className="user-id">
                    <strong>ID:</strong> {user.id}
                  </p>
                </div>

                <img
                  src={`/icons/${user.avatar_label || "user.png"}`}
                  alt={`Avatar de ${user.username}`}
                  className="user-avatar"
                />
              </div>

              <div className="card-body">
                <p>
                  <strong>Email: </strong>
                  {user.email}
                </p>
                <p>
                  <strong>Role: </strong>
                  {user.role}
                </p>

                <button
                  className={`btn-toggle-status ${
                    user.is_active ? "active" : "inactive"
                  }`}
                  onClick={() => handleToggleActive(user.id)}
                >
                  {user.is_active === 1 ? "Activer" : "Désactiver"}
                </button>
              </div>
              <div className="card-footer">
                <button
                  className="btn-edit"
                  onClick={() => handleEditClick(user)}
                >
                  <FaEdit />
                </button>
                <button
                  className="btn-delete"
                  onClick={() => handleDeleteClick(user)}
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Id</th>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              <th>Avatar</th>
              <th className="status">Status</th>
              <th className="buttons">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>
                    <img
                      src={`/icons/${user.avatar_label || "user.png"}`}
                      alt={`Avatar de ${user.username}`}
                    />
                  </td>
                  <td className="status">
                    <button
                      className={`btn-toggle-status ${
                        user.is_active ? "active" : "inactive"
                      }`}
                      onClick={() => handleToggleActive(user.id)}
                    >
                      {user.is_active ? "Désactiver" : "Activer"}
                    </button>
                  </td>
                  <td className="buttons">
                    <div className="button-group">
                      <button
                        className="btn-edit"
                        onClick={() => handleEditClick(user)}
                        title="Modifier l'utilisateur"
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="btn-delete"
                        onClick={() => handleDeleteClick(user)}
                        title="Supprimer l'utilisateur"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7">Aucun utilisateur trouvé.</td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      {isCreateModalToggle && (
        <CreateModal
          setIsModalToggle={setIsCreateModalToggle}
          fetchUsers={fetchUsers}
        />
      )}

      {isUpdateModalToggle && currentUser && (
        <UpdateModal
          setIsModalToggle={setIsUpdateModalToggle}
          fetchUsers={fetchUsers}
          currentUser={currentUser}
        />
      )}

      {isDeleteToggle && currentUser && (
        <DeleteModal
          onConfirm={() => onClickDeleteUser(currentUser.id)}
          onClose={() => setIsDeleteToggle(false)}
        />
      )}
    </section>
  );
}

export default User;
