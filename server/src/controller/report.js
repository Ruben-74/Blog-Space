import Report from "../model/Report.js";

const getAllReports = async (req, res) => {
  try {
    // Récupérer tous les signalements
    const [reports] = await Report.findAllReports();
    // Renvoie les signalements au format JSON
    res.status(200).json(reports);
  } catch (error) {
    console.error("Erreur lors de la récupération des signalements", error);
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération des signalements" });
  }
};

const createReport = async (req, res) => {
  const { commentId, reason } = req.body;
  const userId = req.session.user ? req.session.user.id : null;

  if (!userId) {
    return res.status(401).json({ msg: "User not authenticated" });
  }

  if (!commentId || !reason) {
    return res.status(400).json({ msg: "Comment ID and reason are required" });
  }

  try {
    const report = await Report.create({
      reason,
      comment_id: commentId,
      user_id: userId,
    });
    res.status(201).json({ msg: "Report created", reportId: report.id });
  } catch (error) {
    console.error("Erreur lors de la création du signalement:", error);
    res.status(500).json({ msg: error.message });
  }
};

const updateReportStatus = async (req, res) => {
  console.log("Request Body:", req.body);
  console.log("Request Params:", req.params);

  const { status } = req.body;
  const { reportId } = req.params;

  // Vérification des données
  if (!reportId || !status) {
    return res.status(400).json({ msg: "Report ID and status are required" });
  }

  try {
    // Appel à la méthode pour mettre à jour le statut
    const result = await Report.updateStatus(reportId, status);

    // Vérification si aucune ligne n'a été modifiée
    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ msg: "Report not found or no changes made" });
    }

    // Réponse après mise à jour réussie
    res.status(200).json({ msg: "Report status updated successfully" });
  } catch (error) {
    // Gestion des erreurs
    console.error("Error updating report status:", error);
    res.status(500).json({ msg: error.message });
  }
};

const removeReport = async (req, res) => {
  try {
    const [response] = await Report.remove(req.params.id);

    if (!response.affectedRows) {
      res.status(404).json({ msg: "Report not found" });
      return;
    }
    console.log(response);
    res.json({ msg: "Contact deleted", id: req.params.id });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

export { getAllReports, createReport, updateReportStatus, removeReport };
