import React, { useState, useEffect } from "react";
import useCloseMenu from "../Hook/useCloseMenu";
import Card from "./Partials/Card";
import SearchBar from "./Partials/SearchBar";
import Loading from "./Loading"; // Assurez-vous que le loader est importé ici

function Aero() {
  useCloseMenu();
  const [posts, setPosts] = useState([]); // État pour stocker tous les posts
  const [filteredPosts, setFilteredPosts] = useState([]); // État pour stocker les posts filtrés
  const [loading, setLoading] = useState(true); // Commence par un état de chargement
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true); // Démarre le chargement

      try {
        const response = await fetch("http://localhost:9000/api/v1/post/aero", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des posts.");
        }

        const data = await response.json();
        setPosts(data); // Met à jour tous les posts
        setFilteredPosts(data); // Initialise les posts filtrés avec tous les posts
      } catch (error) {
        console.error("Erreur de récupération:", error);
        setError(error.message);
      } finally {
        setLoading(false); // Fin du chargement
      }
    };

    fetchPosts();
  }, []); // Exécute seulement lors du premier rendu

  return (
    <section className="posts-container">
      <h1 className="title-container">
        <span>A</span>eronautique
      </h1>
      {loading && <Loading />} {/* Affiche le loader */}
      {error && <p className="error-message">{error}</p>}
      {!loading && !error && filteredPosts.length === 0 && (
        <p>Aucun article disponible pour le moment.</p>
      )}
      {!loading && !error && filteredPosts.length > 0 && (
        <>
          <p>
            {filteredPosts.length}{" "}
            {filteredPosts.length > 1 ? "articles" : "article"} trouvé(s).
          </p>
          {filteredPosts.map((post) => (
            <Card key={post.id} post={post} />
          ))}
        </>
      )}
    </section>
  );
}

export default Aero;
