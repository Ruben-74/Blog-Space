import AvatarList from "./Partials/AvatarList";
import useCloseMenu from "../Hook/useCloseMenu";
import { useSelector } from "react-redux";

function Dashboard() {
  useCloseMenu();
  const user = useSelector((state) => state.user);

  return (
    <main className="container dashboard">
      <section className="dashboard__header-section">
        <h2 className="dashboard__header">Hello, {user.username}!</h2>
        <img
          className="dashboard__avatar"
          src={`/icons/${user.avatar}`}
          alt={`Avatar of ${user.username}`}
        />
      </section>

      <section className="dashboard__profile-section">
        <h3 className="dashboard__profile-title">Your Profile</h3>
        <p className="dashboard__info">Alias: {user.username}</p>
        <AvatarList />
      </section>
    </main>
  );
}

export default Dashboard;
