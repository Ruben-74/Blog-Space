import pool from "../config/db.js";
import path from "path";
import fs from "fs/promises";

const IMAGE_DIR = path.join(process.cwd(), "public/images");

class Post {
  static async getAll() {
    try {
      const [datas] = await pool.execute(`
        SELECT p.id AS id, p.title AS title, p.description AS description, 
               p.publish_date AS publish_date, u.username AS author, 
               i.url, c.label , a.label as avatar
        FROM post p 
        LEFT JOIN image i ON p.id = i.post_id 
        LEFT JOIN post_category pc ON p.id = pc.post_id 
        LEFT JOIN user u ON p.user_id = u.id
        LEFT JOIN avatar a ON u.avatar_id = a.id
        LEFT JOIN category c ON pc.category_id = c.id 
        ORDER BY p.id;
      `);
      return datas;
    } catch (err) {
      console.error("Erreur dans getAll:", err.message);
      throw new Error("Erreur lors de la récupération des posts.");
    }
  }

  static async getAuto() {
    try {
      const [datas] = await pool.execute(`
        SELECT p.id AS id, p.title AS title, p.description AS description, 
               p.publish_date AS publish_date, u.username AS author, 
               i.url, c.label, a.label as avatar
        FROM post p 
        LEFT JOIN image i ON p.id = i.post_id 
        LEFT JOIN post_category pc ON p.id = pc.post_id 
        LEFT JOIN user u ON p.user_id = u.id
        LEFT JOIN avatar a ON u.avatar_id = a.id
        LEFT JOIN category c ON pc.category_id = c.id 
        WHERE c.label = 'Automobile'
        ORDER BY p.id;
      `);
      return datas;
    } catch (err) {
      console.error("Erreur dans getAuto:", err.message);
      throw new Error("Erreur lors de la récupération des posts.");
    }
  }

  static async getAero() {
    try {
      const [datas] = await pool.execute(`
        SELECT p.id AS id, p.title AS title, p.description AS description, 
               p.publish_date AS publish_date, u.username AS author, 
               i.url, c.label, a.label as avatar
        FROM post p 
        LEFT JOIN image i ON p.id = i.post_id 
        LEFT JOIN post_category pc ON p.id = pc.post_id 
        LEFT JOIN user u ON p.user_id = u.id
        LEFT JOIN avatar a ON u.avatar_id = a.id
        LEFT JOIN category c ON pc.category_id = c.id 
        WHERE c.label = 'Aero'
        ORDER BY p.id;
      `);
      return datas;
    } catch (err) {
      console.error("Erreur dans getAero:", err.message);
      throw new Error("Erreur lors de la récupération des posts.");
    }
  }

  static async FilterPost(title, label) {
    const query = `
        SELECT p.id AS id, 
               p.title AS title, 
               p.description AS description, 
               p.publish_date AS publish_date, 
               u.username AS author, 
               i.url, 
               c.label, 
               a.label AS avatar
        FROM post p 
        LEFT JOIN image i ON p.id = i.post_id 
        LEFT JOIN post_category pc ON p.id = pc.post_id 
        LEFT JOIN user u ON p.user_id = u.id
        LEFT JOIN avatar a ON u.avatar_id = a.id
        LEFT JOIN category c ON pc.category_id = c.id 
        WHERE p.title LIKE ? OR c.label LIKE ?
        ORDER BY p.id LIMIT 25;
    `;

    try {
      const [results] = await pool.execute(query, [`%${title}%`, `${label}%`]); // Utilisez les jokers pour le filtrage

      return results;
    } catch (error) {
      console.error("Erreur lors de la récupération des posts:", error.message);
      throw new Error("Erreur lors de la récupération des posts.");
    }
  }

  // Récupérer un post par son ID
  static async getOneById(id) {
    try {
      const query = `SELECT p.id AS id, 
          p.title AS title, 
          p.description AS description, 
          p.publish_date AS publish_date, 
          i.url AS imageUrl, 
          c.label AS categoryLabel, 
          u.username AS username, 
          a.label AS avatarUrl
      FROM post p 
      LEFT JOIN image i ON p.id = i.post_id 
      LEFT JOIN post_category pc ON p.id = pc.post_id 
      LEFT JOIN category c ON pc.category_id = c.id 
      LEFT JOIN user u ON p.user_id = u.id 
      LEFT JOIN avatar a ON u.avatar_id = a.id 
      WHERE p.id = ? 
    `;
      const [[data]] = await pool.execute(query, [id]);
      return data || null;
    } catch (err) {
      console.error("Erreur dans getOneById:", err.message);
      throw new Error("Erreur lors de la récupération du post.");
    }
  }

  // Ajouter une image pour un post
  static async addImage(url, alt_img, postId) {
    // Vérification si l'image existe déjà
    const checkImageQuery = `SELECT id FROM image WHERE url = ? LIMIT 1`;
    const [rows] = await pool.execute(checkImageQuery, [url]);

    if (rows.length > 0) {
      throw new Error("Une image avec ce nom existe déjà.");
    }

    // Si l'image n'existe pas, on l'insère
    const imageQuery = `INSERT INTO image (url, alt_img, post_id) VALUES (?, ?, ?)`;
    await pool.execute(imageQuery, [url, alt_img, postId]);
  }

  // Créer un nouveau post
  static async create(datas) {
    const { title, description, user_id, categoryId, image } = datas;

    if (!title || !description || !user_id || !categoryId) {
      throw new Error("Tous les champs sont requis.");
    }

    try {
      const postQuery = `INSERT INTO post (title, description, publish_date, user_id) VALUES (?, ?, NOW(), ?)`;
      const [postResult] = await pool.execute(postQuery, [
        title,
        description,
        user_id,
      ]);

      const postId = postResult.insertId;

      // Ajouter la catégorie du post
      await pool.execute(
        `INSERT INTO post_category (post_id, category_id) VALUES (?, ?)`,
        [postId, categoryId]
      );

      if (image && image.url) {
        const { alt_img } = image;
        await this.addImage(image.url, alt_img, postId);
      }
    } catch (error) {
      console.error("Erreur dans create:", error.message);
      throw new Error("Erreur lors de la création du post.");
    }
  }

  static async updateImage(url, alt_img, postId) {
    try {
      const checkImageQuery = `SELECT id FROM image WHERE url = ? LIMIT 1`;
      const [rows] = await pool.execute(checkImageQuery, [url]);

      if (rows.length > 0) {
        throw new Error("Une image avec ce nom existe déjà.");
      }

      const imageQuery = `UPDATE image SET url = ?, alt_img = ? WHERE post_id = ?`;
      const [result] = await pool.execute(imageQuery, [url, alt_img, postId]);

      if (result.affectedRows === 0) {
        throw new Error("Aucune image mise à jour. Vérifiez l'ID du post.");
      }

      console.log(`Image mise à jour pour le post ${postId}`);
    } catch (err) {
      console.error("Erreur lors de la mise à jour de l'image :", err.message);
      throw new Error("Une erreur est survenue.");
    }
  }

  static async update({
    title,
    description,
    userId,
    postId,
    categoryId,
    image,
  }) {
    try {
      // 1. Mettre à jour les informations du post
      const postQuery = `UPDATE post SET title = ?, description = ?, publish_date = NOW(), user_id = ? WHERE id = ?`;
      const [postResult] = await pool.execute(postQuery, [
        title,
        description,
        userId,
        postId,
      ]);

      if (postResult.affectedRows === 0) {
        throw new Error(`Post avec l'ID ${postId} introuvable.`);
      }

      console.log(`Post ID ${postId} mis à jour.`);

      // 2. Mettre à jour la catégorie associée
      const categoryQuery = `UPDATE post_category SET category_id = ? WHERE post_id = ?`;
      const [categoryResult] = await pool.execute(categoryQuery, [
        categoryId,
        postId,
      ]);

      console.log("Catégorie mise à jour", categoryResult);

      // 3. Mettre à jour l'image
      if (image?.url) {
        const queryImage = `UPDATE image SET url = ?, alt_img = ? WHERE post_id = ?`;
        const [imageResult] = await pool.execute(queryImage, [
          image.url,
          image.alt_img,
          postId,
        ]);

        console.log("Mise à jour de l'image réussie", imageResult);
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour :", error.message);
      throw new Error("Une erreur interne est survenue.");
    }
  }

  static async removeImage(postId) {
    try {
      const imageQuery = `SELECT url FROM image WHERE post_id = ?`;
      const [[image]] = await pool.execute(imageQuery, [postId]);

      if (image && image.url) {
        const imagePath = path.join(IMAGE_DIR, image.url);

        try {
          await fs.unlink(imagePath);
          console.log(`L'image ${imagePath} a été supprimée.`);
        } catch (fileErr) {
          console.error(
            `Erreur lors de la suppression de l'image :`,
            fileErr.message
          );
        }
      }

      const deleteImageQuery = `DELETE FROM image WHERE post_id = ?`;
      await pool.execute(deleteImageQuery, [postId]);
    } catch (error) {
      console.error(
        "Erreur lors de la suppression des images :",
        error.message
      );
      throw new Error("Impossible de supprimer l'image.");
    }
  }

  // Méthode principale pour supprimer un post
  static async remove(id) {
    try {
      await this.removeImage(id);

      // Nettoyage des relations post_category
      await pool.execute("DELETE FROM post_category WHERE post_id = ?", [id]);

      const [result] = await pool.execute("DELETE FROM post WHERE id = ?", [
        id,
      ]);

      if (result.affectedRows === 0) {
        throw new Error("Post introuvable ou déjà supprimé.");
      }

      return result;
    } catch (error) {
      console.error("Erreur dans la suppression du post :", error.message);
      throw new Error("Impossible de supprimer le post.");
    }
  }
}

export default Post;
