import React, { useEffect, useState } from "react";
import { Formik, Form, Field } from "formik";
import axios from "axios";
import { Link, useHistory } from "react-router-dom";
import logo from "../resources/logo.png";
import ilustration from "../resources/search.png";
import ilustrationError from "../resources/search_error.png";

const Heroes = () => {
  // initialValue contiene el equipo traído desde el localStorage
  let initialValue = JSON.parse(localStorage.getItem("team"));
  // heroes contendrá los heroes buscados
  const [heroes, setHeroes] = useState([]);
  // error contendrá error al buscar
  const [error, setError] = useState([]);
  // team contendra el equipo, iniciando con el equipo traído del localStorage
  const [team = initialValue, setTeam] = useState();

  // bubbles contendra
  const [bubbles, setBubbles] = useState([]);

  //seteo el equipo actual
  useEffect(() => {
    setTeam(JSON.parse(localStorage.getItem("team")));
    // seteo de los svg de alignment del equipo
    for (let i in initialValue) {
      if (initialValue[i].biography.alignment === "bad") {
        setBubbles((prevArray) => [...prevArray, bubbleBad]);
      } else if (initialValue[i].biography.alignment === "good") {
        setBubbles((prevArray) => [...prevArray, bubbleGood]);
      } else {
        setBubbles((prevArray) => [...prevArray, bubbleNeutral]);
      }
    }
  }, []);

  //se sube al localStorage el equipo
  localStorage.setItem("team", JSON.stringify(team));

  // history instanciado para redirigir al login en caso de cerrar sesión
  const history = useHistory();
  // Logout limpia el localStorage borrando el token y redirecciona a login
  const Logout = () => {
    localStorage.clear();
    history.push("/login");
  };

  // creacion de los svg estéticos para ver el alignment de los heroes
  let bubbleBad = (
    <svg className="bubble" height="16px" width="16">
      <circle cx="7" cy="7" r="7" fill="#b81d13" />
    </svg>
  );
  let bubbleGood = (
    <svg className="bubble" height="16px" width="16">
      <circle cx="7" cy="7" r="7" fill="#008450" />
    </svg>
  );

  let bubbleNeutral = (
    <svg className="bubble" height="16px" width="16">
      <circle cx="7" cy="7" r="7" fill="#efb700" />
    </svg>
  );

  // al presionar el boton de agregar carga esta función
  const Load = (heroe) => {
    // found chequea si el heroe que se quiere agregar ya está en el equipo
    const found = team.some((el) => el.id === heroe.id);
    // contGood y contBad filtran la cantidad de heroes buenos y malos que haya en el equipo
    const contGood = team.filter(
      (el) => el.biography.alignment === "good"
    ).length;
    const contBad = team.filter(
      (el) => el.biography.alignment === "bad"
    ).length;

    // si el heroe no se encuentra en el equipo y la longitud del equipo es menor que 6
    if (!found) {
      if (team.length < 6) {
        // chequea si el heroe es bueno, malo o neutral. al chequearlo, lo agrega al equipo y luego agrega un circulo de color dependiendo de la orientación del heroe.
        // (si es neutral o no está definido no va a tener limitación a la hora de agregarlo)
        if (heroe.biography.alignment === "good" && contGood < 3) {
          setTeam((prevArray) => [...prevArray, heroe]);
          setBubbles((prevArray) => [...prevArray, bubbleGood]);
        } else if (heroe.biography.alignment === "bad" && contBad < 3) {
          setTeam((prevArray) => [...prevArray, heroe]);
          setBubbles((prevArray) => [...prevArray, bubbleBad]);
        } else if (
          heroe.biography.alignment === "neutral" ||
          heroe.biography.alignment === "-"
        ) {
          setTeam((prevArray) => [...prevArray, heroe]);
          setBubbles((prevArray) => [...prevArray, bubbleNeutral]);
        }
      }
    }
  };

  return (
    <>
      {" "}
      <button className="btn btn-warning logout-btn" onClick={() => Logout()}>
        Log out
      </button>
      <Link className="btn btn-primary myteam-btn " to="/home">
        My team
      </Link>
      <div className="container-sm text-center">
        <div className="container page-img">
          <img src={logo} width="160px" />
        </div>
        <Formik
          // el searchbar inicia vacío
          initialValues={{
            search: "",
          }}
          // al enviar
          onSubmit={async (values) => {
            // limpia los heroes y el error
            setHeroes();
            setError();

            axios
              .get(
                "https://www.superheroapi.com/api.php/373807814442514/search/" +
                  values.search
              )
              .then((response) => {
                // si recive data, la sube a "heroes"
                if (response.data.results) {
                  setHeroes(response.data.results);
                }
                //  de lo contrario, sube a "error" el error
                else {
                  setError(response.data.error);
                }
              })
              .catch((error) => {
                console.log(error);
              });
          }}
        >
          {() => (
            <Form className="searchbar mx-auto">
              <div className="input-group">
                <Field
                  type="search"
                  id="search"
                  name="search"
                  className="form-control"
                  placeholder="enter a hero to search..."
                />

                <button className="btn btn-primary search-btn" type="submit">
                  Search
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
      {/* si heroes existe y la longitud es > 0  imprime todo el resultado de busqueda en forma de tabla*/}
      {heroes && heroes.length > 0 ? (
        <div className="container text-center justify-content-center">
          <div className="container-sm bubbles">
            {/* si bubbles existe y la longitud es > 0  inserta un div con los alignment del team*/}
            {bubbles && bubbles.length > 0 ? (
              <>
                {" "}
                My team alignment (max 3 good/bad): <span>({bubbles})</span>
              </>
            ) : (
              <></>
            )}
          </div>

          <div className="table-responsive">
            {/* si bubbles existe y la longitud es > 0  cambia el diseño de la tabla*/}
            <table
              className={
                bubbles && bubbles.length > 0
                  ? "table table-hover table-primary table bdr t-search"
                  : "table table-hover table-primary table bdr"
              }
            >
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Alignment</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {heroes &&
                  heroes.map((heroe) => (
                    <tr key={heroe.id}>
                      <td>
                        <img
                          className="img-hero"
                          alt={heroe.id + " " + heroe.name}
                          height="40px"
                          src={heroe.image.url}
                        />
                      </td>
                      <td>{heroe.name}</td>
                      <td
                        className={
                          heroe.biography.alignment === "good"
                            ? "goodColor"
                            : heroe.biography.alignment === "bad"
                            ? "badColor"
                            : "neutralColor"
                        }
                      >
                        {heroe.biography.alignment}
                      </td>
                      <td>
                        {/* si en el equipo ya está el heroe de la busqueda, se bloquea el botón para agregar */}
                        {team.some((el) => el.id === heroe.id) ? (
                          <button
                            id={"btn" + heroe.id}
                            disabled={true}
                            className="btn btn-primary"
                          >
                            Added
                          </button>
                        ) : (
                          <button
                            id={"btn" + heroe.id}
                            onClick={() => Load(heroe)}
                            className="btn btn-primary"
                          >
                            Add Hero
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : // de lo contrario a lo anterior y con "error" y longitud de error mayor a 0, muestra img de error
      !(heroes && heroes.length > 0) && error && error.length > 0 ? (
        <div className="container text-center">
          <img src={ilustrationError} className="il-search" />
        </div>
      ) : (
        <div className="container text-center">
          <img src={ilustration} className="il-search" />
        </div>
      )}
    </>
  );
};

export default Heroes;
