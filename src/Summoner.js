import React from "react";
import { useState, useEffect } from "react";
import { useSpring, animated } from "react-spring";
import Header from "./Components/Header";
//import { version, apiKey } from "./.env";
import "./Summoner.css";
import Match from "./Components/Match";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import WinRatePieChart from "./Components/WinRatePieChart";
import MasteryBarChart from "./Components/MasteryBarChart";
import "dotenv";
const proxyurl = "https://api.allorigins.win/raw?url=";
const version = process.env.REACT_APP_version;
const apiKey = process.env.REACT_APP_apiKey;

function Summoner(props) {
  //nothing changed
  const [summonerName, setSummonerName] = useState(props.match.params.summoner);
  const [found, setFound] = useState();
  const [loading, setLoading] = useState(true);
  const [summonerId, setSummonerId] = useState("");
  const [accountId, setAccountId] = useState("");
  const [puuId, setPuuid] = useState("");
  const [level, setLevel] = useState(1);
  const [limit, setLimit] = useState(0);
  const [avatar, setAvatar] = useState("");
  const [summonerCaseName, setSummonerCaseName] = useState();
  const [mastery, setMastery] = useState([]);
  const [matches, setMatches] = useState([[]]);
  const [parsedMastery, setParsedMastery] = useState([]);
  const [tier, setTier] = useState();
  const [wins, setWins] = useState(0);
  const [loses, setLoses] = useState(0);
  const location = useLocation();
  const winRatePieCharAniProps = useSpring({
    to: { opacity: 1 },
    from: { opacity: 0 },
  });
  //first need to set summoner's name
  //function to set summoner by summoner name
  const setSummonerByName = async (summonerName) => {
    try {
      const apiFetch = await fetch(
        proxyurl +
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
      setPuuid(summonerJSON.puuid);
      setAvatar(
        "https://ddragon.leagueoflegends.com/cdn/" +
          version +
          "/img/profileicon/" +
          summonerJSON.profileIconId +
          ".png"
      );
      setFound(true);
      setLoading(false);
      setLimit(1);
    } catch (error) {
      console.log("Cannot fetch or parse summoner");
      console.log(error);
      setFound(false);
      setLoading(false);
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
    setLoses(0);
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
    console.log(matches);
  }, [matches]);
  useEffect(() => {
    console.log("Limit has changed to " + limit);
    if (limit === 0) {
      console.log("This causes a match reload. We need to find only 10.");
      console.log("We empty the matches first.");
      setMatches([[]]);
    } else {
      fetch(
        "https://americas.api.riotgames.com/lol/match/v5/matches/by-puuid/" +
          puuId +
          "/ids?" +
          "start=" +
          (limit - 1) * 10 +
          "&count=10&" +
          "api_key=" +
          apiKey
      )
        .then((response) => response.json())
        .then((res) => {
          console.log(
            "This is a request for more data. We still have the same summoner."
          );
          console.log("***********************************");
          console.log(res);

          const newMatches = [...matches];
          newMatches.push(res);
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
  function handleResult(win) {
    if (win) {
      setWins(wins + 1);
    } else {
      setLoses(loses + 1);
    }
  }

  return (
    <div className="summoner_page">
      <Header />

      {found ? (
        <div className="summoner">
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
                      alt={tier.toLowerCase()}
                    />
                  ) : (
                    <></>
                  )}
                  <img
                    className="summoner_header_icon_profile"
                    src={avatar}
                    alt={avatar}
                  />
                  <span className="summoner_header_icon_level">{level}</span>
                </div>
              </div>

              <div className="summoner_header_left_middle">
                <div className="summoner_header_name">{summonerCaseName}</div>{" "}
              </div>
              <div className="summoner_header_left_bottom">
                <WinRatePieChart
                  data={[
                    { result: "win", value: wins },
                    { result: "lose", value: loses },
                  ]}
                />
              </div>
            </div>

            <div className="summoner_header_right">
              {parsedMastery.length > 0 ? (
                <div className="summoner_mastery">
                  <MasteryBarChart mastery={parsedMastery} />
                </div>
              ) : (
                /*                   <img
                    alt="playMore"
                    src="/image/play_more.jpg"
                    className="summoner_header_right_play_more"
                  /> */
                <div className="summoner_header_right_play_more_msg_container">
                  <p className="summoer_header_right_play_more_msg">
                    Play more to unlock your mastery scores!
                  </p>
                </div>
              )}
            </div>
          </div>
          <div className="summoner_match">
            {matches.length > 0 ? (
              matches.map((matchArray) => {
                return (
                  <div
                    className="summoner_matches_batch"
                    key={
                      matchArray.length > 0
                        ? "MatchArrayStartsWith".concat(matchArray[0].gameId)
                        : "EmptyMatchArray"
                    }
                  >
                    {matchArray ? (
                      matchArray.map((match) => (
                        <Match
                          summonerName={summonerCaseName}
                          matchId={match}
                          onResult={handleResult}
                          key={match}
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
            <div className="summoner_match_more">
              <Button color="primary" onClick={handleMore}>
                more <ExpandMoreIcon />
              </Button>
            </div>
          </div>
        </div>
      ) : loading ? (
        <div className="summoner_loading">Summoner Data Loading... </div>
      ) : (
        <div className="not_found">
          <p className="not_found_msg_summoner">
            No summoner matches the entered name...
          </p>

          <div className="not_found_button_container">
            <Button color="inherit" className="not_found_button">
              <Link
                to="/"
                style={{ color: "inherit", textDecoration: "inherit" }}
              >
                <p className="not_found_button_text">go back home</p>
              </Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Summoner;
