import { useEffect, useState } from "react";
import { FaEdit, FaEye, FaTrash } from "react-icons/fa";
import ReportDetail from "./ReportDetail"; // Composant pour afficher les détails et mettre à jour un signalement
import DeleteModal from "./Delete"; // Composant de confirmation de suppression
import { useDispatch, useSelector } from "react-redux";
import { setMobile } from "../../../store/slicesRedux/view"; // Import de l'action setMobile

function Report() {
  const { isMobile } = useSelector((state) => state.view);
  const dispatch = useDispatch();
  const [reports, setReports] = useState([]); // Liste des signalements
  const [isUpdateModalToggle, setIsUpdateModalToggle] = useState(false); // État de la modal de mise à jour
  const [isDeleteToggle, setIsDeleteToggle] = useState(false); // État de la modal de suppression
  const [currentReport, setCurrentReport] = useState(null); // Signalement actuellement sélectionné
  const [loading, setLoading] = useState(true); // État de chargement des données
  const [error, setError] = useState(null); // Gestion des erreurs

  // Fonction pour récupérer les signalements depuis l'API
  const fetchReports = async () => {
    try {
      const response = await fetch("http://localhost:9000/api/v1/report/all");

      if (response.ok) {
        const data = await response.json();
        setReports(data); // Mise à jour de l'état avec les signalements
      } else {
        throw new Error("Échec de la récupération des signalements.");
      }
    } catch (err) {
      setError(err.message); // Capturer l'erreur si elle survient
    } finally {
      setLoading(false); // Fin du chargement
    }
  };

  // Fonction pour supprimer un signalement
  async function onClickDeleteReport(id) {
    const response = await fetch(
      "http://localhost:9000/api/v1/report/remove/" + id,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Envoie les cookies si nécessaire
      }
    );
    if (response.ok) {
      fetchReports(); // Recharger la liste après la suppression
      setIsDeleteToggle(false); // Fermer la modal après la suppression
    }
  }

  useEffect(() => {
    const handleResize = () => {
      dispatch(setMobile(window.innerWidth <= 768));
    };
    window.addEventListener("resize", handleResize);

    fetchReports();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [dispatch]);

  // Fonction pour gérer l'édition d'un signalement
  const handleEditClick = (report) => {
    setCurrentReport(report); // Sélectionner le signalement à éditer
    setIsUpdateModalToggle(true); // Ouvrir la modal d'édition
  };

  // Fonction pour gérer la suppression d'un signalement
  const handleDeleteClick = (report) => {
    setCurrentReport(report); // Sélectionner le signalement à supprimer
    setIsDeleteToggle(true); // Ouvrir la modal de suppression
  };

  // Affichage de l'état de chargement ou des erreurs
  if (loading) {
    return <p>Chargement des signalements...</p>;
  }

  if (error) {
    return <p>Erreur : {error}</p>;
  }

  return (
    <section className="container">
      <h1 className="title-content">Liste des signalements</h1>

      {isMobile ? (
        <div className="cards-container">
          {/* Affichage sous forme de cartes pour mobile */}
          {reports.map((report) => (
            <div className="card" key={report.id}>
              <div className="card-header">
                <h3>{report.username}</h3>
                <p>
                  <strong>ID:</strong> {report.id}
                </p>
              </div>
              <div className="card-body">
                <p>
                  <strong>Message : </strong>
                  {report.message}
                </p>
                <p>
                  <strong>Date de publication : </strong>
                  {new Date(report.created_at).toLocaleString()}
                </p>

                <p>
                  <strong>Raison : </strong> {report.reason}
                </p>
                <span className={`status-badge ${report.status}`}>
                  <strong>Status: </strong>
                  {report.status}
                </span>
              </div>
              <div className="card-footer">
                <button
                  className="btn-edit"
                  onClick={() => handleEditClick(report)}
                >
                  <FaEdit />
                </button>
                <button
                  className="btn-delete"
                  onClick={() => handleDeleteClick(report)}
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        // Affichage sous forme de tableau pour les écrans larges
        <table>
          <thead>
            <tr>
              <th>Id</th>
              <th>Message</th>
              <th>Date de publication</th>
              <th>Status</th>
              <th>Raison</th>
              <th>Créateur</th>
              <th className="buttons">Actions</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report) => (
              <tr key={report.id}>
                <td>{report.id}</td>
                <td>{report.message}</td>
                <td>{new Date(report.created_at).toLocaleString()}</td>
                <td>{report.status}</td>
                <td>{report.reason}</td>
                <td>{report.username}</td>
                <td>
                  <div className="button-group">
                    <button
                      className="btn-edit"
                      onClick={() => handleEditClick(report)}
                    >
                      <FaEye />
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => handleDeleteClick(report)}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Afficher la modal d'édition si activée */}
      {isUpdateModalToggle && currentReport && (
        <ReportDetail
          setIsModalToggle={setIsUpdateModalToggle}
          fetchReports={fetchReports}
          currentReport={currentReport}
        />
      )}

      {/* Afficher la modal de confirmation de suppression */}
      {isDeleteToggle && currentReport && (
        <DeleteModal
          onConfirm={() => onClickDeleteReport(currentReport.id)}
          onClose={() => setIsDeleteToggle(false)}
        />
      )}
    </section>
  );
}

export default Report;
