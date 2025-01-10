import React  from "react";
import { Text } from "@chakra-ui/react";
import { Tooltip } from "react-tooltip";
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
                    <Tooltip id="itemName1"/>
                            {props.item0Src && !props.item0Src.includes('/0.png') && <img src={props.item0Src} data-tooltip-id="itemName1" data-tooltip-content={props.itemName1} data-tooltip-place="top"/>}
                    </div>
                    <div className='item' id="item2">
                    <Tooltip id="itemName2" />
                        {props.item1Src && !props.item1Src.includes('/0.png') && <img src={props.item1Src} data-tooltip-id="itemName2" data-tooltip-content={props.itemName2} data-tooltip-place="top"/>}
                    </div>
                    <div className='item' id="item3">
                    <Tooltip id="itemName3" />
                        {props.item2Src && !props.item2Src.includes('/0.png') && <img src={props.item2Src} data-tooltip-id="itemName3" data-tooltip-content={props.itemName3} data-tooltip-place="top"/>}
                    </div>
                    <div className='item' id="item4">
                    <Tooltip id="itemName4" />
                        {props.item3Src && !props.item3Src.includes('/0.png') && <img src={props.item3Src} data-tooltip-id="itemName4" data-tooltip-content={props.itemName4} data-tooltip-place="bottom"/>}
                    </div>
                    <div className='item' id="item5">
                    <Tooltip id="itemName5" />
                        {props.item4Src && !props.item4Src.includes('/0.png') && <img src={props.item4Src} data-tooltip-id="itemName5" data-tooltip-content={props.itemName5} data-tooltip-place="bottom"/>}
                    </div>
                    <div className='item' id="item6">
                    <Tooltip id="itemName6" />
                        {props.item5Src && !props.item5Src.includes('/0.png') && <img src={props.item5Src} data-tooltip-id="itemName6" data-tooltip-content={props.itemName6} data-tooltip-place="bottom"/>}
                    </div>
                 </div>
                <div className='item' id="trinket">
                    <Tooltip id="trinketName" delayShow={300} />
                    {props.trinketSrc && !props.trinketSrc.includes('/0.png') && <img src={props.trinketSrc} data-tooltip-id="trinketName" data-tooltip-content={props.trinketName} />}
                </div>
                <div id="kda">
                    <Text>{props.kda}</Text>
                    <Text textStyle="xs">{props.minions} CS</Text>
                </div>
                <div id="result">
                    <Text id="result" fontWeight="bold" style={resultTextStyle}>{props.result}</Text>
                </div>
            </div>
        </div>

    )

}