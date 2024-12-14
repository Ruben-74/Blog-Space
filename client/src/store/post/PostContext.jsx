import React, { createContext, useCallback, useState } from "react";

// Création du context
const PostContext = createContext();

// Fournisseur de context
const PostProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);

  // Fonction pour mettre à jour la liste des posts
  const setPostList = useCallback((data) => {
    setPosts(data);
  }, []);

  // Fonction pour créer un post
  const createPost = async (postData) => {
    try {
      const postResponse = await fetch(
        "http://localhost:9000/api/v1/post/create",
        {
          method: "POST",
          body: postData,
          credentials: "include",
        }
      );

      if (!postResponse.ok) {
        const errorMessage = await postResponse.text();
        throw new Error(errorMessage || "Erreur lors de la création du post");
      }

      const result = await postResponse.json();
      console.log("Post créé:", result);

      // Mettre à jour l'état local avec le nouveau post
      setPosts((prevPosts) => [...prevPosts, result]); // Ajouter le post créé

      return result;
    } catch (error) {
      console.error("Erreur lors de la création du post:", error.message);
      throw error;
    }
  };

  // Fonction pour mettre à jour un post
  const updatePost = async (postData) => {
    const postId = postData.get("id");
    try {
      const response = await fetch(
        `http://localhost:9000/api/v1/post/update/${postId}`,
        {
          method: "PATCH",
          credentials: "include",
          body: postData,
        }
      );

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(
          errorMessage || "Erreur lors de la mise à jour du post"
        );
      }

      const updatedPost = await response.json();
      console.log(updatedPost);
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === updatedPost.id ? updatedPost : post
        )
      );
    } catch (error) {
      console.error("Erreur lors de la mise à jour du post:", error.message);
    }
  };

  return (
    <PostContext.Provider
      value={{ posts, createPost, updatePost, setPostList }}
    >
      {children}
    </PostContext.Provider>
  );
};

export { PostProvider, PostContext };
