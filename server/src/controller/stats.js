import Stats from "../model/Stats.js";

const getAllStats = async (req, res) => {
  try {
    const [stats] = await Stats.getCounts();
    res.json(stats); // Retournez les résultats sous forme d'objet
  } catch (error) {
    console.error("Erreur lors de la récupération des statistiques :", error);
    res.status(500).json({ error: "Erreur interne du serveur" });
  }
};

export { getAllStats };
