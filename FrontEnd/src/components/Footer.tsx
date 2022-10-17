import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { ThemeContext } from "../App";
import "../stylings/footer.scss";

export default function Footer() {
  const {currTheme} = useContext(ThemeContext);
  return (
    <div className={currTheme}>
        <div className="footer bg">
        <div className="text" id="sub-title">
            LinkhedIn Corporation
        </div>
            <div className="links">
            <a className="link text" href="https://about.linkedin.com">
                About Us
            </a>
            <a className="link text" href="https://www.linkedin.com/legal/cookie-policy">
                Cookie policy
            </a>
            <a className="link text" href="https://www.linkedin.com/legal/privacy-policy?trk=content_footer-privacy-policy">
                Privacy Policy
            </a>
            <a className="link text" href="https://www.linkedin.com/legal/copyright-policy?trk=content_footer-copyright-policy">
                Copyright Policy
            </a>
            <a className="link text" href="https://www.linkedin.com/legal/user-agreement?trk=content_footer-user-agreement">
                User Agreement
            </a>
            </div>
        </div>
    </div>
  );
}