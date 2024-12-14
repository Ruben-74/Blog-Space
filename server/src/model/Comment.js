import pool from "../config/db.js";

class Comment {
  static async findAll() {
    const SELECT_ALL = `
    SELECT 
      c.*,              
      u.username, 
      u.avatar_id,
      p.title
    FROM 
      comment c
    LEFT JOIN 
      post p ON c.post_id = p.id
    LEFT JOIN 
      user u ON c.user_id = u.id;
  `;

    return await pool.execute(SELECT_ALL);
  }

  static async findAllFromPostId(postId) {
    const SELECT_COMMENTS = `
   SELECT c.id, c.message, c.created_at, c.user_id, c.status, c.parent_id,
       u.username, a.label AS avatarUrl
    FROM comment c
    LEFT JOIN user u ON c.user_id = u.id
    LEFT JOIN avatar a ON u.avatar_id = a.id
    WHERE c.post_id = ? AND c.status != 'hide' `;

    const [results] = await pool.execute(SELECT_COMMENTS, [postId]);
    return results;
  }

  static async findById(id) {
    const SELECT_ONE = "SELECT * FROM comment WHERE id = ?";
    try {
      const [rows] = await pool.execute(SELECT_ONE, [id]);

      if (rows.length > 0) {
        console.log("Commentaire trouvé :", rows[0]);
        return rows[0];
      } else {
        console.log("Aucun commentaire trouvé avec l'ID :", id);
        return null;
      }
    } catch (error) {
      console.error("Error fetching comment by ID:", error);
      throw new Error("Database error while fetching comment");
    }
  }

  // creation d'un commentaire
  static async create(data) {
    const INSERT = `
      INSERT INTO comment (message, user_id, post_id, parent_id)
      VALUES (?, ?, ?, ?)`;

    const { message, post_id, parent_id, user_id, username, avatar_label } =
      data;

    try {
      if (message.length < 1 || message.length > 500) {
        console.error("le messgae doit contenir entre 1 et 500 caractères.");
      }

      const [result] = await pool.execute(INSERT, [
        message,
        user_id,
        post_id,
        parent_id || null,
      ]);

      if (!result || !result.insertId) {
        throw new Error("Impossible de créer le commentaire.");
      }

      console.log("Commentaire créé avec succès.");

      return {
        id: result.insertId,
        message,
        post_id,
        parent_id: parent_id || null,
        user_id,
        username: username || "Unknown User",
        avatar_label: avatar_label || "user.png",
        created_at: new Date().toISOString(),
      };
    } catch (error) {
      console.error(
        "Erreur lors de la création du commentaire :",
        error.message
      );
      throw new Error(`Erreur serveur : ${error.message}`);
    }
  }

  // mise a jour d'un commentaire
  static async update({ id, message, status, parent_id, post_id, user_id }) {
    try {
      const UPDATE =
        "UPDATE comment SET message = ?, status = ?, parent_id = ?, post_id = ?, user_id = ? WHERE id = ?";

      const [result] = await pool.execute(UPDATE, [
        message,
        status,
        parent_id || null,
        post_id || null,
        user_id,
        id,
      ]);

      if (result.affectedRows === 0) {
        console.log("Aucun commentaire mis à jour.");
        return {
          success: false,
          msg: "Commentaire introuvable ou déjà à jour.",
        };
      }

      console.log("Commentaire mis à jour avec succès.");
      return { success: true, msg: "Mise à jour réussie." };
    } catch (error) {
      console.error("Erreur SQL :", error.message);
      return { success: false, msg: "Erreur de mise à jour." };
    }
  }

  // supprimer un commentaire

  static async remove(commentId) {
    const DELETE_REPLIES = "DELETE FROM comment WHERE parent_id = ?"; // Supprime toutes les réponses
    const DELETE_COMMENT = "DELETE FROM comment WHERE id = ?"; // Supprime le commentaire principal

    try {
      // Supprime d'abord toutes les réponses
      await pool.execute(DELETE_REPLIES, [commentId]);

      // Ensuite, supprime le commentaire principal
      const [result] = await pool.execute(DELETE_COMMENT, [commentId]);
      return result; // Renvoie le résultat de la suppression
    } catch (error) {
      console.error("Erreur lors de la suppression du commentaire :", error);
      throw new Error("Database error while deleting comment");
    }
  }
}

export default Comment;
