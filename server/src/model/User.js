import pool from "../config/db.js";

import bcrypt from "bcrypt";

class User {
  static async findAll() {
    const SELECT_ALL = `
      SELECT u.*, a.label AS avatar_label
      FROM user u
      LEFT JOIN avatar a ON u.avatar_id = a.id
    `;
    return await pool.query(SELECT_ALL);
  }

  static async findUserWithAvatar(id) {
    const FIND_ONE = `
      SELECT u.id, u.username, a.label AS avatar
      FROM user u
      LEFT JOIN avatar a ON u.avatar_id = a.id
      WHERE u.id = ?`;

    if (!id) {
      throw new Error("User ID is required");
    }

    try {
      const [results] = await pool.execute(FIND_ONE, [id]);

      if (results.length === 0) {
        console.error("No user found with the given ID:", id);
        return null; // Aucun utilisateur trouvé
      }

      console.log("User found with avatar:", results[0]);
      return results[0]; // Retourne l'utilisateur trouvé avec son avatar
    } catch (error) {
      console.error("Error finding user:", error);
      throw new Error("Database error while finding user");
    }
  }

  static async create(username, email, password, role, avatarID) {
    // Validate inputs
    if (!username || !email || !password) {
      throw new Error("Missing required fields: username, email, or password");
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const INSERT =
      "INSERT INTO user (username, email, password, role, avatar_id) VALUES (?, ?, ?, ?, ?)";

    try {
      return await pool.execute(INSERT, [
        username,
        email,
        hashedPassword,
        role,
        avatarID || null,
      ]);
    } catch (error) {
      throw new Error("Database error: " + error.message);
    }
  }

  static async update(username, email, password, role, avatar_id, id) {
    // Check required fields

    // Prepare the base update query
    let UPDATE =
      "UPDATE user SET username = ?, email = ?, role= ?, avatar_id = ? WHERE id = ?";

    // If a new password is provided, hash it and adjust the query
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      UPDATE =
        "UPDATE user SET username = ?, email = ?, password = ?, role = ?, avatar_id = ? WHERE id = ?";
      return await pool.execute(UPDATE, [
        username,
        email,
        hashedPassword,
        role,
        avatar_id,
        id,
      ]);
    }

    // Execute the query without password
    return await pool.execute(UPDATE, [
      username,
      email,
      (password = null),
      role,
      avatar_id,
      id,
    ]);
  }

  static async remove(id) {
    const REMOVE = "DELETE FROM user WHERE id = ?";
    return await pool.execute(REMOVE, [id]);
  }
  static async updateAvatar(avatar_id, user_id) {
    // SQL pour mettre à jour l'avatar de l'utilisateur dans la base de données
    const UPDATE_AVATAR = "UPDATE user SET avatar_id = ? WHERE id = ?";

    try {
      // On effectue la mise à jour dans la base de données avec l'ID de l'avatar et de l'utilisateur
      const [result] = await pool.execute(UPDATE_AVATAR, [avatar_id, user_id]);

      // Si aucune ligne n'a été modifiée, cela signifie que l'avatar n'a pas été mis à jour
      if (result.affectedRows === 0) {
        return { success: false, msg: "Avatar update failed" }; // Retourne un message d'échec
      }

      // Si la mise à jour a réussi, on va chercher les informations de l'utilisateur avec son avatar
      const user = await User.findUserWithAvatar(user_id);

      // Si l'utilisateur n'est pas trouvé, on retourne une erreur
      if (!user) {
        return { success: false, msg: "User not found" };
      }

      // Si tout est bon, on retourne l'avatar mis à jour
      return { success: true, newAvatar: user.avatar }; // Retourne le nouvel avatar de l'utilisateur
    } catch (error) {
      // Si une erreur se produit dans le processus, on affiche l'erreur dans la console et retourne un message d'erreur
      console.error("Error updating avatar in database:", error);
      return { success: false, msg: "Database error while updating avatar" };
    }
  }

  static async toggleUserActiveStatus(id) {
    const TOGGLE_STATUS = `
      UPDATE user
      SET is_active = NOT is_active
      WHERE id = ?
    `;
    return await pool.execute(TOGGLE_STATUS, [id]);
  }
}

export default User;
