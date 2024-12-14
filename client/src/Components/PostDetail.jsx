import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Comment from "./Partials/Comment";
import { useSelector } from "react-redux";

function PostDetail() {
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [message, setMessage] = useState("");
  const [loadingPost, setLoadingPost] = useState(true);
  const [loadingComments, setLoadingComments] = useState(true);
  const [error, setError] = useState(null);

  const { id } = useParams();
  const user = useSelector((state) => state.user);

  const fetchPost = async () => {
    try {
      const response = await fetch(`http://localhost:9000/api/v1/post/${id}`);
      if (!response.ok)
        throw new Error("Erreur lors de la récupération du post");
      const data = await response.json();
      setPost(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoadingPost(false);
    }
  };

  const fetchComments = async () => {
    try {
      // Étape 1 : Récupérer les commentaires depuis l'API
      const response = await fetch(
        `http://localhost:9000/api/v1/comment/${id}`
      );
      const datas = await response.json();

      // Étape 2 : Remplacer les avatars manquants
      datas.forEach((comment) => {
        if (!comment.avatar_label) {
          comment.avatar_label = "user.png"; // Définir un avatar par défaut
        }
      });

      // Étape 3 : Organiser les commentaires par parent/enfants
      const commentParent = datas.filter(
        (comment) => !comment.parent_id // On garde seulement les commentaires sans parent
      );

      commentParent.forEach((parentComment) => {
        parentComment.replies = datas.filter(
          (comment) => comment.parent_id === parentComment.id // Associer les réponses à chaque commentaire
        );
      });

      // Étape 4 : Mettre à jour l'état avec les commentaires organisés
      setComments(commentParent);
    } catch (error) {
      setError(error.message); // En cas d'erreur, on enregistre le message
    } finally {
      setLoadingComments(false); // On indique que le chargement est terminé
    }
  };

  //creation d'un commentaire
  const createComment = async (message, parentId = null) => {
    if (!message.trim() || !user.isLogged) {
      setError("Vous devez être connecté pour commenter.");
      return;
    }

    const data = {
      message,
      post_id: Number(id),
      parent_id: parentId,
      user_id: user.userId,
      username: user.username,
      avatarUrl: user.avatar,
    };

    try {
      const response = await fetch(
        `http://localhost:9000/api/v1/comment/create`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(data),
        }
      );

      const newComment = await response.json();

      const commentWithAvatar = {
        ...newComment,
        avatarUrl: newComment.avatarUrl || user.avatar || "user.png",
      };

      if (parentId) {
        // Ajouter comme réponse
        setComments((prevComments) =>
          prevComments.map((comment) =>
            comment.id === parentId
              ? { ...comment, replies: [...comment.replies, commentWithAvatar] }
              : comment
          )
        );
      } else {
        // Ajouter comme commentaire principal
        setComments((prev) => [...prev, commentWithAvatar]);
      }

      setMessage(""); // Réinitialiser le message
    } catch (error) {
      setError(error.message);
    }
  };

  //mise à jour d'un commentaire
  const updatedComment = async (updatedMessage, commentId, parentId) => {
    try {
      const commentData = {
        message: updatedMessage,
        status: "visible",
        parent_id: parentId || null,
        post_id: Number(id),
        user_id: user?.userId,
      };

      console.log("Data envoyé au backend :", commentData);

      const response = await fetch(
        `http://localhost:9000/api/v1/comment/update/${commentId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(commentData),
        }
      );

      if (response.ok) {
        const updatedCommentResponse = await response.json();

        console.log("Commentaire mis à jour :", updatedCommentResponse);

        // Met à jour l'état des commentaires
        setComments((prevComments) =>
          prevComments.map((comment) => {
            if (comment.id === commentId) {
              return { ...comment, message: updatedCommentResponse.message };
            }

            // Mise à jour des réponses imbriquées
            if (comment.replies && parentId) {
              const updatedReplies = comment.replies.map((reply) =>
                reply.id === commentId
                  ? { ...reply, message: updatedCommentResponse.message }
                  : reply
              );

              return { ...comment, replies: updatedReplies };
            }

            return comment;
          })
        );
      } else {
        console.error("La mise à jour a échoué.");
      }
    } catch (error) {
      console.error(
        "Erreur lors de la mise à jour du commentaire :",
        error.message
      );
      setError("Une erreur est survenue.");
    }
  };

  //suppression d'un commentaire
  const handleDeleteComment = async (id, parentId) => {
    try {
      const response = await fetch(
        `http://localhost:9000/api/v1/comment/remove/${id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      if (!response.ok) {
        throw new Error("Impossible de supprimer le commentaire.");
      }

      if (parentId) {
        // Suppression d'une réponse spécifique
        setComments((prevComments) =>
          prevComments.map((comment) =>
            comment.id === parentId
              ? {
                  ...comment,
                  replies: comment.replies.filter((reply) => reply.id !== id),
                }
              : comment
          )
        );
      } else {
        // Suppression d'un commentaire principal
        setComments((prevComments) =>
          prevComments.filter((comment) => comment.id !== id)
        );
      }

      // Optionnel : tu pourrais recharger les commentaires depuis le serveur
      await fetchComments();
    } catch (error) {
      console.error("Erreur:", error.message);
      setError("Une erreur est survenue.");
    }
  };

  useEffect(() => {
    fetchPost();
    fetchComments();
  }, [id, user.isLogged]);

  const submitHandler = async (e, parentId = null) => {
    e.preventDefault();
    if (message.trim()) {
      try {
        await createComment(message, parentId);

        setMessage("");
      } catch (error) {
        console.error("Erreur :", error);
      }
    }
  };

  //buttons repondre et modifier
  const handleReplySubmit = async (commentId, replyMessage) => {
    createComment(replyMessage, commentId); // Appel à createComment pour une réponse
  };

  const handleEditSubmit = async (commentId, editedMessage, parentId) => {
    updatedComment(editedMessage, commentId, parentId);
  };

  return (
    <section className="post-container-detail">
      {loadingPost ? (
        <p>Chargement du post...</p>
      ) : (
        <>
          {error && (
            <p className="error-message" aria-live="polite">
              {error}
            </p>
          )}
          <h1 className="post-title">{post.title}</h1>
          <div className="post-picture">
            <img
              src={`http://localhost:9000/images/${post.imageUrl}`}
              alt={post.title}
            />
          </div>
          <p className="post-description">
            <span>Description: </span>
            {post.description}
          </p>
          <p className="post-date">
            {new Date(post.publish_date).toLocaleString()}
          </p>
          <div className="post-categories">
            <span className="post-category">{post.categoryLabel}</span>
            <div className="user-info">
              <img
                className="avatar"
                src={`/icons/${post.avatarUrl}`}
                alt={post.username}
              />
              <span className="username">
                {post.username || "Unknown User"}
              </span>
            </div>
          </div>
          <hr />
          <aside>
            <h2>Commentaires</h2>
            {loadingComments ? (
              <p>Chargement des commentaires...</p>
            ) : (
              <>
                {comments.length === 0 ? (
                  <p>
                    Aucun commentaire disponible. Soyez le premier à commenter !
                  </p>
                ) : (
                  comments.map((comment) => (
                    <Comment
                      key={comment.id}
                      comment={comment}
                      onReplySubmit={handleReplySubmit}
                      onEditSubmit={handleEditSubmit}
                      onDelete={handleDeleteComment}
                      userId={user.userId}
                    />
                  ))
                )}
                {user.isLogged && (
                  <form onSubmit={submitHandler}>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Écrire un commentaire..."
                      required
                    />
                    <button type="submit" disabled={loadingComments}>
                      Ajouter un commentaire
                    </button>
                  </form>
                )}
              </>
            )}
          </aside>
        </>
      )}
    </section>
  );
}

export default PostDetail;
