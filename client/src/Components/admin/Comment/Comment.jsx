import { useEffect, useState } from "react";
import Loading from "../../Loading";
import { FaEdit, FaPlus, FaTrash } from "react-icons/fa";
import CreateModal from "../Comment/Create";
import UpdateModal from "../Comment/Update";
import DeleteModal from "../Comment/Delete";
import { useDispatch, useSelector } from "react-redux";
import { setMobile } from "../../../store/slicesRedux/view"; // Import de l'action setMobile

function User() {
  const [comments, setComments] = useState(null);
  const { isMobile } = useSelector((state) => state.view);
  const dispatch = useDispatch();
  const [isCreateModalToggle, setIsCreateModalToggle] = useState(false);
  const [isUpdateModalToggle, setIsUpdateModalToggle] = useState(false);
  const [isDeleteToggle, setIsDeleteToggle] = useState(false);
  const [currentComment, setCurrentComment] = useState(null);

  const fetchComment = async () => {
    const response = await fetch("http://localhost:9000/api/v1/comment/all", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    const data = await response.json();
    console.log("Commentaires récupérés :", data);
    setComments(data);
  };

  useEffect(() => {
    const handleResize = () => {
      dispatch(setMobile(window.innerWidth <= 768));
    };

    window.addEventListener("resize", handleResize);

    fetchComment();
    return () => window.removeEventListener("resize", handleResize);
  }, [dispatch]);

  async function onClickDeleteComment(id) {
    const response = await fetch(
      "http://localhost:9000/api/v1/comment/remove/" + id,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );
    if (response.ok) {
      fetchComment();
      setIsDeleteToggle(false); // Fermer la modal après suppression
    }
  }

  const handleEditClick = (comment) => {
    setCurrentComment(comment);
    setIsUpdateModalToggle(true);
  };

  const handleDeleteClick = (comment) => {
    setCurrentComment(comment);
    setIsDeleteToggle(true); // Ouvrir la modal de confirmation
  };

  if (!comments) return <Loading />;

  return (
    <section>
      <h1>Liste des commentaires</h1>
      <div className="container-list">
        <button
          className="btn-create"
          onClick={() => setIsCreateModalToggle(!isCreateModalToggle)}
        >
          <FaPlus />
          Ajouter un commentaire
        </button>
      </div>

      {isMobile ? (
        <div className="cards-container">
          {comments.map((comment) => (
            <div className="card" key={comment.id}>
              <div className="card-header">
                <h3>{comment.title}</h3>
                <p>
                  <strong>ID:</strong> {comment.id}
                </p>
              </div>
              <div className="card-body">
                <p>
                  <strong>Message:</strong> {comment.message}
                </p>
                <p>
                  <strong>Créateur:</strong> {comment.username}
                </p>
                <p>
                  <strong>Date de Publication : </strong>
                  {new Date(comment.created_at).toLocaleString()}
                </p>

                <span className={`status-badge ${comment.status}`}>
                  <strong>Status: </strong>
                  {comment.status}
                </span>
              </div>
              <div className="card-footer">
                <button
                  className="btn-edit"
                  onClick={() => handleEditClick(comment)}
                >
                  <FaEdit />
                </button>
                <button
                  className="btn-delete"
                  onClick={() => handleDeleteClick(comment)}
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
              <th>Message</th>
              <th>Date de publication</th>
              <th>Status</th>
              <th>Article</th>
              <th>Créateur</th>
              <th className="buttons">Actions</th>
            </tr>
          </thead>
          <tbody>
            {comments.map((comment) => (
              <tr key={comment.id}>
                <td>{comment.id}</td>
                <td>{comment.message}</td>
                <td>{new Date(comment.created_at).toLocaleString()}</td>
                <td>{comment.status}</td>
                <td>{comment.title}</td>
                <td>{comment.username}</td>
                <td>
                  <div className="button-group">
                    <button
                      className="btn-edit"
                      onClick={() => handleEditClick(comment)}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => handleDeleteClick(comment)}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {isCreateModalToggle && (
        <CreateModal
          setIsModalToggle={setIsCreateModalToggle}
          fetchComment={fetchComment}
        />
      )}

      {isUpdateModalToggle && currentComment && (
        <UpdateModal
          setIsModalToggle={setIsUpdateModalToggle}
          fetchComment={fetchComment}
          currentComment={currentComment}
        />
      )}

      {isDeleteToggle && currentComment && (
        <DeleteModal
          onConfirm={() => onClickDeleteComment(currentComment.id)}
          onClose={() => setIsDeleteToggle(false)}
        />
      )}
    </section>
  );
}

export default User;
