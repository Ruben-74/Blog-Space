import Post from "../model/Post.js";

const home_view = async (req, res) => {
  try {
    const datas = await Post.getAll();
    res.json(datas);
  } catch (err) {
    console.error("Erreur dans home_view:", err.message);
    res.status(500).json({ error: err.message });
  }
};

const automobile_view = async (req, res) => {
  try {
    const datas = await Post.getAuto();
    res.json(datas);
  } catch (err) {
    console.error("Erreur dans home_view:", err.message);
    res.status(500).json({ error: err.message });
  }
};

const aero_view = async (req, res) => {
  try {
    const datas = await Post.getAero();
    res.json(datas);
  } catch (err) {
    console.error("Erreur dans home_view:", err.message);
    res.status(500).json({ error: err.message });
  }
};

const post_view = async (req, res) => {
  try {
    const postData = await Post.getOneById(req.params.id);

    // Vérifier si le post existe
    if (!postData) {
      return res.status(404).json({ msg: "Post not found" }); // Réponse 404 si le post n'existe pas
    }

    // Si le post existe, envoyer les données
    res.status(200).json(postData);
  } catch (err) {
    console.error("Erreur dans post_view:", err.message);
    res.status(500).json({ error: err.message });
  }
};

const filter_posts = async (req, res) => {
  const { title } = req.params; // Récupérer le titre des paramètres de la requête

  try {
    const posts = await Post.FilterPost(title, title); // Appel de la fonction de filtrage avec le titre
    res.status(200).json(posts); // Renvoie les articles au format JSON
  } catch (error) {
    console.error("Erreur lors du filtrage des posts:", error.message);
    res.status(500).json({ error: "Erreur lors du filtrage des posts." });
  }
};

export { home_view, post_view, filter_posts, automobile_view, aero_view };
