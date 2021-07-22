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
  const [match, setMatch] = useState();
  const [win, setWin] = useState();
  const [duration, setDuration] = useState();
  const [championId, setChampionId] = useState();
  const [championIcon, setChampionIcon] = useState();
  const [championName, setChampionName] = useState();
  const [majorRune, setMajorRune] = useState();
  const [majorRuneSys, setMajorRuneSys] = useState();
  const [majorRuneIcon, setMajorRuneIcon] = useState();
  const [subRuneSys, setSubRuneSys] = useState();
  const [subRuneIcon, setSubRuneIcon] = useState();
  const [spellD, setSpellD] = useState();
  const [spellDIcon, setSpellDIcon] = useState();
  const [spellF, setSpellF] = useState();
  const [spellFIcon, setSpellFIcon] = useState();
  const [kills, setKills] = useState();
  const [assists, setAssists] = useState();
  const [deaths, setDeaths] = useState();
  const [level, setLevel] = useState();
  const [cs, setCs] = useState();
  const [totalKills, setTotalKills] = useState();
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
        console.log(res);
        setMatch(res);
      });
  }, []);
  useEffect(() => {
    if (match) {
      for (let i = 0; i < 10; i++) {
        if (
          match.participantIdentities[i].player.summonerName === summonerName
        ) {
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
          break;
        }
      }
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
      //console.log(durationString);
    }
  }, [match]);
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
              //console.log(`${champion}:${championsJSON.data[champion].key}`);
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
  useEffect(() => {
    if (majorRune && subRuneSys) {
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
      <div className="match_stats"></div>
    </div>
  ) : (
    <p>No</p>
  );
}

export default Match;
