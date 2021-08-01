import React from "react";
import Header from "./Components/Header";
import { Link } from "react-router-dom";
import { Button } from "@material-ui/core";
import "./NotFound.css";
function NotFound() {
  return (
    <div className="not_found_page">
      <Header />
      <div className="not_found">
        <p className="not_found_void_msg">You've entered the VOID...</p>
        <div className="not_found_button_container">
          <Button className="not_found_button">
            <Link
              to="/"
              style={{ color: "inherit", textDecoration: "inherit" }}
            >
              <p className="not_found_button_text">go back home</p>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
