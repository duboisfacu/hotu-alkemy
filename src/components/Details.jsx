import React, { Component } from "react";
import pixel from "../resources/pixel.png";

class Details extends Component {
  // función que permite llamar a la función del elemento padre para modificar valor de estado
  onTrigger = (event) => {
    this.props.parentCallback(undefined);
    event.preventDefault();
  };

  render() {
    // data va a ser igual al heroe al que se le dió click en su botón de detalles
    let data = this.props.val;

    return (
      <div>
        {" "}
        {/* esto es tan simple como: si hay data, mostrame el div, sino no me muestres nada */}
        {this.props.val ? (
          <div className="modal-dialog details">
            <div className="modal-content">
              <div className="d-flex justify-content-start">
                <div className="mr-auto p-2">
                  <h3>{data.name}</h3>
                  <br />
                  <img
                    className="img-hero big"
                    alt={data.image.url}
                    src={data.image.url}
                  />

                  <br />
                  <br />
                  {/* al clickear Close, llama a la función que modifica el estado del padre */}
                  <button className="btn btn-danger" onClick={this.onTrigger}>
                    Close
                  </button>
                </div>
                <div className="mr-auto p-2 text-left">
                  {" "}
                  <img alt="separator" src={pixel} width="3px" height="300px" />
                </div>
                <div className="mr-auto p-2 text-left">
                  <br />
                  <p>Full name: {data.biography["full-name"]}</p>
                  <p>Alias: {data.biography.aliases.toString()}</p>
                  <p>Weight: {data.appearance.weight[1]}</p>
                  <p>Height: {data.appearance.height[1]}</p>
                  <p>Eye color: {data.appearance["eye-color"]}</p>
                  <p>Hair color : {data.appearance["hair-color"]}</p>
                  <p>Workplace: {data.work.base.toString()}</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <></>
        )}
      </div>
    );
  }
}
export default Details;
