import React  from "react";
import { Text } from "@chakra-ui/react";
import './MatchCard.css';

export default function MatchCard(props) {

    const resultTextStyle = {
        color: props.result === 'Victory' ? 'rgb(100,112,194)' : 'rgb(253,119,119)', // Azul si es Victory, rojo en otro caso
    };

    const resultFlagStyle = {
        borderLeft: props.result === 'Victory' ? '12px solid rgb(100,112,194)' : '12px solid rgb(253,119,119)'
    };


    return(

        <div>
            <div id="match-card" style={resultFlagStyle}>
                <div id="champion">
                    <div id="champion-icon"><img src={props.championIcon} /></div>
                    <div id="info">
                        <Text fontWeight="bold" textStyle="sm">{props.championName}</Text>
                        <Text textStyle="2xs">{props.gameMode}</Text>
                        <Text textStyle="2xs">{props.time}</Text>
                    </div>
                </div>
                <div id="items">
                    <div className='item' id="item1">
                        {props.item0Src && !props.item0Src.includes('/0.png') && <img src={props.item0Src} />}
                    </div>
                    <div className='item' id="item2">
                        {props.item1Src && !props.item1Src.includes('/0.png') && <img src={props.item1Src} />}
                    </div>
                    <div className='item' id="item3">
                        {props.item2Src && !props.item2Src.includes('/0.png') && <img src={props.item2Src} />}
                    </div>
                    <div className='item' id="item4">
                        {props.item3Src && !props.item3Src.includes('/0.png') && <img src={props.item3Src} />}
                    </div>
                    <div className='item' id="item5">
                        {props.item4Src && !props.item4Src.includes('/0.png') && <img src={props.item4Src} />}
                    </div>
                    <div className='item' id="item6">
                        {props.item5Src && !props.item5Src.includes('/0.png') && <img src={props.item5Src} />}
                    </div>
                 </div>
                <div className='item' id="trinket">
                    {props.trinketSrc && !props.trinketSrc.includes('/0.png') && <img src={props.trinketSrc} />}
                </div>
                <div id="kda">
                    <Text>{props.kda}</Text>
                </div>
                <div id="result">
                    <Text id="result" fontWeight="bold" style={resultTextStyle}>{props.result}</Text>
                </div>
            </div>
        </div>

    )

}