import pool from "../config/db.js";

class Report {
  static async findAllReports() {
    const query = `
    SELECT 
      r.id, r.reason, r.created_at, r.status, c.message AS message, u.username 
    FROM 
      report r
    LEFT JOIN 
      comment c ON r.comment_id = c.id
    LEFT JOIN 
      user u ON r.user_id = u.id;
  `;

    try {
      const results = await pool.execute(query);
      return results;
    } catch (error) {
      console.error("Erreur lors de la récupération des signalements:", error);
      throw error;
    }
  }

  static async create(data) {
    if (!data.reason || !data.comment_id || !data.user_id) {
      throw new Error(
        "Les paramètres reason, comment_id et user_id sont requis."
      );
    }

    const INSERT_REPORT = `
      INSERT INTO report (reason, comment_id, status, created_at, user_id)
      VALUES (?, ?, 'pending', NOW(), ?)
    `;

    try {
      const [result] = await pool.execute(INSERT_REPORT, [
        data.reason,
        data.comment_id,
        data.user_id,
      ]);
      return { id: result.insertId, ...data };
    } catch (error) {
      console.error("Erreur lors de l'insertion du signalement :", error);
      throw new Error("Erreur lors de l'insertion dans la table report.");
    }
  }

  static async updateStatus(reportId, status) {
    const [reportResult] = await pool.execute(
      `UPDATE report SET status = ? WHERE id = ?`,
      [status, reportId]
    );

    if (reportResult.affectedRows === 0) {
      console.log("Signalement introuvable:", reportId);
      throw new Error("Signalement introuvable.");
    }

    if (status === "accepted") {
      const [commentResult] = await pool.execute(
        `UPDATE comment 
         SET status = 'hide' 
         WHERE id = (SELECT comment_id FROM report WHERE id = ?)`,
        [reportId]
      );

      if (commentResult.affectedRows === 0) {
        throw new Error("Commentaire introuvable ou déjà masqué.");
      }
    }
    return { reportId, status };
  }

  static async remove(id) {
    const REMOVE = "DELETE FROM report WHERE id = ?";
    return await pool.execute(REMOVE, [id]);
  }
}

export default Report;
