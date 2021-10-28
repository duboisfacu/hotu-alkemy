import React from "react";
import { Link, useHistory } from "react-router-dom";
import ilustration from "../resources/404.png";

const Home = () => {
 
  return (
    <div className=" text-center">
     <div>
            <img className="il-404" alt="404 not found" src={ilustration} width="160px" />
            </div>
          <Link className="btn btn-primary" to="/home">
            Back home
          </Link>
          </div>
          
  );
};

export default Home;
