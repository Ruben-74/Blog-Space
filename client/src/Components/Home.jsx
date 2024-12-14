import React, { useState, useEffect } from "react";
import useCloseMenu from "../Hook/useCloseMenu";
import Card from "./Partials/Card";
import SearchBar from "./Partials/SearchBar";
import Loading from "./Loading"; // Assurez-vous que le loader est importé ici

function Home() {
  useCloseMenu();
  const [posts, setPosts] = useState([]); // État pour stocker les posts
  const [loading, setLoading] = useState(true); // Commence par un état de chargement
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);

      try {
        const response = await fetch("http://localhost:9000/api/v1/post/all", {
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
        setPosts(data); // Met à jour les posts avec les données récupérées
      } catch (error) {
        console.error("Erreur de récupération:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []); // Assure-toi que l'appel API ne se fait qu'une seule fois

  return (
    <section className="posts-container">
      <SearchBar
        setPosts={setPosts}
        setLoading={setLoading}
        setError={setError}
      />
      {loading && <Loading />} {/* Affiche le loader */}
      {/* Affiche les messages d'erreur ou le contenu des posts */}
      {error && <p className="error-message">{error}</p>}
      {!loading && !error && posts.length === 0 && (
        <p>Aucun article disponible pour le moment.</p>
      )}
      {!loading && !error && posts.length > 0 && (
        <>
          <p>
            {posts.length} {posts.length > 1 ? "articles" : "article"}{" "}
            trouvé(s).
          </p>
          {posts.map((post) => (
            <Card key={post.id} post={post} />
          ))}
        </>
      )}
      {/* Message de chargement, en cas de rechargement */}
      {loading && !error && (
        <p className="loading-message">Chargement des articles...</p>
      )}
    </section>
  );
}

export default Home;
