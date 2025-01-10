import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGithub } from '@fortawesome/free-brands-svg-icons'
import './Footer.css'

export default function Footer() {
    return(
        <div id="footer">
            <FontAwesomeIcon icon={faGithub}/><a href="https://github.com/agustindasilvaR/match-report" target="_blank">agustindasilvaR/match-report</a>
        </div>
    )
}