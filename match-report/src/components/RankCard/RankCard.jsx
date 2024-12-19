import React from "react";
import './RankCard.css'
import { Text } from "@chakra-ui/react";
import { AccordionItem, AccordionItemContent, AccordionItemTrigger, AccordionRoot } from "@chakra-ui/react";

export default function RankCard(props) {
    return(
        <div id="rank-card">
                <AccordionRoot collapsible defaultValue={["solo-duo"]} width="500px" variant={"plain"}>
                    <AccordionItem value="solo-duo">
                        <AccordionItemTrigger>Ranked Solo/Duo</AccordionItemTrigger>
                        <AccordionItemContent>
                            <div id="solo-duo">
                            <div id="rank-info">
                                <img src={`/assets/rank/Rank=${props.rank}.png`}/>
                                <div id="text">
                                    <Text fontWeight="bold" textStyle="sm">{props.rank} {props.tier}</Text>
                                    <Text fontWeight="normal" textStyle="sm">{props.leaguePoints} LP</Text>
                                </div>
                            </div>
                            <div id="wr-data">
                                <Text fontWeight="normal" textStyle="xs">{props.wins}W - {props.losses}L</Text>
                                <Text fontWeight="normal" textStyle="xs">{props.wr}% WR</Text>
                            </div>
                            </div>
                        </AccordionItemContent>
                    </AccordionItem>
                    <AccordionItem value="flex">
                        <AccordionItemTrigger>Ranked Flex</AccordionItemTrigger>
                        <AccordionItemContent>
                            <div id="solo-duo">
                            <div id="rank-info">
                                <img src={`/assets/rank/Rank=${props.rank}.png`}/>
                                <div id="text">
                                    <Text fontWeight="bold" textStyle="sm">Gold IV</Text>
                                    <Text fontWeight="normal" textStyle="sm">{props.leaguePoints} LP</Text>
                                </div>
                            </div>
                            <div id="wr-data">
                                <Text fontWeight="normal" textStyle="xs">{props.wins}W - {props.losses}L</Text>
                                <Text fontWeight="normal" textStyle="xs">{props.wr}% WR</Text>
                            </div>
                            </div>
                        </AccordionItemContent>
                    </AccordionItem>
                </AccordionRoot>
        </div>
    )
}