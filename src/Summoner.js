import React from "react";
import { useState, useEffect } from "react";
import Header from "./Components/Header";
import { version, apiKey } from "./credentials";
import "./Summoner.css";
import Champion from "./Components/Champion";
import Match from "./Components/Match";
import { Link, useLocation } from "react-router-dom";
import PieChart from "./Components/PieChart";
import MasteryBarChart from "./Components/MasteryBarChart";
const proxyurl = "https://api.allorigins.win/raw?url=";

function Summoner(props) {
  const [summonerName, setSummonerName] = useState(props.match.params.summoner);
  const [found, setFound] = useState();
  const [summonerId, setSummonerId] = useState("");
  const [accountId, setAccountId] = useState("");
  const [level, setLevel] = useState(1);
  const [limit, setLimit] = useState(0);
  const [avatar, setAvatar] = useState("");
  const [summonerCaseName, setSummonerCaseName] = useState();
  const [mastery, setMastery] = useState([]);
  const [matches, setMatches] = useState([[]]);
  const [parsedMastery, setParsedMastery] = useState([]);
  const [tier, setTier] = useState();
  const [wins, setWins] = useState(0);
  const location = useLocation();
  //first need to set summoner's name
  //function to set summoner by summoner name
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
      setAccountId(summonerJSON.accountId);
      setLevel(summonerJSON.summonerLevel);

      setAvatar(
        "https://ddragon.leagueoflegends.com/cdn/" +
          version +
          "/img/profileicon/" +
          summonerJSON.profileIconId +
          ".png"
      );
      setFound(true);
      setLimit(1);
    } catch (error) {
      console.log("Cannot fetch or parse summoner");
      console.log(error);
      setFound(false);
    }
  };
  //when summoner name has changed
  //initialize all the things
  useEffect(() => {
    console.log("Summoner name changed to " + summonerName);
    //this will update summoner's case name, summoner id and account id
    //and level, and avatar
    setSummonerByName(summonerName);
    setWins(0);
  }, [summonerName]);

  //when summoner id has changed
  //we need to set tier and mastery
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
  //when account id or limit has changed, we need to set matches
  useEffect(() => {
    console.log("Account ID has changed.");
    //initialize wins and limits
    setLimit(0);
  }, [accountId]);

  //parse mastery
  useEffect(() => {
    if (mastery) {
      const parsedMS = [];
      const champIdArray = mastery.map((champ) => champ.championId.toString());
      console.log(champIdArray);
      fetch(
        "https://ddragon.leagueoflegends.com/cdn/" +
          version +
          "/data/en_US/champion.json"
      )
        .then((response) => response.json())
        .then((result) => {
          //all champions
          for (let champion in result.data) {
            if (champIdArray.includes(result.data[champion].key)) {
              //console.log(`${champion}:${championsJSON.data[champion].key}`);
              parsedMS.push({
                championId: result.data[champion].key,
                championName: result.data[champion].name,
                championIcon:
                  "https://ddragon.leagueoflegends.com/cdn/" +
                  version +
                  "/img/champion/" +
                  champion +
                  ".png",
              });
            }
          }
          parsedMS.map((pms) => {
            pms.championPoints =
              mastery[champIdArray.indexOf(pms.championId)].championPoints;
          });
          setParsedMastery(
            parsedMS.sort((f, s) => s.championPoints - f.championPoints)
          );
        });
    }
  }, [mastery]);
  //when limit has changed, we need to set matches too
  useEffect(() => {
    console.log("Limit has changed to " + limit);
    if (limit === 0) {
      console.log("This causes a match reload. We need to find only 10.");
      console.log("We empty the matches first.");
      setMatches([[]]);
    } else {
      fetch(
        proxyurl +
          "https://na1.api.riotgames.com/lol/match/v4/matchlists/by-account/" +
          accountId +
          "?api_key=" +
          apiKey
      )
        .then((response) => response.json())
        .then((res) => {
          console.log(
            "This is a request for more data. We still have the same summoner."
          );
          const newMatches = [...matches];
          newMatches.push(res.matches.slice((limit - 1) * 10, limit * 10));
          console.log("We pushed new matches to existing matches");
          setMatches(newMatches);
          //console.log(matches);
        });
    }
  }, [limit]);
  useEffect(() => {
    console.log("path changed!");
    setSummonerName(props.match.params.summoner);
  }, [location]);
  useEffect(() => {
    console.log("The whole component reloaded once.");
  }, []);
  function handleMore() {
    setLimit(limit + 1);
  }
  function handleWin(champ) {
    console.log("A new win as " + champ);
    setWins(wins + 1);
  }

  return (
    <div className="summoner_page">
      <Header />

      {/*       <VisxChart
        data={[
          { result: "win", value: wins, color: "#0088FE" },
          { result: "lose", value: limit * 10 - wins, color: "#FF8042" },
        ]}
        labelKey="result"
        valueKey="value"
        colorKey="color"
      /> */}
      <div className="summoner">
        {found ? (
          <div className="summoner_header">
            <div className="summoner_header_left">
              <div className="summoner_header_left_top">
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
              </div>

              <div className="summoner_header_left_middle">
                <div className="summoner_header_name">{summonerCaseName}</div>{" "}
              </div>
              <div className="summoner_header_left_bottom">
                <PieChart
                  data={[
                    { result: "win", value: wins },
                    { result: "lose", value: limit * 10 - wins },
                  ]}
                />
              </div>
            </div>

            <div className="summoner_header_right">
              <div className="summoner_mastery">
                <MasteryBarChart mastery={parsedMastery} />
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
