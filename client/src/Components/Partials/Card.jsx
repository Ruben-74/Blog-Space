import React from "react";
import { Link } from "react-router-dom";

function Card({ post }) {
  if (!post) return null; // Vérifie si le post existe

  return (
    <article className="post-card">
      <div className="post-image">
        <img
          src={`http://localhost:9000/images/${post.url}`}
          alt={`Image for the post titled "${post.title}"`}
          loading="lazy"
        />
      </div>
      <div className="post-content">
        <h2 className="post-title">{post.title}</h2>
        <p className="post-description">{post.description}</p>
        <div className="post-categories">
          <span>{post.label}</span>
        </div>
        <div className="post-author-info">
          <img
            src={`/icons/${post.avatar}`} // Assurez-vous que l'URL de l'avatar est correcte
            alt={`${post.username}'s avatar`}
            className="author-avatar"
          />
          <p>
            par <span className="author">{post.author || "Unknown"}</span> le{" "}
            {new Date(post.publish_date).toLocaleString()}
          </p>
        </div>
        <Link
          to={`/post/${post.id}`}
          className="read-more-button"
          aria-label={`Lire la suite de ${post.title}`}
        >
          En savoir plus
        </Link>
      </div>
    </article>
  );
}

export default Card;
