import React, { useState, useEffect } from "react";
import useCloseMenu from "../Hook/useCloseMenu";
import Card from "./Partials/Card";
import SearchBar from "./Partials/SearchBar";
import Loading from "./Loading"; // Assurez-vous que le loader est importé ici

function Automobile() {
  useCloseMenu();
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          "http://localhost:9000/api/v1/post/automobile",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des posts.");
        }
        const data = await response.json();
        setPosts(data);
        setFilteredPosts(data);
      } catch (error) {
        console.error("Erreur de récupération:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  return (
    <section className="posts-container">
      <h1 className="title-container">
        <span>A</span>utomobile
      </h1>

      {loading && <Loading />}
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

export default Automobile;
