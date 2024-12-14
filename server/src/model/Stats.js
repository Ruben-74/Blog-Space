import pool from "../config/db.js"; // Assurez-vous que le chemin est correct

class Stats {
  static async getCounts() {
    try {
      const [results] = await pool.execute(
        `
        SELECT 
            (SELECT COUNT(*) FROM user) AS user_count,
            (SELECT COUNT(*) FROM post) AS post_count,
            (SELECT COUNT(*) FROM category) AS category_count,
            (SELECT COUNT(*) FROM comment) AS comment_count,
            (SELECT COUNT(*) FROM contact) AS contact_count,
            
            (SELECT COUNT(*) FROM user WHERE is_active = 1) AS active_user_count,
           (SELECT COUNT(DISTINCT p.id) FROM post p JOIN comment c ON p.id = c.post_id) AS posts_with_comments,
            (SELECT COUNT(DISTINCT c.id) FROM category c 
            JOIN post_category pc ON c.id = pc.category_id 
            JOIN post p ON pc.post_id = p.id) AS active_category_count,
            (SELECT COUNT(*) FROM comment WHERE status = 'visible') AS approved_comment_count,
            (SELECT COUNT(*) FROM contact WHERE status = 1) AS watch_contact_count
                    
        `
      );

      console.log("stats", results);
      return results; // Retourne le premier élément du tableau
    } catch (error) {
      console.error("Erreur lors de la récupération des statistiques :", error);
      throw new Error("Erreur lors de la récupération des statistiques");
    }
  }
}

export default Stats;
