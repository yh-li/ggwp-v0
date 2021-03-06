import React, { useEffect } from "react";
import { useState } from "react";
import Moment from "react-moment";
import moment from "moment";
import { apiKey } from "../credentials";
import "./Match.css";
import Champion from "./Champion";
import { version } from "../credentials";
import Avatar from "@material-ui/core/Avatar";
const proxyurl = "https://api.allorigins.win/raw?url=";
function Match({ matchId, summonerName }) {
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
        "https://na1.api.riotgames.com/lol/match/v4/matches/" +
        matchId +
        "?api_key=" +
        apiKey
    )
      .then((response) => response.json())
      .then((res) => {
        setMatch(res);
      });
  }, []);
  useEffect(() => {
    const team100 = [];
    const team200 = [];
    var team100KillsVar = 0;
    var team200KillsVar = 0;
    if (match) {
      for (let i = 0; i < 10; i++) {
        //console.log(match.participants[i]);
        if (match.participants[i].teamId === 100) {
          //fetch champions icon url
          team100.push({
            summonerName: match.participantIdentities[i].player.summonerName,
            championId: match.participants[i].championId,
          });
          team100KillsVar += match.participants[i].stats.kills;
        } else {
          team200.push({
            summonerName: match.participantIdentities[i].player.summonerName,
            championId: match.participants[i].championId,
          });
          team200KillsVar += match.participants[i].stats.kills;
        }
        if (
          match.participantIdentities[i].player.summonerName.toUpperCase() ===
          summonerName.toUpperCase()
        ) {
          setTeam(match.participants[i].teamId);
          setWin(
            match.participants[match.participantIdentities[i].participantId - 1]
              .stats.win
          );
          setChampionId(
            match.participants[match.participantIdentities[i].participantId - 1]
              .championId
          );
          //needs to fetch icons
          setMajorRune(
            match.participants[match.participantIdentities[i].participantId - 1]
              .stats.perk0
          );
          setMajorRuneSys(
            match.participants[match.participantIdentities[i].participantId - 1]
              .stats.perkPrimaryStyle
          );
          setSubRuneSys(
            match.participants[match.participantIdentities[i].participantId - 1]
              .stats.perkSubStyle
          );
          setSpellD(
            match.participants[match.participantIdentities[i].participantId - 1]
              .spell1Id
          );
          setSpellF(
            match.participants[match.participantIdentities[i].participantId - 1]
              .spell2Id
          );
          setKills(
            match.participants[match.participantIdentities[i].participantId - 1]
              .stats.kills
          );
          setAssists(
            match.participants[match.participantIdentities[i].participantId - 1]
              .stats.assists
          );
          setDeaths(
            match.participants[match.participantIdentities[i].participantId - 1]
              .stats.deaths
          );
          setLevel(
            match.participants[match.participantIdentities[i].participantId - 1]
              .stats.champLevel
          );
          setCs(
            match.participants[i].stats.totalMinionsKilled +
              match.participants[i].stats.neutralMinionsKilled
          );
          const itemUrls = [];
          for (let j = 0; j < 6; j++) {
            const itemKey = "item".concat(j.toString());
            const itemId =
              match.participants[
                match.participantIdentities[i].participantId - 1
              ].stats[itemKey];
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
          setOrnament(
            "https://ddragon.leagueoflegends.com/cdn/" +
              version +
              "/img/item/" +
              match.participants[i].stats.item6.toString() +
              ".png"
          );
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
          "http://ddragon.leagueoflegends.com/cdn/" +
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
              //console.log(team100);
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
          "http://ddragon.leagueoflegends.com/cdn/" +
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
      console.log(majorRune);
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
        "http://ddragon.leagueoflegends.com/cdn/" +
          version +
          "/data/en_US/summoner.json"
      )
        .then((res) => res.json())
        .then((summonerJSON) => {
          for (const spellKey in summonerJSON.data) {
            if (summonerJSON.data[spellKey].key === spellD.toString()) {
              setSpellDIcon(
                "http://ddragon.leagueoflegends.com/cdn/" +
                  version +
                  "/img/spell/" +
                  summonerJSON.data[spellKey].id +
                  ".png"
              );
            } else if (summonerJSON.data[spellKey].key === spellF.toString()) {
              setSpellFIcon(
                "http://ddragon.leagueoflegends.com/cdn/" +
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
  return match ? (
    <div
      className="match"
      style={
        win ? { backgroundColor: "#a2dbfa" } : { backgroundColor: "#ffdada" }
      }
    >
      <div className="match_result">
        <p>{match.gameMode}</p>
        <Moment fromNow>{match.gameCreation}</Moment>
        <hr></hr>
        {win ? <p>Victory</p> : <p>Defeat</p>}
        <p>{duration}</p>
      </div>
      <div className="match_player">
        <div className="match_player_icons">
          <Avatar alt={championName} src={championIcon} />

          <div className="match_player_summoner_spell">
            <Avatar alt={spellD} src={spellDIcon} />
            <Avatar alt={spellF} src={spellFIcon} />
          </div>
          <div className="match_player_runes">
            <Avatar
              alt={majorRuneSys}
              src={majorRuneIcon}
              style={{ backgroundColor: "black" }}
            />
            <Avatar alt={subRuneSys} src={subRuneIcon} />
          </div>
        </div>
        <p>{championName}</p>
      </div>
      {assists !== null && kills !== null && deaths !== null ? (
        <div className="match_kda">
          <div className="match_kda_sep">
            {kills} / {deaths} / {assists}
          </div>
          <div className="match_kda_sum">
            {((kills + assists) / deaths).toFixed(2)} : 1 KDA
          </div>
        </div>
      ) : (
        <div></div>
      )}
      <div className="match_stats">
        <div className="match_stats_level">
          <p>Level {level}</p>
        </div>
        <div className="match_stats_cs">{cs} CS</div>
        <div className="match_stats_p_kills">
          P/Kill {((kills + assists) / totalKills).toFixed(2) * 100}%
        </div>
      </div>
      <div className="match_items">
        <div className="match_equip">
          <div className="match_equip_top">
            <div className="img_container">
              {items[0] ? <img className="equip_img" src={items[0]} /> : <></>}
            </div>

            <div className="img_container">
              {items[1] ? <img className="equip_img" src={items[1]} /> : <></>}
            </div>
            <div className="img_container">
              {items[2] ? <img className="equip_img" src={items[2]} /> : <></>}
            </div>
          </div>
          <div className="match_equip_bottom">
            <div className="img_container">
              {items[3] ? <img className="equip_img" src={items[3]} /> : <></>}
            </div>
            <div className="img_container">
              {items[4] ? <img className="equip_img" src={items[4]} /> : <></>}
            </div>
            <div className="img_container">
              {items[5] ? <img className="equip_img" src={items[5]} /> : <></>}
            </div>
          </div>
        </div>

        <div className="match_ornament">
          <div className="img_container">
            <Avatar src={ornament} alt="ornament" variant="square" />
          </div>
        </div>
        {allies && enemies ? (
          <div className="match_teams">
            <div className="match_allies">
              {allies?.map((a) => (
                <div className="match_teams_player">
                  <Avatar
                    key={a.summonerName}
                    src={a.iconUrl}
                    alt={a.championId}
                    variant={a.summonerName === summonerName ? "" : "square"}
                  />
                  <p className="match_teams_player_name">{a.summonerName}</p>
                </div>
              ))}
            </div>
            <div className="match_enemies">
              {enemies?.map((e) => (
                <div className="match_teams_player">
                  <Avatar
                    key={e.summonerName}
                    src={e.iconUrl}
                    alt={e.championId}
                    variant="square"
                  />
                  <p className="match_teams_player_name">{e.summonerName}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  ) : (
    <p>No</p>
  );
}

export default Match;
