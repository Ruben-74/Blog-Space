import pool from "../config/db.js";

class Auth {
  static async create(datas) {
    // Insert username along with email and password
    const INSERT =
      "INSERT INTO user (username, email, password) VALUES (?, ?, ?)";
    return await pool.execute(INSERT, [...Object.values(datas)]);
  }

  static async findOneByEmail(email) {
    // Include username in the SELECT query
    const SELECT = `
    SELECT user.id, user.username, user.role, user.email, user.password, user.is_active, avatar.label AS avatar 
    FROM user 
    LEFT JOIN avatar ON user.avatar_id = avatar.id 
    WHERE email = ?`;
    return await pool.execute(SELECT, [email]);
  }

  static async findUserInfoById(id) {
    console.log("Fetching user info for ID:", id);
    const SELECT =
      "SELECT username, role, email, password, label AS avatar FROM user LEFT JOIN avatar ON user.avatar_id = avatar.id WHERE user.id = ?";
    try {
      const [result] = await pool.execute(SELECT, [id]);
      return result; // Return the result directly
    } catch (error) {
      console.error("Error fetching user info by ID:", error);
      throw new Error("User info lookup failed");
    }
  }
}

export default Auth;
