import React, { useEffect } from "react";
import { useState } from "react";
import Moment from "react-moment";
import moment from "moment";
//import { apiKey } from "../credentials";
import "./Match.css";
//import { version } from "../credentials";
import { Link } from "react-router-dom";

const proxyurl = "https://api.allorigins.win/raw?url=";
const version = process.env.version;
const apiKey = process.env.apiKey;
function Match({ matchId, summonerName, onResult }) {
  //fetch match!!
  const [allies, setAllies] = useState();
  const [assists, setAssists] = useState();
  const [championIcon, setChampionIcon] = useState();
  const [championId, setChampionId] = useState();
  const [championName, setChampionName] = useState();
  const [cs, setCs] = useState();
  const [deaths, setDeaths] = useState();
  const [duration, setDuration] = useState();
  const [enemies, setEnemies] = useState();
  const [items, setItems] = useState([]);
  const [kills, setKills] = useState();
  const [level, setLevel] = useState();
  const [majorRune, setMajorRune] = useState();
  const [majorRuneIcon, setMajorRuneIcon] = useState();
  const [majorRuneSys, setMajorRuneSys] = useState();
  const [match, setMatch] = useState();
  const [mode, setMode] = useState("");
  const [ornament, setOrnament] = useState();
  const [spellD, setSpellD] = useState();
  const [spellDIcon, setSpellDIcon] = useState();
  const [spellF, setSpellF] = useState();
  const [spellFIcon, setSpellFIcon] = useState();
  const [subRuneIcon, setSubRuneIcon] = useState();
  const [subRuneSys, setSubRuneSys] = useState();
  const [team, setTeam] = useState();
  const [team100Champ, setTeam100Champ] = useState();
  const [team100Kills, setTeam100Kills] = useState();
  const [team200Champ, setTeam200Champ] = useState();
  const [team200Kills, setTeam200Kills] = useState();
  const [totalKills, setTotalKills] = useState();
  const [win, setWin] = useState();

  useEffect(() => {
    fetch(
      proxyurl +
        "https://americas.api.riotgames.com/lol/match/v5/matches/" +
        matchId +
        "?api_key=" +
        apiKey
    )
      .then((response) => response.json())
      .then((res) => {
        setMatch(res.info);
      });
  }, []);
  useEffect(() => {
    const team100 = [];
    const team200 = [];
    var team100KillsVar = 0;
    var team200KillsVar = 0;
    console.log("MATCH:");
    console.log(match);
    if (match) {
      for (let i = 0; i < match.participants.length; i++) {
        if (match.participants[i].teamId === 100) {
          //fetch champions icon url
          team100.push({
            summonerName: match.participants[i].summonerName,
            championId: match.participants[i].championId,
          });
          team100KillsVar += match.participants[i].kills;
        } else {
          team200.push({
            summonerName: match.participants[i].summonerName,
            championId: match.participants[i].championId,
          });
          team200KillsVar += match.participants[i].kills;
        }
        if (
          match.participants[i].summonerName.toUpperCase() ===
          summonerName.toUpperCase()
        ) {
          setTeam(match.participants[i].teamId);
          setWin(match.participants[i].win);
          setChampionId(match.participants[i].championId);
          //needs to fetch icons
          setMajorRune(
            match.participants[i].perks.styles[0].selections[0].perk
          );
          setMajorRuneSys(match.participants[i].perks.styles[0].style);
          setSubRuneSys(match.participants[i].perks.styles[1].style);
          setSpellD(match.participants[i].summoner1Id);
          setSpellF(match.participants[i].summoner2Id);
          setKills(match.participants[i].kills);
          setAssists(match.participants[i].assists);
          setDeaths(match.participants[i].deaths);
          setLevel(match.participants[i].champLevel);
          setCs(
            match.participants[i].totalMinionsKilled +
              match.participants[i].neutralMinionsKilled
          );
          const itemUrls = [];
          for (let j = 0; j < 6; j++) {
            const itemKey = "item".concat(j.toString());
            const itemId = match.participants[i][itemKey];
            if (itemId !== 0) {
              itemUrls.push(
                "https://ddragon.leagueoflegends.com/cdn/" +
                  version +
                  "/img/item/" +
                  itemId.toString() +
                  ".png"
              );
            } else {
              itemUrls.push("");
            }
          }
          setItems(itemUrls);
          if (match.participants[i].item6 !== 0) {
            setOrnament(
              "https://ddragon.leagueoflegends.com/cdn/" +
                version +
                "/img/item/" +
                match.participants[i].item6.toString() +
                ".png"
            );
          }
        }
      }

      //get champion icon urls
      const team100Ids = team100.map((champion) =>
        champion.championId.toString()
      );
      const team200Ids = team200.map((champion) =>
        champion.championId.toString()
      );
      fetch(
        proxyurl +
          "https://ddragon.leagueoflegends.com/cdn/" +
          version +
          "/data/en_US/champion.json"
      )
        .then((response) => response.json())
        .then((championsJSON) => {
          for (let champion in championsJSON.data) {
            if (team100Ids.includes(championsJSON.data[champion].key)) {
              team100.filter(
                (c) =>
                  c.championId.toString() === championsJSON.data[champion].key
              )[0].iconUrl =
                "https://ddragon.leagueoflegends.com/cdn/" +
                version +
                "/img/champion/" +
                champion +
                ".png";
            }
            if (team200Ids.includes(championsJSON.data[champion].key)) {
              team200.filter(
                (c) =>
                  c.championId.toString() === championsJSON.data[champion].key
              )[0].iconUrl =
                "https://ddragon.leagueoflegends.com/cdn/" +
                version +
                "/img/champion/" +
                champion +
                ".png";
            }
          }
          setTeam100Champ(team100);
          setTeam200Champ(team200);
          setTeam100Kills(team100KillsVar);
          setTeam200Kills(team200KillsVar);
          if (match.gameMode === "ARAM") {
            setMode("ARAM");
          } else if (match.gameMode === "CLASSIC") {
            setMode("Normal");
          } else if (match.gameMode.startsWith("TUTORIAL_MODULE")) {
            setMode("Tutorial");
          } else if (match.gameMode === "ULTBOOK") {
            setMode("ULTBOOK");
          } else {
            setMode(match.gameMode);
          }
        });

      var durationString = moment
        .utc(match.gameDuration * 1000)
        .format("HH:mm:ss");
      const durationHMS = durationString.split(":");
      durationString =
        parseInt(durationHMS[0]) === 0
          ? ""
          : parseInt(durationHMS[0]).toString();
      if (durationString !== "") {
        durationString = durationString.concat("h ");
      }
      durationString = durationString.concat(
        parseInt(durationHMS[1]).toString()
      );
      durationString = durationString.concat("m ");
      durationString = durationString.concat(
        parseInt(durationHMS[2]).toString()
      );
      durationString = durationString.concat("s");
      setDuration(durationString);
    }
  }, [match]);
  useEffect(() => {
    if (
      team &&
      team100Champ &&
      team200Champ &&
      team100Kills !== null &&
      team200Kills !== null
    ) {
      if (team === 100) {
        setTotalKills(team100Kills);
        setAllies(team100Champ);
        setEnemies(team200Champ);
      } else {
        setTotalKills(team200Kills);
        setAllies(team200Champ);
        setEnemies(team100Champ);
      }
    }
  }, [team, team100Champ, team200Champ, team100Kills, team200Kills]);
  useEffect(() => {
    if (championId) {
      fetch(
        proxyurl +
          "https://ddragon.leagueoflegends.com/cdn/" +
          version +
          "/data/en_US/champion.json"
      )
        .then((response) => response.json())
        .then((championsJSON) => {
          for (let champion in championsJSON.data) {
            if (championsJSON.data[champion].key === championId.toString()) {
              setChampionIcon(
                "https://ddragon.leagueoflegends.com/cdn/" +
                  version +
                  "/img/champion/" +
                  champion +
                  ".png"
              );
              setChampionName(championsJSON.data[champion].name);
            }
          }
        });
    }
  }, [championId]);
  //find all allies and enemies icons
  /*   useEffect(() => {
    if (allies && enemies) {
      const alliesIds = allies.map((ally) => ally.championId.toString());
      const enemiesIds = enemies.map((enemy) => enemy.championId.toString());
      fetch(
        proxyurl +
          "http://ddragon.leagueoflegends.com/cdn/" +
          version +
          "/data/en_US/champion.json"
      )
        .then((response) => response.json())
        .then((championsJSON) => {
          const alliesUrls = [];
          const enemiesUrls = [];
          for (let champion in championsJSON.data) {
            if (alliesIds.includes(championsJSON.data[champion].key)) {
              alliesUrls.push(
                "https://ddragon.leagueoflegends.com/cdn/" +
                  version +
                  "/img/champion/" +
                  champion +
                  ".png"
              );
            } else if (enemiesIds.includes(championsJSON.data[champion].key)) {
              enemiesUrls.push(
                "https://ddragon.leagueoflegends.com/cdn/" +
                  version +
                  "/img/champion/" +
                  champion +
                  ".png"
              );
            }
          }
          setAllyIcons(alliesUrls);
          setEnemyIcons(enemiesUrls);
        });
      console.log(allies);
      console.log(allyIcons);
    }
  }, [allies, enemies]); */
  useEffect(() => {
    if (majorRune && subRuneSys) {
      //console.log(majorRune);
      fetch(
        "https://ddragon.leagueoflegends.com/cdn/" +
          version +
          "/data/en_US/runesReforged.json"
      )
        .then((res) => res.json())
        .then((runesJSON) => {
          for (let i = 0; i < runesJSON.length; i++) {
            if (runesJSON[i].id === subRuneSys) {
              setSubRuneIcon(
                "https://ddragon.canisback.com/img/" + runesJSON[i].icon
              );
              break;
            }
          }
          for (let i = 0; i < runesJSON.length; i++) {
            if (runesJSON[i].id === majorRuneSys) {
              const slots = runesJSON[i].slots;
              for (let j = 0; j < slots.length; j++) {
                const runes = slots[j].runes;
                for (let k = 0; k < runes.length; k++) {
                  if (runes[k].id === majorRune) {
                    setMajorRuneIcon(
                      "https://ddragon.canisback.com/img/" + runes[k].icon
                    );
                    return;
                  }
                }
              }
            }
          }
        });
    }
  }, [majorRune, subRuneSys]);
  useEffect(() => {
    if (spellD && spellF) {
      fetch(
        "https://ddragon.leagueoflegends.com/cdn/" +
          version +
          "/data/en_US/summoner.json"
      )
        .then((res) => res.json())
        .then((summonerJSON) => {
          for (const spellKey in summonerJSON.data) {
            if (summonerJSON.data[spellKey].key === spellD.toString()) {
              setSpellDIcon(
                "https://ddragon.leagueoflegends.com/cdn/" +
                  version +
                  "/img/spell/" +
                  summonerJSON.data[spellKey].id +
                  ".png"
              );
            } else if (summonerJSON.data[spellKey].key === spellF.toString()) {
              setSpellFIcon(
                "https://ddragon.leagueoflegends.com/cdn/" +
                  version +
                  "/img/spell/" +
                  summonerJSON.data[spellKey].id +
                  ".png"
              );
            }
          }
        });
    }
  }, [spellD, spellF]);
  useEffect(() => {
    if (win != undefined && win != null) {
      onResult(win);
    }
  }, [win]);
  return match ? (
    <div
      className="match"
      style={
        win ? { backgroundColor: "#a3cfec" } : { backgroundColor: "#e2b6b3" }
      }
    >
      <div className="match_result">
        <p className="match_result_mode">{mode ? mode : "Mode Loading"}</p>
        <Moment className="match_result_timestamp" fromNow>
          {match.gameCreation}
        </Moment>
        <hr className="match_result_rule"></hr>
        {win ? (
          <p style={{ color: "#1a78ae" }} className="match_result_win">
            Victory
          </p>
        ) : (
          <p style={{ color: "#c6443e" }} className="match_result_lose">
            Defeat
          </p>
        )}
        <p className="match_result_duration">{duration}</p>
      </div>
      <div iv className="match_sum">
        <div className="match_sum_champion">
          <img
            src={championIcon}
            className="match_sum_champion_icon"
            alt={championIcon}
          />
          <div className="match_sum_champion_name">{championName}</div>
        </div>
        <div className="match_sum_spells">
          <div className="match_sum_spell">
            <img
              src={spellDIcon}
              className="match_sum_spell_icon"
              alt={spellDIcon}
            />
          </div>
          <div className="match_sum_spell">
            <img
              src={spellFIcon}
              className="match_sum_spell_icon"
              alt={spellFIcon}
            />
          </div>
        </div>
        <div className="match_sum_runes">
          <div className="match_sum_rune">
            {majorRuneIcon ? (
              <img
                src={majorRuneIcon}
                className="match_sum_rune_icon"
                alt="majorRuneIcon"
              />
            ) : (
              <></>
            )}
          </div>
          <div className="match_sum_rune">
            {subRuneIcon ? (
              <img
                src={subRuneIcon}
                className="match_sum_rune_icon"
                alt="subRuneIcon"
              />
            ) : (
              <></>
            )}
          </div>{" "}
        </div>
      </div>
      {assists !== null && kills !== null && deaths !== null ? (
        <div className="match_kda">
          <div className="match_kda_sep">
            <span className="match_kda_k">{kills}</span> &nbsp;/&nbsp;
            <span className="match_kda_d">{deaths}</span> &nbsp;/&nbsp;
            <span className="match_kda_a">{assists}</span>
          </div>
          <div className="match_kda_sum">
            {deaths === 0
              ? "Perfect"
              : ((kills + assists) / deaths)
                  .toFixed(2)
                  .toString()
                  .concat(" : 1")}{" "}
            KDA
          </div>
        </div>
      ) : (
        <div className="match_kda">No KDA Stats Available</div>
      )}
      <div className="match_stats">
        <div className="match_stats_level">Level {level}</div>
        <div className="match_stats_cs">{cs} CS</div>
        <div className="match_stats_p_kills">
          P/Kill {Math.round(((kills + assists) * 100) / totalKills)}%
        </div>
      </div>
      <div className="match_items">
        <div className="match_equip">
          <div className="match_equip_top">
            <div className="img_container">
              {items[0] ? (
                <img className="equip_img" src={items[0]} alt="item1" />
              ) : (
                <></>
              )}
            </div>

            <div className="img_container">
              {items[1] ? (
                <img className="equip_img" src={items[1]} alt="item2" />
              ) : (
                <></>
              )}
            </div>
            <div className="img_container">
              {items[2] ? (
                <img className="equip_img" src={items[2]} alt="item3" />
              ) : (
                <></>
              )}
            </div>
          </div>
          <div className="match_equip_bottom">
            <div className="img_container">
              {items[3] ? (
                <img className="equip_img" src={items[3]} alt="item4" />
              ) : (
                <></>
              )}
            </div>
            <div className="img_container">
              {items[4] ? (
                <img className="equip_img" src={items[4]} alt="item5" />
              ) : (
                <></>
              )}
            </div>
            <div className="img_container">
              {items[5] ? (
                <img className="equip_img" src={items[5]} alt="item6" />
              ) : (
                <></>
              )}
            </div>
          </div>
        </div>

        <div className="match_ornament">
          <div className="img_container">
            {ornament ? (
              <img className="equip_img" src={ornament} alt="ornament" />
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
      {allies && enemies ? (
        <div className="match_teams">
          <div className="match_allies">
            {allies?.map((a) => (
              <div className="match_teams_player">
                <img
                  key={a.summonerName}
                  src={a.iconUrl}
                  alt={a.championId}
                  style={
                    a.summonerName === summonerName
                      ? { borderRadius: "100%" }
                      : {}
                  }
                  className="match_teams_player_icon"
                />
                <Link
                  to={"/summoners/".concat(a.summonerName)}
                  style={{ color: "inherit", textDecoration: "inherit" }}
                >
                  <p className="match_teams_player_name">{a.summonerName}</p>
                </Link>
              </div>
            ))}
          </div>
          <div className="match_enemies">
            {enemies?.map((e) => (
              <div className="match_teams_player">
                <img
                  key={e.summonerName}
                  src={e.iconUrl}
                  alt={e.championId}
                  className="match_teams_player_icon"
                />
                <Link
                  to={"/summoners/".concat(e.summonerName)}
                  style={{ color: "inherit", textDecoration: "inherit" }}
                >
                  <p className="match_teams_player_name">{e.summonerName}</p>
                </Link>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <></>
      )}
    </div>
  ) : (
    <p>Match Records Loading ...</p>
  );
}

export default Match;
