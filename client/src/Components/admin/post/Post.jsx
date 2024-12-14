import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux"; // Import de useDispatch et useSelector
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { setMobile } from "../../../store/slicesRedux/view"; // Import de l'action setMobile
import CreateModal from "./Create";
import UpdateModal from "./Update";
import DeleteModal from "./Delete";
import { PostContext } from "../../../store/post/PostContext";

function Post() {
  const { isMobile } = useSelector((state) => state.view); // Utilisation de Redux pour accéder à isMobile
  const state = useContext(PostContext); // Si vous utilisez un contexte pour les posts
  const dispatch = useDispatch();
  const [isCreateModalToggle, setIsCreateModalToggle] = useState(false);
  const [isUpdateModalToggle, setIsUpdateModalToggle] = useState(false);
  const [isDeleteToggle, setIsDeleteToggle] = useState(false);
  const [currentPost, setCurrentPost] = useState(null);
  const [error, setError] = useState("");

  // Fetch des posts
  const fetchPosts = async () => {
    try {
      const response = await fetch("http://localhost:9000/api/v1/post/all", {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok)
        throw new Error("Erreur lors de la récupération des posts");

      const data = await response.json();
      state.setPostList(data);
    } catch (error) {
      console.error(error.message);
      setError(error.message);
    }
  };

  // Mise à jour de isMobile lors du redimensionnement de la fenêtre
  useEffect(() => {
    const handleResize = () => {
      dispatch(setMobile(window.innerWidth <= 768));
    };

    window.addEventListener("resize", handleResize);

    fetchPosts();
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [dispatch]);

  const handleDelete = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:9000/api/v1/post/remove/${id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (response.ok) {
        fetchPosts();
        setIsDeleteToggle(false);
      } else {
        throw new Error("Erreur lors de la suppression du post.");
      }
    } catch (error) {
      console.error("Erreur:", error);
      setError(error.message);
    }
  };

  const handleEditClick = (post) => {
    setCurrentPost(post);
    setIsUpdateModalToggle(true);
  };

  const handleDeleteClick = (post) => {
    setCurrentPost(post);
    setIsDeleteToggle(true);
  };

  return (
    <section>
      <h1>Liste des Articles</h1>
      {error && <p className="error-message">{error}</p>}
      <div className="container-list">
        <button
          className="btn-create"
          onClick={() => setIsCreateModalToggle(!isCreateModalToggle)}
        >
          <FaPlus />
          Ajouter un article
        </button>
      </div>

      {/* Affichage en mode mobile ou bureau */}
      {isMobile ? (
        <div className="cards-container">
          {state.posts.map((post) => (
            <div className="card" key={post.id}>
              <div className="card-header">
                <h3>{post.title}</h3>
                <p>
                  <strong>ID:</strong> {post.id}
                </p>
              </div>
              <div className="card-body">
                <p>
                  <strong>Catégorie:</strong> {post.label}
                </p>
                <p>
                  <strong>Auteur:</strong> {post.author}
                </p>
              </div>
              <div className="card-footer">
                <button
                  className="btn-edit"
                  onClick={() => handleEditClick(post)}
                >
                  <FaEdit />
                </button>
                <button
                  className="btn-delete"
                  onClick={() => handleDeleteClick(post)}
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Titre</th>
                <th>Catégorie</th>
                <th>Auteur</th>
                <th className="buttons">Actions</th>
              </tr>
            </thead>
            <tbody>
              {state.posts.map((post) => (
                <tr key={post.id}>
                  <td>{post.id}</td>
                  <td>{post.title}</td>
                  <td>{post.label}</td>
                  <td>{post.author}</td>
                  <td>
                    <div className="button-group">
                      <button
                        className="btn-edit"
                        onClick={() => handleEditClick(post)}
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="btn-delete"
                        onClick={() => handleDeleteClick(post)}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isCreateModalToggle && (
        <CreateModal
          setIsModalToggle={setIsCreateModalToggle}
          fetchPost={fetchPosts}
        />
      )}
      {isUpdateModalToggle && currentPost && (
        <UpdateModal
          setIsModalToggle={setIsUpdateModalToggle}
          fetchPost={fetchPosts}
          currentPost={currentPost}
        />
      )}
      {isDeleteToggle && currentPost && (
        <DeleteModal
          onConfirm={() => handleDelete(currentPost.id)}
          onClose={() => setIsDeleteToggle(false)}
        />
      )}
    </section>
  );
}

export default Post;
