import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import Header from "./Components/Header";

import { Button, TextField } from "@material-ui/core";
import "./Home.css";
function Home() {
  const [summoner, setSummoner] = useState("Ohoh Ophelia");
  const history = useHistory();
  const handleChange = (e) => {
    setSummoner(e.target.value);
    console.log(summoner);
  };
  const handleSearch = () => {
    //get the summoner
    if (summoner.trim() === "") setSummoner("");
    else {
      //get the route

      history.push(`/summoners/${summoner}`);
    }
  };
  return (
    <div className="home_page">
      <Header />
      <div className="home_search">
        <TextField
          className="home_search_bar"
          label="Summoner"
          style={{ margin: 8 }}
          placeholder="Ohoh Ophelia"
          margin="normal"
          onChange={handleChange}
          InputLabelProps={{
            shrink: true,
          }}
          variant="outlined"
        />
        <Button variant="contained" color="primary" onClick={handleSearch}>
          Search
        </Button>
      </div>
    </div>
  );
}

export default Home;
