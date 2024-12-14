import React, { useState, useEffect } from "react";

const SearchBar = ({ setPosts, setLoading, setError }) => {
  const [query, setQuery] = useState("");

  useEffect(() => {
    // Débouncing pour éviter des appels API trop fréquents
    const handler = setTimeout(() => {
      if (query) {
        setLoading(true); // Active le loader avant de chercher
        setError(""); // Réinitialise les erreurs avant une nouvelle recherche
        fetchPosts(query); // Recherche les posts basés sur la query
      } else {
        // Si la query est vide, affiche tous les posts
        fetchAllPosts();
      }
    }, 300); // Délai de 300ms pour éviter des requêtes trop fréquentes

    return () => {
      clearTimeout(handler); // Nettoie le timeout si la query change avant 300ms
    };
  }, [query, setLoading, setError]);

  const fetchPosts = async (query) => {
    try {
      const response = await fetch(
        `http://localhost:9000/api/v1/post/search/${query}`
      );

      if (!response.ok) {
        throw new Error("Erreur lors de la recherche des posts.");
      }

      const data = await response.json();
      setPosts(data); // Met à jour les posts avec les résultats de la recherche
    } catch (error) {
      console.error("Erreur:", error);
      setError(error.message); // Affiche l'erreur dans le state
    } finally {
      setLoading(false); // Désactive le loader une fois la recherche terminée
    }
  };

  const fetchAllPosts = async () => {
    setLoading(true); // Démarre le chargement des posts
    setError(""); // Réinitialise les erreurs au début de la récupération
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
      setPosts(data); // Met à jour tous les posts
    } catch (error) {
      console.error("Erreur de récupération:", error);
      setError(error.message); // Met à jour l'erreur ici
    } finally {
      setLoading(false); // Fin du chargement
    }
  };

  return (
    <form onSubmit={(e) => e.preventDefault()} className="search-bar">
      <input
        type="text"
        placeholder="Rechercher des articles..."
        value={query}
        onChange={(e) => setQuery(e.target.value)} // Met à jour la query au changement de texte
      />
      <button type="submit">Rechercher</button>
    </form>
  );
};

export default SearchBar;
