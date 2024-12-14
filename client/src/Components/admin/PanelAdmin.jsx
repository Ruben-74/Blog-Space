import React, { useState, useEffect } from "react";
import CircularProgressBar from "../../utils/CircularProgressBar"; // Vérifiez le chemin d'importation

const PanelAdmin = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:9000/api/v1/stats/all", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (!response.ok) throw new Error("Failed to fetch data");
        const data = await response.json();
        setStats(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!stats) return <div>No data available</div>;

  // Calcul des pourcentages si les valeurs sont disponibles
  const userPercentage = stats.user_count
    ? (stats.active_user_count / stats.user_count) * 100
    : 0;
  const articlePercentage = stats.post_count
    ? (stats.posts_with_comments / stats.post_count) * 100
    : 0;
  const categoryPercentage = stats.category_count
    ? (stats.active_category_count / stats.category_count) * 100
    : 0;
  const commentPercentage = stats.comment_count
    ? (stats.approved_comment_count / stats.comment_count) * 100
    : 0;
  const contactPercentage = stats.contact_count
    ? (stats.watch_contact_count / stats.contact_count) * 100
    : 0;

  return (
    <section className="container">
      <h1 className="dashboard-title">Mon Tableau de Bord</h1>
      <section>
        <h2 className="stats-title">Statistiques</h2>
        <ul className="stats-list">
          <div className="stats-row">
            <li className="stats-item">
              <CircularProgressBar percentage={Math.round(userPercentage)} />
              <span className="stats-number">
                Utilisateurs : {stats.user_count}
              </span>
              <span className="stats-detail">
                {stats.active_user_count} comptes actifs
              </span>
            </li>
            <li className="stats-item">
              <CircularProgressBar percentage={Math.round(articlePercentage)} />
              <span className="stats-number">
                Articles : {stats.post_count}
              </span>
              <span className="stats-detail">
                {stats.posts_with_comments} article avec au moins 1 commentaire
              </span>
            </li>
            <li className="stats-item">
              <CircularProgressBar
                percentage={Math.round(categoryPercentage)}
              />
              <span className="stats-number">
                Catégories : {stats.category_count}
              </span>
              <span className="stats-detail">
                {stats.active_category_count} catégorie(s) utilisée(s)
              </span>
            </li>
          </div>
          <div className="stats-row">
            <li className="stats-item">
              <CircularProgressBar percentage={Math.round(commentPercentage)} />
              <span className="stats-number">
                Commentaires : {stats.comment_count}
              </span>
              <span className="stats-detail">
                {stats.approved_comment_count} commentaire(s) valides
              </span>
            </li>
            <li className="stats-item">
              <CircularProgressBar percentage={Math.round(contactPercentage)} />
              <span className="stats-number">
                Messages reçus : {stats.contact_count}
              </span>
              <span className="stats-detail">
                {stats.watch_contact_count} messages lus
              </span>
            </li>
          </div>
        </ul>
      </section>
    </section>
  );
};

export default PanelAdmin;
