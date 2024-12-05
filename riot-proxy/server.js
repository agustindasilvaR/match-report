let express = require('express');
let cors = require('cors');
const axios = require('axios');

let app = express();

app.use(cors());

const API_KEY = "RGAPI-dffedfdd-9f07-4c68-9674-2ae2690e05bb";


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
    res.json(matches);
    }
})

app.listen(4000, () => {
    console.log('server is running!');
})