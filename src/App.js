import "./App.css";
import Champions from "./Champions";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Home from "./Home";
import Summoner from "./Summoner";
import NotFound from "./NotFound";
import Game from "./Game";

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/champions" component={Champions} />
        {/* <Route exact path="/summoner" component={Summoner} /> */}
        <Route exact path="/summoners/:summoner" component={Summoner} />
        <Route exact path="/" component={Home} />
        <Route exact path="/game" component={Game} />
        <Route component={NotFound} />
      </Switch>
    </Router>
  );
}

export default App;
