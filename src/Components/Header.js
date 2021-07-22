import React from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import { Link } from "react-router-dom";

import "./Header.css";
export default function Header() {
  return (
    <div>
      <AppBar position="static">
        <Toolbar className="header">
          <div className="header_left">
            <IconButton
              edge="start"
              className="header_icon"
              color="inherit"
              aria-label="menu"
            >
              <MenuIcon />
            </IconButton>
            <Button color="inherit">
              <Link
                to="/"
                style={{ color: "inherit", textDecoration: "inherit" }}
              >
                Stay Home
              </Link>
            </Button>
            <Button color="inherit">
              <Link
                to="/champions"
                style={{ color: "inherit", textDecoration: "inherit" }}
              >
                Champion
              </Link>
            </Button>
          </div>
          <div className="header_right">
            <Typography variant="h6" className="header_language">
              English
            </Typography>
          </div>
        </Toolbar>
      </AppBar>
    </div>
  );
}
