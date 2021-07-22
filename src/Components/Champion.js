import React, { useEffect, useState } from "react";
import Avatar from "@material-ui/core/Avatar";

import { version } from "../credentials";
function Champion({ id }) {
  //get the name!
  const [thumbnail, setThumbnail] = useState(
    "https://ddragon.leagueoflegends.com/cdn/" +
      version +
      "/img/champion/" +
      "Aatrox" +
      ".png"
  );
  const allChampionsUrl =
    "http://ddragon.leagueoflegends.com/cdn/" +
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
    setChampionById(id);
    //console.log(summoner);
  }, []);

  return (
    <div>
      <Avatar alt="champion" src={thumbnail} />
    </div>
  );
}

export default Champion;
