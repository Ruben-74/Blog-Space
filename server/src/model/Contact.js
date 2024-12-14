import pool from "../config/db.js";

class Contact {
  static async findAll() {
    const SELECT_STATUS = `
      SELECT 
          id, 
          username, 
          email,
          content,
          publish_date,
          CASE 
              WHEN status = 0 THEN 'Message non lu'
              WHEN status = 1 THEN 'Message déjà lu'
              ELSE 'Tu peux le lire quand ?'
          END AS status
      FROM contact
    `;

    try {
      const [results] = await pool.query(SELECT_STATUS);
      return results; // Renvoie les résultats formatés
    } catch (error) {
      console.error("Erreur lors de la récupération des messages:", error);
      throw error; // Relance l'erreur pour gestion ultérieure
    }
  }

  static async create(username, email, content) {
    // Input validation
    if (!username || !email || !content) {
      throw new Error("All fields are required.");
    }

    // Simple email format validation (consider using a more robust regex)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error("Invalid email format.");
    }

    const INSERT =
      "INSERT INTO contact (username, email, content, status, publish_date ) VALUES (?, ?, ?, 0, NOW())";
    try {
      const [result] = await pool.execute(INSERT, [username, email, content]);
      return result.insertId; // Return the ID of the newly created contact
    } catch (error) {
      console.error("Error inserting contact:", error);
      throw new Error("Database error: " + error.message);
    }
  }

  static async update(id, status) {
    try {
      // Mettez à jour le contact dans la base de données
      const [result] = await pool.query(
        "UPDATE contact SET status = ? WHERE id = ?",
        [status, id]
      );

      // Vérifiez si la mise à jour a été effectuée
      if (result.affectedRows === 0) {
        throw new Error("Contact non trouvé");
      }

      return { message: "Statut mis à jour avec succès." };
    } catch (error) {
      console.error("Erreur lors de la mise à jour du contact:", error);
      throw error; // Relancez l'erreur pour gestion ultérieure
    }
  }

  static async remove(id) {
    const REMOVE = "DELETE FROM contact WHERE id = ?";
    return await pool.execute(REMOVE, [id]);
  }
}

export default Contact;
