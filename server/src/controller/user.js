import User from "../model/User.js";

const getAll = async (req, res) => {
  const [users] = await User.findAll();
  console.log(users);
  res.json(users);
};

const create_user = async (req, res) => {
  try {
    const { username, email, password, role, avatarId } = req.body;

    // Si l'avatar n'est pas fourni, vous pouvez le définir sur null
    const [response] = await User.create(
      username,
      email,
      password,
      role,
      avatarId || null
    );

    res.json({ msg: "Utilisateur créé", id: response.insertId });
  } catch (err) {
    console.error("Erreur lors de la création de l'utilisateur:", err);
    res.status(500).json({ msg: "Erreur serveur, veuillez réessayer." });
  }
};

const update_user = async (req, res) => {
  try {
    const { username, email, password, role, avatar_id } = req.body;

    const { id } = req.params;

    console.log(req.body);
    // Update the user
    const [response] = await User.update(
      username,
      email,
      password || null,
      role,
      avatar_id || null,
      id
    );

    if (!response.affectedRows) {
      return res.status(404).json({ msg: "User not found", id });
    }

    res.json({ msg: "User updated" });
  } catch (err) {
    console.error(err); // Log the error for debugging
    res.status(500).json({ msg: err.message });
  }
};

const remove_user = async (req, res) => {
  try {
    const [response] = await User.remove(req.params.id);
    console.log(response);
    if (!response.affectedRows) {
      res.status(404).json({ msg: "User not found" });
      return;
    }
    console.log(response);
    res.json({ msg: "User deleted", id: req.params.id });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

const updateAvatar = async (req, res) => {
  const { id } = req.session.user;
  const { avatar_id } = req.params;

  try {
    // Effectuer la mise à jour de l'avatar
    const response = await User.updateAvatar(avatar_id, id);

    // Vérification si la mise à jour a réussi
    if (response.success) {
      req.session.user.avatar = response.newAvatar; // Mise à jour de l'avatar dans la session
      return res.json({ msg: "Avatar updated", newAvatar: response.newAvatar });
    } else {
      return res.status(500).json({ msg: response.msg });
    }
  } catch (error) {
    console.error("Error updating avatar:", error);
    // Retourner une erreur 500 avec le message d'erreur
    return res.status(500).json({ msg: "Server error", error: error.message });
  }
};

const toggleUserStatus = async (req, res) => {
  try {
    const userId = req.params.id; // Récupérez l'ID de l'utilisateur à partir des paramètres de l'URL

    const [response] = await User.toggleUserActiveStatus(userId);

    if (!response.affectedRows) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.json({ msg: "User status toggled", userId });
  } catch (err) {
    console.error("Error toggling user status:", err);
    res.status(500).json({ msg: "Server error while toggling user status." });
  }
};

export {
  getAll,
  create_user,
  update_user,
  remove_user,
  updateAvatar,
  toggleUserStatus,
};
