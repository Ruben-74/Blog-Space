import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setAvatar } from "../../store/slicesRedux/user";

function AvatarList() {
  const [list, setList] = useState(null);
  const [newAvatar, setNewAvatar] = useState(null);

  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    // Fonction pour récupérer les avatars disponibles
    async function fetchAvatar() {
      try {
        const response = await fetch(
          "http://localhost:9000/api/v1/avatar/all",
          {
            method: "GET",
            credentials: "include", // Inclure les cookies pour la session
          }
        );
        if (!response.ok) {
          throw new Error("Erreur lors du chargement des avatars");
        }
        const datas = await response.json();
        setList(datas); // Mettre à jour la liste des avatars
      } catch (error) {
        console.error("Erreur lors du chargement des avatars:", error);
      }
    }

    fetchAvatar(); // Appeler la fonction pour récupérer les avatars au chargement du composant
  }, []);

  // Fonction pour soumettre le changement d'avatar
  async function submitChangeAvatar(e) {
    e.preventDefault(); // Empêcher la soumission par défaut du formulaire

    if (!newAvatar) return; // Si aucun nouvel avatar n'est sélectionné, on arrête l'exécution

    try {
      const response = await fetch(
        `http://localhost:9000/api/v1/user/avatar/${newAvatar}`, // URL avec l'ID de l'avatar
        {
          method: "PATCH",
          credentials: "include", // Inclure les cookies pour la session
          headers: {
            "Content-Type": "application/json", // Spécifier le type de contenu
          },
        }
      );

      if (!response.ok) {
        throw new Error("Erreur lors du changement d'avatar");
      }

      const data = await response.json();
      dispatch(setAvatar(data.newAvatar)); // Mise à jour du Redux avec le nouvel avatar
    } catch (error) {
      console.error("Erreur lors du changement d'avatar:", error);
      // Optionnel : gérer l'affichage d'un message d'erreur pour l'utilisateur
    }
  }

  return (
    <aside className="avatar-list">
      <h3 className="avatar-list__title">Choose Your Avatar</h3>
      <form className="avatar-list__form" onSubmit={submitChangeAvatar}>
        <div className="avatar-list__options">
          {list &&
            list.map((avatar) => {
              if (avatar.label !== user.avatar) {
                return (
                  <div key={avatar.id} className="avatar-list__option">
                    <input
                      className="avatar-list__radio"
                      type="radio"
                      name="avatar"
                      id={`avatar-${avatar.id}`}
                      value={avatar.id}
                      onChange={(e) => setNewAvatar(e.target.value)} // Mettre à jour le nouvel avatar sélectionné
                    />
                    <label
                      htmlFor={`avatar-${avatar.id}`}
                      className="avatar-list__label"
                    >
                      <img
                        className="avatar-list__image"
                        src={`/icons/${avatar.label}`} // Lien vers l'image de l'avatar
                        alt={avatar.label}
                      />
                    </label>
                  </div>
                );
              }
              return null;
            })}
        </div>
        <button
          type="submit"
          className={`avatar-list__button ${!newAvatar ? "disabled" : ""}`}
          disabled={!newAvatar} // Désactiver le bouton si aucun avatar n'est sélectionné
        >
          Change Avatar
        </button>
      </form>
    </aside>
  );
}

export default AvatarList;
