import Avatar from "./Components/Avatar";
import React from "react";
import { useState, useEffect } from "react";
import Header from "./Components/Header";
import { version, apiKey } from "./credentials";
import "./Summoner.css";
import Champion from "./Components/Champion";
import Match from "./Components/Match";
import { Link, useLocation } from "react-router-dom";
const proxyurl = "https://api.allorigins.win/raw?url=";

function Summoner(props) {
  const [summonerName, setSummonerName] = useState(props.match.params.summoner);
  const [found, setFound] = useState();
  const [summonerId, setSummonerId] = useState("");
  const [accountId, setAccoundId] = useState("");
  const [level, setLevel] = useState(1);
  const [avatar, setAvatar] = useState("");
  const [summonerCaseName, setSummonerCaseName] = useState();
  const [mastery, setMastery] = useState([]);
  const [matches, setMatches] = useState([]);
  const [tier, setTier] = useState();
  const location = useLocation();
  useEffect(() => {
    setSummonerName(props.match.params.summoner);
  }, [location]);

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
      setSummonerCaseName(summonerJSON.name);
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
  }, [summonerName]);

  useEffect(() => {
    if (summonerId) {
      //console.log(summonerId);
      fetch(
        proxyurl +
          "https://na1.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-summoner/" +
          summonerId +
          "?api_key=" +
          apiKey
      )
        .then((response) => response.json())
        .then((res) => {
          //console.log(res[0]);
          setMastery(res.splice(0, 10));
        });
      fetch(
        proxyurl +
          "https://na1.api.riotgames.com/lol/league/v4/entries/by-summoner/" +
          summonerId +
          "?api_key=" +
          apiKey
      )
        .then((response) => response.json())
        .then((res) => {
          if (res[0]) {
            setTier(res[0].tier);
          }
        });
    }
  }, [summonerId]);
  useEffect(() => {
    //get matches
    //console.log(accountId);
    fetch(
      proxyurl +
        "https://na1.api.riotgames.com/lol/match/v4/matchlists/by-account/" +
        accountId +
        "?api_key=" +
        apiKey
    )
      .then((response) => response.json())
      .then((res) => {
        //console.log(res.matches[0]);
        setMatches([]);
        setMatches(res.matches.splice(0, 10));
      });
  }, [accountId]);
  return (
    <div className="summoner_page">
      <Header />
      <div className="summoner">
        {found ? (
          <div className="summoner_header">
            <div className="summoner_header_left">
              <div className="summoner_header_icon">
                {tier ? (
                  <img
                    className="summoner_header_icon_border"
                    src={
                      "https://opgg-static.akamaized.net/images/borders2/" +
                      tier.toLowerCase() +
                      ".png"
                    }
                  />
                ) : (
                  <></>
                )}
                <img className="summoner_header_icon_profile" src={avatar} />
                <span className="summoner_header_icon_level">{level}</span>
              </div>
              <div className="summoner_header_stats">
                <p>{summonerCaseName}</p>
              </div>
            </div>
            <div className="summoner_header_right">
              <div className="summoner_mastery">
                <div className="summoner_mastery_msg">
                  {mastery.length > 0
                    ? "Want a higher tier? Based on your match history, here's our" +
                      "picks:"
                    : "We need more data to give pick recommendations"}
                </div>

                <div className="summoner_mastery_champs">
                  {mastery ? (
                    mastery.map((ms) => (
                      <div
                        key={ms.championId}
                        className="summoner_mastery_champion"
                      >
                        <Champion key={ms.championId} id={ms.championId} />
                      </div>
                    ))
                  ) : (
                    <div></div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <p>Summoner Loading...</p>
        )}

        <div className="summoner_matches">
          {matches ? (
            matches.map((match) => (
              <Match
                summonerName={summonerCaseName}
                matchId={match.gameId}
                key={match.gameId}
              />
            ))
          ) : (
            <p>Match Records Loading...</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Summoner;
