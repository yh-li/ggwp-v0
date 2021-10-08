import React, { useEffect, useState } from "react";
import Header from "./Components/Header";
import Champion from "./Components/Champion";
import "./Champions.css";
const proxyurl = "https://api.allorigins.win/raw?url=";
const version = process.env.REACT_APP_version;
function Champions() {
  const [champions, setChampions] = useState({});
  useEffect(() => {
    fetch(
      proxyurl +
        "https://ddragon.leagueoflegends.com/cdn/" +
        version +
        "/data/en_US/champion.json"
    )
      .then((response) => response.json())
      .then((championsJSON) => {
        setChampions(championsJSON.data);
      });
  }, []);
  return (
    <div className="champions_page">
      <Header />
      <div className="champions_map">
        {champions ? (
          Object.keys(champions).map((c) => {
            return (
              <div className="champions_map_icon">
                <Champion key={champions[c].key} id={champions[c].key} />
              </div>
            );
          })
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}

export default Champions;
