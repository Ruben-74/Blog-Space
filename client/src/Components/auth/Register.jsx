import React, { useEffect } from "react";
import Form from "../Partials/Form";
import { Link, useNavigate } from "react-router-dom";
import { setMsg, updateField } from "../../store/slicesRedux/user";
import { FaSpaceShuttle } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";

function Register() {
  const user = useSelector((state) => state.user);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    return () => {
      dispatch(updateField({ email: "", password: "", username: "" }));
    };
  }, []);

  async function submitHandler(e) {
    e.preventDefault();
    if (!user.email || !user.password || !user.username) {
      dispatch(setMsg("Remplissez tous les champs"));
      return;
    }

    const response = await fetch("http://localhost:9000/api/v1/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });
    if (response.status === 201) {
      navigate("/auth/login");
    } else {
      const data = await response.json();
      dispatch(setMsg(data.msg));
    }
  }

  return (
    <section className="form-container">
      <FaSpaceShuttle size={50} />
      <hr />
      <h1 className="title-form">Try BlogSpace for Free</h1>

      {/* Div pour regrouper le paragraphe et le lien */}
      <div className="info-line">
        <p>Have an account already?</p>
        <Link to={"/auth/login"}>Sign In</Link>
      </div>
      <Form submitHandler={submitHandler} isRegister={true}>
        <button type="submit">Register</button>
      </Form>
    </section>
  );
}

export default Register;
