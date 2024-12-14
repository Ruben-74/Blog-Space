import Comment from "../model/Comment.js";
import User from "../model/User.js";

const getAll = async (req, res) => {
  try {
    const [comments] = await Comment.findAll();

    res.status(200).json(comments);
  } catch (err) {
    res.status(500, { msg: err.message });
  }
};

// Permet d'afficher un
const findAllFromID = async (req, res) => {
  const postId = req.params.id;

  try {
    const comments = await Comment.findAllFromPostId(postId);

    res.status(200).json(comments); // Renvoie les commentaires au client
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ msg: "Failed to fetch comments." });
  }
};

// Creation d'un commentaire
const create = async (req, res) => {
  try {
    const { message, post_id, parent_id } = req.body;
    const user_id = req.session.user ? req.session.user.id : null;

    console.log("ddd", req.body);

    if (!message || !post_id || !user_id) {
      return res.status(400).json({ msg: "Champs obligatoires manquants." });
    }

    const userWithAvatar = await User.findUserWithAvatar(user_id);

    if (!userWithAvatar || !userWithAvatar.avatar) {
      return res
        .status(400)
        .json({ msg: "Utilisateur ou avatar introuvable." });
    }

    const result = await Comment.create({
      message,
      post_id,
      parent_id: parent_id || null, // Si `parent_id` est null, c'est un commentaire principal
      user_id,
      username: userWithAvatar.username,
      avatar_label: userWithAvatar.avatar || "user.png",
    });

    if (!result || !result.id) {
      return res
        .status(500)
        .json({ msg: "Impossible de créer le commentaire." });
    }

    res.status(201).json(result);
  } catch (err) {
    console.error("Erreur de création du commentaire :", err.message);
    res.status(500).json({ msg: "Erreur serveur." });
  }
};

// Mise à jour du commentaire
const update = async (req, res) => {
  try {
    const commentId = req.params.id;
    const { message, status, parent_id, post_id } = req.body;
    const user_id = req.session.user ? req.session.user.id : null;

    console.log("Requête body :", req.body);

    // Récupère le commentaire existant pour vérifier s'il existe
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ msg: "Commentaire introuvable." });
    }

    // Prépare les nouvelles valeurs pour la mise à jour
    const data = {
      id: commentId,
      message: message || comment.message,
      status: status || comment.status,
      parent_id: parent_id || Number(comment.parent_id),
      post_id: post_id || comment.post_id,
      user_id,
    };

    const updatedComment = await Comment.update(data);

    if (updatedComment.success) {
      res.status(200).json({ msg: "Commentaire mis à jour avec succès." });
    } else {
      res
        .status(404)
        .json({ msg: "Commentaire introuvable ou non mis à jour." });
    }
  } catch (err) {
    console.error("Erreur :", err.message);
    res.status(500).json({ msg: "Erreur serveur." });
  }
};

// Remove a comment
const remove = async (req, res) => {
  const { id } = req.params;
  const userId = req.session.user ? req.session.user.id : null;
  const userRole = req.session.user ? req.session.user.role : null; // Récupère le rôle de l'utilisateur

  // Vérifie si l'utilisateur est connecté
  if (!userId) {
    return res.status(403).json({
      message: "Vous devez être connecté pour supprimer un commentaire.",
    });
  }

  try {
    // Recherche le commentaire
    const comment = await Comment.findById(id);
    if (!comment) {
      return res.status(404).json({ message: "Commentaire non trouvé." });
    }

    // Vérifie si l'utilisateur est un administrateur
    if (userRole === "admin") {
      // Si c'est un admin, il peut supprimer le commentaire sans vérifier la propriété
      const result = await Comment.remove(id);
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Commentaire non trouvé." });
      }
      return res
        .status(200)
        .json({ message: "Commentaire supprimé avec succès." });
    }

    // Suppression du commentaire
    const result = await Comment.remove(id);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Commentaire non trouvé." });
    }

    res.status(200).json({ message: "Commentaire supprimé avec succès." });
  } catch (error) {
    console.error("Erreur lors de la suppression du commentaire :", error);
    res.status(500).json({ message: "Erreur serveur lors de la suppression." });
  }
};

export { getAll, findAllFromID, create, update, remove };
