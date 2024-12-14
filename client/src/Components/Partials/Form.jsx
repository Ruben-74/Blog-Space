import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { updateField } from "../../store/slicesRedux/user";

function Form({ submitHandler, isRegister, children }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  return (
    <form onSubmit={submitHandler}>
      {user.msg && typeof user.msg === "string" && (
        <p className="error user-msg">{user.msg}</p>
      )}

      {isRegister && (
        <>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            name="username"
            id="username"
            value={user.username || ""}
            onChange={(e) =>
              dispatch(updateField({ ...user, username: e.target.value }))
            }
            required
            autoComplete="username"
            tabIndex="1"
          />
        </>
      )}

      <label htmlFor="email"> Email</label>
      <input
        type="email"
        name="email"
        id="email"
        value={user.email || ""}
        onChange={(e) =>
          dispatch(updateField({ ...user, email: e.target.value }))
        }
        required
        autoComplete="email"
        tabIndex="1"
      />

      <label htmlFor="password">Password</label>
      <input
        type="password"
        name="password"
        id="password"
        value={user.password || ""}
        onChange={(e) =>
          dispatch(updateField({ ...user, password: e.target.value }))
        }
        required
        autoComplete="password"
        tabIndex="2"
      />

      {children}
    </form>
  );
}

Form.propTypes = {
  submitHandler: PropTypes.func.isRequired,
  isRegister: PropTypes.bool.isRequired,
  children: PropTypes.node,
};

export default Form;
