import Avatar from "./Components/Avatar";
import React from "react";
import { useState, useEffect } from "react";
import Header from "./Components/Header";
import { version, apiKey } from "./credentials";
import "./Summoner.css";
import Champion from "./Components/Champion";
import Match from "./Components/Match";
const proxyurl = "https://api.allorigins.win/raw?url=";

function Summoner(props) {
  const summonerName = props.match.params.summoner;
  const [found, setFound] = useState();
  const [summonerId, setSummonerId] = useState("");
  const [accountId, setAccoundId] = useState("");
  const [level, setLevel] = useState(1);
  const [avatar, setAvatar] = useState("");
  const [summoner, setSummoner] = useState();
  const [mastery, setMastery] = useState([]);
  const [matches, setMatches] = useState([]);
  const setSummonerByName = async (summonerName) => {
    try {
      const apiFetch = await fetch(
        "https://api.allorigins.win/raw?url=" +
          "https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/" +
          summonerName +
          "?api_key=" +
          apiKey
      );
      const summonerJSON = await apiFetch.json();
      //console.log(summonerJSON.id);
      setSummonerId(summonerJSON.id);
      setAccoundId(summonerJSON.accountId);
      setLevel(summonerJSON.summonerLevel);
      //console.log(summonerJSON);
      setAvatar(
        "https://ddragon.leagueoflegends.com/cdn/" +
          version +
          "/img/profileicon/" +
          summonerJSON.profileIconId +
          ".png"
      );
      setSummoner(summonerJSON);
      setFound(true);
    } catch (error) {
      console.log("Cannot fetch or parse summoner");
      console.log(error);
      setFound(false);
    }
  };
  useEffect(() => {
    setSummonerByName(summonerName);
    //console.log(summoner);
  }, []);
  useEffect(() => {
    if (summonerId) {
      console.log(summonerId);
      fetch(
        proxyurl +
          "https://na1.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-summoner/" +
          summonerId +
          "?api_key=" +
          apiKey
      )
        .then((response) => response.json())
        .then((res) => {
          console.log(res[0]);
          setMastery(res.splice(0, 10));
        });
    }
  }, [summonerId]);
  useEffect(() => {
    //get matches
    console.log(accountId);
    fetch(
      proxyurl +
        "https://na1.api.riotgames.com/lol/match/v4/matchlists/by-account/" +
        accountId +
        "?api_key=" +
        apiKey
    )
      .then((response) => response.json())
      .then((res) => {
        console.log(res.matches[0]);
        setMatches(res.matches.splice(0, 10));
      });
  }, [accountId]);
  return (
    <div>
      <Header />
      <div className="summoner">
        {found ? (
          <div>
            <div className="summoner_header">
              <Avatar summoner={summonerName} avatarUrl={avatar} />
              <div className="summoner_header_stats">
                <p>{level}</p>
                <p>{summonerName}</p>
              </div>
            </div>
          </div>
        ) : (
          <p>False</p>
        )}
        <div className="mastery_recom">
          <h1>Our Recommendations!</h1>
        </div>
        <div className="summoner_mastery">
          {mastery ? (
            mastery.map((ms) => (
              <div className="summoner_mastery_champion">
                <Champion key={ms.championId} id={ms.championId} />
              </div>
            ))
          ) : (
            <div></div>
          )}
        </div>
        <div className="summoner_matches">
          {matches ? (
            matches.map((match) => (
              <Match
                summonerName={summonerName}
                matchId={match.gameId}
                key={match.gameId}
              />
            ))
          ) : (
            <p>No</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Summoner;
