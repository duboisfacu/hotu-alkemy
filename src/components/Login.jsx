import React from "react";
import { Formik } from "formik";
import axios from "axios";
import { useHistory } from "react-router-dom";
import logo from "../resources/logo.png";
import ilus from "../resources/back_ilustration.png";

const Form = () => {
  // creo la variable history para que al enviar el formulario pushee /home
  let history = useHistory();
  return (
    <>
      <img className="il-login" src={ilus} />
      <Formik
        //al iniciar el formulario, deja en blanco los campos
        initialValues={{
          email: "",
          password: "",
        }}
        //acá está la validación de los campos
        validate={(values) => {
          let errors = {};

          if (!values.email) {
            errors.email = "Please enter a email.";
          } else if (
            !/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(
              values.email
            )
          ) {
            errors.email = "Please enter a valid email.";
          }

          if (!values.password) {
            errors.password = "Please enter a password.";
          } else if (!/^[a-zA-ZÀ-ÿ\s]{5,30}$/.test(values.password)) {
            errors.password =
              "The password must contain at least five characters";
          }
          return errors;
        }}
        //al enviar el formulario se pasan los valores de la variable body por post
        onSubmit={async (values) => {
          let body = {
            email: values.email,
            password: values.password,
          };

          axios({
            method: "post",
            url: "http://challenge-react.alkemy.org/",
            data: body,
          })
            //si recibe un token del url pushea home redirigiendo al home
            .then(function (response) {
              localStorage.setItem("token", response.data.token);
              localStorage.setItem("team", JSON.stringify([]));
              history.push("/home");
            })

            .catch(function (error) {
              alert("Usuario o contraseña inválida.");
            });
        }}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleSubmit,
          handleBlur,
        }) => (
          <div className="modal-dialog text-center">
            <div className="col-sm-8 main-section">
              <div className="modal-content">
                <div className="col-12 page-img">
                  <img src={logo} width="160px" />
                </div>

                <form className="col-12" onSubmit={handleSubmit}>
                  <div className="form-group input">
                    <input
                      className="form-control"
                      type="email"
                      id="email"
                      name="email"
                      placeholder="Email Adress"
                      value={values.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    {touched.email && errors.email && (
                      <div className="validate-error">{errors.email}</div>
                    )}
                  </div>
                  <div className="form-group input">
                    <input
                      className="form-control"
                      type="password"
                      id="password"
                      name="password"
                      placeholder="Enter your Password"
                      value={values.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    {touched.password && errors.password && (
                      <div className="validate-error">{errors.password}</div>
                    )}
                  </div>
                  <button type="submit" className="btn btn-primary">
                    Login
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </Formik>
    </>
  );
};

export default Form;
