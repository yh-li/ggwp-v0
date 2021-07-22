import "./App.css";
import Header from "./Components/Header";
import Champions from "./Champions";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Home from "./Home";
import Summoner from "./Summoner";

function App() {
  return (
    <Router>
      <Route exact path="/" component={Home} />
      <Route exact path="/champions" component={Champions} />
      {/* <Route exact path="/summoner" component={Summoner} /> */}
      <Route exact path="/summoners/:summoner" component={Summoner} />
    </Router>
  );
}

export default App;
