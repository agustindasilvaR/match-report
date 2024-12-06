let express = require('express');
let cors = require('cors');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

let app = express();

app.use(cors());

const API_KEY = "RGAPI-dffedfdd-9f07-4c68-9674-2ae2690e05bb";
// const queues = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/queues.json')));

function getPlayerPUUID(playerName, playerTag) {
    return axios.get("https://europe.api.riotgames.com" + "/riot/account/v1/accounts/by-riot-id/" + playerName + "/" + playerTag + "?api_key=" + API_KEY)
        .then(response => {
            return response.data.puuid;
        }).catch(error => {
            if(error.response && error.response.status === 503) {
                console.log('is 503')
                return getPlayerPUUID(playerName, playerTag)
            }
            console.error('Error fetching PUUID', error.message)
        });
}

// GET sumnonnerIcon
// localhost:4000/sumonnerIcon
app.get('/sumonnerIcon', async (req, res) => {

    const playerName = encodeURIComponent(req.query.sumName);
    const playerTag = encodeURIComponent(req.query.sumTag);

    // get puuid
        const PUUID =  await getPlayerPUUID(playerName, playerTag);

        if(PUUID != undefined || PUUID != '') {
            const API_CALL = "https://euw1.api.riotgames.com" + "/lol/summoner/v4/summoners/by-puuid/" + PUUID + "?api_key=" + API_KEY;
    
            console.log(API_CALL);
    
            const sumonnerData = await axios.get(API_CALL)
                .then(response => response.data.profileIconId)
                .catch(err => err)
            res.json(sumonnerData);
        }
})

app.get('/mostPlayedChampion', async (req, res) => {

    const playerName = encodeURIComponent(req.query.sumName);
    const playerTag = encodeURIComponent(req.query.sumTag)

    const PUUID =  await getPlayerPUUID(playerName, playerTag);

    if(PUUID != undefined || PUUID != '') {
        const API_CALL = "https://euw1.api.riotgames.com" + "/lol/champion-mastery/v4/champion-masteries/by-puuid/" + PUUID + "?api_key=" + API_KEY;

        const sumonnerData = await axios.get(API_CALL)
            .then(response => 
                response.data[0]
            )
            .catch(err => {
                
            })

            const championsResponse = await axios.get(`https://ddragon.leagueoflegends.com/cdn/14.23.1/data/en_US/champion.json`);
            const championsData = championsResponse.data.data;
            if(sumonnerData.championId) {
                const championName = Object.values(championsData).find(
                    champ => champ.key === JSON.stringify(sumonnerData.championId)
                )?.id;
    
                res.json(championName);
            } else {
                console.log('no hay id')
            }
    }

})

app.get('/playerMatches', async (req, res) => {
    const playerName = encodeURIComponent(req.query.sumName);
    const playerTag = encodeURIComponent(req.query.sumTag)

    const PUUID =  await getPlayerPUUID(playerName, playerTag);

    if(PUUID != undefined || PUUID != '') {
        const API_CALL = "https://europe.api.riotgames.com"+"/lol/match/v5/matches/by-puuid/" + PUUID + "/ids?api_key=" + API_KEY
        
        const matches = await axios.get(API_CALL)
        .then(response => response.data)
        .catch(err => err)


        const playerMatches = []
        for(const match of matches) {
            const API_CALL_2 = "https://europe.api.riotgames.com" +"/lol/match/v5/matches/" + match + "?api_key=" + API_KEY
            const matchData = await axios.get(API_CALL_2)
                .then(response => response.data)
                .catch(err => { throw err });

            const playerData = matchData.info.participants.find(player => player.puuid === PUUID);
            if(playerData) {

                const queueMap = {
                    0: "Custom game", 
                    400: "Normal (Draft)",
                    420: "Ranked Solo/Duo",
                    430: "Normal (Blind)",
                    440: "Ranked Flex",
                    450: "ARAM",
                    700: "Clash", 
                    1020: "One for All",
                    1400: "Ultimate Spellbook",
                    1700: "Arena (2v2v2v2)",
                    1710: "Arena (16-player lobby)",
                    1900: "URF",
                    830: "Co-op vs AI (Intro)",
                    840: "Co-op vs AI (Beginner)",
                    850: "Co-op vs AI Intermediate Bots",
                    900: "URF (All random)",
                    910: "Ascension",
                    920: "Legend of the Poro King",
                    940: "Nexus Siege",
                    950: "Doom Bots",
                    960: "Doom Bots",
                    980: "Star Guardian: Normal",
                    990: "Star Guardian: Onslaught",
                    1010: "Snow ARURF",
                    2000: "Tutorial 1",
                    2010: "Tutorial 2",
                    2020: "Tutorial 3",
                };

                function formatGameDuration(seconds) {
                    const minutes = Math.floor(seconds / 60);
                    const leftoverSeconds = seconds % 60;
                    return `${minutes}:${leftoverSeconds.toString().padStart(2, '0')}m`
                }

                
                function getGameMode(queueId) {
                    return queueMap[queueId] || "Unknown Mode";
                }

                if(playerData.win === true) {
                    playerData.win = "Victory"
                } else {
                    playerData.win = "Defeat"
                }

                playerMatches.push({
                    match,
                    champion: playerData.championName,
                    kills: playerData.kills,
                    deaths: playerData.deaths,
                    assists: playerData.assists,
                    score: `${playerData.kills}/${playerData.deaths}/${playerData.assists}`,
                    item0: playerData.item0,
                    item1: playerData.item1,
                    item2: playerData.item2,
                    item3: playerData.item3,
                    item4: playerData.item4,
                    item5: playerData.item5,
                    item6: playerData.item6,
                    win: playerData.win,
                    duration: formatGameDuration(matchData.info.gameDuration),
                    mode: getGameMode(matchData.info.queueId)
                });
            }
        }

        res.json(playerMatches);
    }
})

app.listen(4000, () => {
    console.log('server is running!');
})