import { useEffect, useState } from "react";
import { FaEdit, FaEye, FaPlus, FaTrash } from "react-icons/fa";
import ReportDetail from "./ReportDetail";
import DeleteModal from "./Delete";
import CreateModal from "./Create";
import { useDispatch, useSelector } from "react-redux";
import { setMobile } from "../../../store/slicesRedux/view";

function Report() {
  const { isMobile } = useSelector((state) => state.view);
  const dispatch = useDispatch();
  const [reports, setReports] = useState([]);
  const [isUpdateModalToggle, setIsUpdateModalToggle] = useState(false);
  const [isCreateModalToggle, setIsCreateModalToggle] = useState(false);
  const [isDeleteToggle, setIsDeleteToggle] = useState(false);
  const [currentReport, setCurrentReport] = useState(null);
  const [error, setError] = useState(null);

  // Fonction pour récupérer les signalements depuis l'API
  const fetchReports = async () => {
    try {
      const response = await fetch("http://localhost:9000/api/v1/report/all");

      if (response.ok) {
        const data = await response.json();
        setReports(data);
      } else {
        throw new Error("Échec de la récupération des signalements.");
      }
    } catch (err) {
      setError(err.message);
    } finally {
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
        credentials: "include",
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

  const handleEditClick = (report) => {
    setCurrentReport(report); // Sélectionner le signalement à éditer
    setIsUpdateModalToggle(true);
  };

  // Fonction pour gérer la suppression d'un signalement
  const handleDeleteClick = (report) => {
    setCurrentReport(report); // Sélectionner le signalement à supprimer
    setIsDeleteToggle(true); // Ouvrir la modal de suppression
  };

  if (error) {
    return <p>Erreur : {error}</p>;
  }

  return (
    <section className="container">
      <h1 className="title-content">Liste des signalements</h1>

      <div className="container-list">
        <button
          className="btn-create"
          onClick={() => setIsCreateModalToggle(!isCreateModalToggle)}
        >
          <FaPlus />
          Ajouter un signalement
        </button>
      </div>

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
                  aria-label="Modifier le signalement"
                  className="btn-edit"
                  onClick={() => handleEditClick(report)}
                >
                  <FaEdit />
                </button>
                <button
                  aria-label="Supprimer le signalement"
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
      {isCreateModalToggle && (
        <CreateModal
          setIsModalToggle={setIsCreateModalToggle}
          fetchReports={fetchReports}
        />
      )}
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
