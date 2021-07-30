import React from "react";
import { useState, useEffect } from "react";
import Header from "./Components/Header";
import { version, apiKey } from "./credentials";
import "./Summoner.css";
import Champion from "./Components/Champion";
import Match from "./Components/Match";
import { Link, useLocation } from "react-router-dom";
import PieChart from "./Components/PieChart";
const proxyurl = "https://api.allorigins.win/raw?url=";

function Summoner(props) {
  const [summonerName, setSummonerName] = useState(props.match.params.summoner);
  const [found, setFound] = useState();
  const [summonerId, setSummonerId] = useState("");
  const [accountId, setAccoundId] = useState("");
  const [level, setLevel] = useState(1);
  const [limit, setLimit] = useState(0);
  const [avatar, setAvatar] = useState("");
  const [summonerCaseName, setSummonerCaseName] = useState();
  const [mastery, setMastery] = useState([]);
  const [matches, setMatches] = useState([[]]);
  const [tier, setTier] = useState();
  const location = useLocation();
  const [wins, setWins] = useState(0);
  useEffect(() => {
    setSummonerName(props.match.params.summoner);
  }, [location]);
  function handleMore() {
    setLimit(limit + 1);
  }
  function handleWin() {
    setWins(wins + 1);
  }
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

      setSummonerCaseName(summonerJSON.name);
      setSummonerId(summonerJSON.id);
      setAccoundId(summonerJSON.accountId);
      setLevel(summonerJSON.summonerLevel);

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
  }, [summonerName]);

  useEffect(() => {
    if (summonerId) {
      fetch(
        proxyurl +
          "https://na1.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-summoner/" +
          summonerId +
          "?api_key=" +
          apiKey
      )
        .then((response) => response.json())
        .then((res) => {
          setMastery(res.slice(0, 10));
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
    fetch(
      proxyurl +
        "https://na1.api.riotgames.com/lol/match/v4/matchlists/by-account/" +
        accountId +
        "?api_key=" +
        apiKey
    )
      .then((response) => response.json())
      .then((res) => {
        setMatches([[]]);
        setMatches([res.matches.slice(0, 10)]);
      });
  }, [accountId]);
  useEffect(() => {
    fetch(
      proxyurl +
        "https://na1.api.riotgames.com/lol/match/v4/matchlists/by-account/" +
        accountId +
        "?api_key=" +
        apiKey
    )
      .then((response) => response.json())
      .then((res) => {
        const newMatches = [...matches];
        newMatches.push(res.matches.slice(limit * 10, limit * 10 + 10));
        setMatches(newMatches);
      });
  }, [limit]);
  useEffect(() => {
    //console.log(wins);
  }, [wins]);
  return (
    <div className="summoner_page">
      <Header />
      <PieChart
        data={[
          { name: "win", value: wins },
          { name: "lose", value: (limit + 1) * 10 - wins },
        ]}
      />
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
                    : "We need more data to suggest champion picks."}
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
        <div className="summoner_match">
          {matches.length > 0 ? (
            matches.map((matchArray) => {
              return (
                <div className="summoner_matches_batch" key={matchArray}>
                  {matchArray ? (
                    matchArray.map((match) => (
                      <Match
                        summonerName={summonerCaseName}
                        matchId={match.gameId}
                        onWin={handleWin}
                        key={match.gameId}
                      />
                    ))
                  ) : (
                    <p>Match Batch Loading...</p>
                  )}
                </div>
              );
            })
          ) : (
            <></>
          )}
          <div className="summoner_match_more" onClick={handleMore}>
            more
          </div>
        </div>
      </div>
    </div>
  );
}

export default Summoner;
