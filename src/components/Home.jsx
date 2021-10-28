import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import Details from "./Details";
import logo from "../resources/logo.png";
import ilustration from "../resources/home.png";

const Home = () => {
  // uso de estados:
  // team almacena el equipo
  const [team, setTeam] = useState(JSON.parse(localStorage.getItem("team")));
  // actual almacena el heroe al que se le clickea la acción "detalle"
  const [actual, setActual] = useState();
  // sum almacena los valores de las powerstats y pesos de TODO el equipo, con esto devuelve los totales y promedios
  const [sum, setSum] = useState({
    intelligence: 0,
    strength: 0,
    speed: 0,
    durability: 0,
    power: 0,
    combat: 0,
    weight: 0,
    height: 0,
    type: "",
  });

  // handleCallBack modifica "actual", sirve para modificar el valor desde un componente hijo
  const handleCallback = (childData) => {
    setActual(childData);
  };

  // el bendito useEffect, setea el equipo (trayendolo desde localStorage) y ejecuta la
  // función suma (que devuelve las sumas y promedios del equipo (si es que hay equipo cargado en localStorage))
  useEffect(() => {
    setTeam(JSON.parse(localStorage.getItem("team")));
    suma();
  }, []);

  // se setea team en localStorage para prevenir errores en el caso de que se quiera acceder a algún valor dentro de "team" y no éste no exista
  localStorage.setItem("team", JSON.stringify(team));

  // donde la magia sucede... o mejor dicho la suma y los promedios
  const suma = () => {
    let mayor = 0;
    let mayorStat = "";
    let count = 0;
    let sumKG = 0;
    let sumCM = 0;
    let promKG;
    let promCM;

    // si existe algun valor en "team"
    if (JSON.parse(localStorage.getItem("team"))[0]) {
      // por cada powerstat que haya en ese valor
      for (let pstat in JSON.parse(localStorage.getItem("team"))[0]
        .powerstats) {
        let suma = 0;

        // y por cada heroe que haya en team
        for (let key in JSON.parse(localStorage.getItem("team"))) {
          // mientras no sea nulo el powerstat del heroe actual
          if (
            !isNaN(
              parseInt(
                JSON.parse(localStorage.getItem("team"))[key].powerstats[pstat]
              )
            )
          ) {
            // suma el valor a la variable suma
            suma += parseInt(
              JSON.parse(localStorage.getItem("team"))[key].powerstats[pstat]
            );
          }
        }
        // al terminar de sumar el actual powerstate de todos los heroes,
        // se chequea si es el mayor y se setea el powerstat más alto
        if (suma > mayor) {
          mayor = suma;
          mayorStat = pstat;
        }

        // se setea la suma total del powerstate actual, en el valor del actual powerstate que está en Sum
        setSum((prevState) => {
          return { ...prevState, [pstat]: suma };
        });
      }

      // ya seteados los powerstats, ahora toca el peso y la altura...
      // por cada heroe en el equipo seteamos su peso y altura en sus respectivas variables
      // pero como el dato viene en un array con 2 unidades de medidas diferentes,
      // seteamos el index 1 porque ahí devuelve kg y cm (unidades de medidas usadas en latam)
      for (let key in JSON.parse(localStorage.getItem("team"))) {
        let kg = JSON.parse(localStorage.getItem("team"))[key].appearance
          .weight[1];
        let cm = JSON.parse(localStorage.getItem("team"))[key].appearance
          .height[1];

        // se cuentan los heroes
        count += 1;

        // se sacan los ultimos 2 caracteres de los strings (cm/kg) para poder sumarlos como int
        let kg2 = parseInt(kg.substring(0, kg.length - 2));
        let cm2 = parseInt(cm.substring(0, cm.length - 2));

        // se suman
        sumKG += kg2;
        sumCM += cm2;
      }
      // se saca el promedio dividiendo la suma total por la cantidad de heroes
      promKG = Math.trunc(sumKG / count);
      promCM = Math.trunc(sumCM / count);
    }

    // se setean: el peso, la altura y el tipo (mayor powerstat)
    setSum((prevState) => {
      return { ...prevState, weight: promKG };
    });
    setSum((prevState) => {
      return { ...prevState, height: promCM };
    });
    setSum((prevState) => {
      return { ...prevState, type: mayorStat };
    });
  };

  // Delete quita de "team" el heroe que venga desde el botón respectivo del mismo
  const Delete = (heroe) => {
    // newTeam filtra el heroe dejando todos los heroes que no sean el traído por el botón
    const newTeam = team.filter((x) => !(x.id === heroe.id));
    // se setea el nuevo team y se borra el actual para que cierre el detalle (si estaba abierto)
    setTeam(newTeam);
    setActual("");
    // se sube el team al localStorage y se llama a "suma" para generar nuevos promedios y sumas de los heroes que quedan
    localStorage.setItem("team", JSON.stringify(newTeam));
    suma();
  };

  // history instanciado para redirigir al login en caso de cerrar sesión
  const history = useHistory();
  // Logout limpia el localStorage borrando el token y redirecciona a login
  const Logout = () => {
    localStorage.clear();
    history.push("/login");
  };

  return (
    <div className="container-sm text-center">
      <div>
        <div>
          <button
            className="btn btn-warning logout-btn"
            onClick={() => Logout()}
          >
            Log out
          </button>
          <div className="container page-img">
            <img src={logo} width="160px" />
          </div>{" "}
          <Link className="btn btn-primary" to="/searcher">
            Add hero
          </Link>
          {/* si el equipo tiene heroes muestra la tabla con los heroes */}
          {team.length > 0 ? (
            <div>
              <div>
                <div className="table-responsive">
                  <table className="table table-hover table-primary table bdr">
                    <thead>
                      <tr>
                        <th className="title-table" colSpan="10">
                          Team of {sum.type} ({sum.height}cm & {sum.weight}kg
                          avg)
                        </th>
                      </tr>
                    </thead>
                    <thead>
                      <tr>
                        <th></th>
                        <th>Name</th>
                        <th>Alignment</th>
                        <th>Intelligence</th>
                        <th>Strength</th>
                        <th>Speed</th>
                        <th>Durability</th>
                        <th>Power</th>
                        <th>Combat</th>
                        <th>Actions</th>
                      </tr>
                    </thead>

                    <tbody>
                      {team.map((heroe) => (
                        <tr key={heroe.id}>
                          <td>
                            <img
                              className="img-hero"
                              alt={heroe.image.url}
                              src={heroe.image.url}
                            />
                          </td>
                          <td>{heroe.name}</td>
                          <td>{heroe.biography.alignment}</td>
                          <td>{heroe.powerstats.intelligence}</td>
                          <td>{heroe.powerstats.strength}</td>
                          <td>{heroe.powerstats.speed}</td>
                          <td>{heroe.powerstats.durability}</td>
                          <td>{heroe.powerstats.power}</td>
                          <td>{heroe.powerstats.combat}</td>
                          <td className="actions-col">
                            <button
                            className="btn btn-info "
                              onClick={() => setActual(heroe)}
                            >
                              Details
                            </button>{" "}
                            <button className="btn btn-danger "
                              onClick={() => Delete(heroe)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                      {/* si el equipo es de 2 heroes o mas, muestra una fila más con los totales */}
                      {team.length > 1 ? (
                        <tr>
                          <td colSpan="3">Total:</td>

                          <td key="inteligencia">{sum.intelligence}</td>
                          <td key="fuerza">{sum.strength}</td>
                          <td key="velocidad">{sum.speed}</td>
                          <td key="durabilidad">{sum.durability}</td>
                          <td key="poder">{sum.power}</td>
                          <td key="combate">{sum.combat}</td>
                          <td></td>
                        </tr>
                      ) : (
                        <></>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
              {/* si se presiona un botón de detalles de cualquier heroe, "actual" tendría el valor del heroe presionado*/}
              {/* actual es pasado como prop al componente hijo, si no hay actual, no se muestra el detalle (tambien se pasa 
                la función handleCallback para poder modificar el valor del componente padre desde el componente hijo) */}
              <Details val={actual} parentCallback={handleCallback} />{" "}
            </div>
          ) : (
            <div className="container">
              <img src={ilustration} className="il-home" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
