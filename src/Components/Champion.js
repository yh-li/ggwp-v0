import React, { useEffect, useState } from "react";
import "./Champion.css";

//import { version } from "../credentials";
function Champion({ id, width }) {
  //get the name!
  const [thumbnail, setThumbnail] = useState(
    "https://ddragon.leagueoflegends.com/cdn/" +
      version +
      "/img/champion/" +
      "Aatrox" +
      ".png"
  );
  const allChampionsUrl =
    "https://ddragon.leagueoflegends.com/cdn/" +
    version +
    "/data/en_US/champion.json";

  const setChampionById = async (cid) => {
    try {
      const apiFetch = await fetch(allChampionsUrl);
      const championsJSON = await apiFetch.json();
      //console.log(championsJSON.data);
      for (let champion in championsJSON.data) {
        if (championsJSON.data[champion].key === cid.toString()) {
          //console.log(`${champion}:${championsJSON.data[champion].key}`);
          setThumbnail(
            "https://ddragon.leagueoflegends.com/cdn/" +
              version +
              "/img/champion/" +
              champion +
              ".png"
          );
        }
      }
      //console.log(summonerJSON.id);
    } catch (error) {
      console.log("Cannot fetch or parse all champions");
      console.log(error);
    }
  };
  useEffect(() => {
    setChampionById(parseInt(id));
    //console.log(summoner);
  }, []);

  return (
    <div>
      <img
        alt="champion"
        src={thumbnail}
        className="champ_icon"
        width={width}
        height={width}
      />
    </div>
  );
}

export default Champion;
