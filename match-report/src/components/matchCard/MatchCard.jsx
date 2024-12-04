import React  from "react";
import { Text } from "@chakra-ui/react";
import './MatchCard.css';

export default function MatchCard(props) {


    return(

        <div>
            <div id="match-card">
                <div id="champion">
                    <div id="champion-icon"></div>
                    <div id="info">
                        <Text fontWeight="bold" textStyle="sm">{props.championName}</Text>
                        <Text textStyle="2xs">{props.gameMode}</Text>
                        <Text textStyle="2xs">{props.time}</Text>
                    </div>
                </div>
                <div id="items">
                    <div className='item' id="item1"></div>
                    <div className='item' id="item2"> </div>
                    <div className='item' id="item3"></div>
                    <div className='item' id="item4"></div>
                    <div className='item' id="item5"></div>
                    <div className='item' id="item6"></div>
                </div>
                <div className='item' id="trinket"></div>
                <Text>{props.kda}</Text>
                <Text id="result" fontWeight="bold">{props.result}</Text>
            </div>
        </div>

    )

}