let express = require('express');
let cors = require('cors');
const axios = require('axios');


let app = express();

app.use(cors());

const API_KEY = process.env.API_KEY;

let championNameMap = {};
let itemData = {}
const regionMapping = {
    EUW: { global: "europe", specific: "euw1" },
    EUNE: { global: "europe", specific: "eun1" },
    NA: { global: "americas", specific: "na1" },
    LAN: { global: "americas", specific: "la1" },
    LAS: { global: "americas", specific: "la2" },
    BR: { global: "americas", specific: "br1" },
    KR: { global: "asia", specific: "kr" },
    JP: { global: "asia", specific: "jp1" },
    OCE: { global: "sea", specific: "oc1" },
    TR: { global: "europe", specific: "tr1" },
    PH: { global: "sea", specific: "ph2" },
    SG: { global: "sea", specific: "sg2" },
    TH: { global: "sea", specific: "th2" },
    TW: { global: "sea", specific: "tw2" },
    VN: { global: "sea", specific: "vn2" },
    ME: { global: "asia", specific: "me" }
};


const getCurrentVersion = async () => {
    try {
        const response = await fetch('https://ddragon.leagueoflegends.com/api/versions.json');
        const versions = await response.json();
        return versions[0];
    } catch (error) {
        console.error('Error al obtener la versión actual:', error);
        throw error;
    }
};

const loadChampionData = async () => {
    try {
        const currentVersion = await getCurrentVersion(); 
        const response = await axios.get(`https://ddragon.leagueoflegends.com/cdn/${currentVersion}/data/en_US/champion.json`);
        const champions = response.data.data;

        for (const champKey in champions) {
            const champion = champions[champKey];
            championNameMap[champion.id] = champion.name;
        }
        console.log('Champion data loaded successfully.');
    } catch (error) {
        console.error('Error loading champion data:', error);
    }
};

const fetchItemData = async (version) => {
    const currentVersion = await getCurrentVersion();
    const response = await fetch(`https://ddragon.leagueoflegends.com/cdn/${currentVersion}/data/en_GB/item.json`);
    const data = await response.json();
    itemData = data.data
    return data.data;
  };



loadChampionData();
fetchItemData();

async function getPlayerPUUID(playerName, playerTag, region) {
    const regionMapping = {
        EUW: { global: "europe", specific: "euw1" },
        EUNE: { global: "europe", specific: "eun1" },
        NA: { global: "americas", specific: "na1" },
        LAN: { global: "americas", specific: "la1" },
        LAS: { global: "americas", specific: "la2" },
        BR: { global: "americas", specific: "br1" },
        KR: { global: "asia", specific: "kr" },
        JP: { global: "asia", specific: "jp1" },
        OCE: { global: "sea", specific: "oc1" },
        TR: { global: "europe", specific: "tr1" },
        PH: { global: "sea", specific: "ph2" },
        SG: { global: "sea", specific: "sg2" },
        TH: { global: "sea", specific: "th2" },
        TW: { global: "sea", specific: "tw2" },
        VN: { global: "sea", specific: "vn2" },
        ME: { global: "asia", specific: "me" }
    };

    // Verifica si la región existe en el mapeo
    const selectedRegion = regionMapping[region];
    if (!selectedRegion) {
        throw new Error("Invalid region provided");
    }

    const globalRegion = selectedRegion.global;
    const apiUrl = `https://${globalRegion}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${playerName}/${playerTag}?api_key=${API_KEY}`;

    let attempts = 0; // Contador de intentos
    const maxAttempts = 3; // Límite de reintentos en caso de errores 503

    while (attempts < maxAttempts) {
        try {
            const response = await axios.get(apiUrl);
            // Retorna un objeto con gameName y puuid si la solicitud fue exitosa
            return {
                gameName: response.data.gameName,
                puuid: response.data.puuid,
            };
        } catch (error) {
            attempts++;
            // Maneja errores específicos
            if (error.response) {
                if (error.response.status === 404) {
                    throw new Error("Player not found: Invalid player name or tag");
                }
                if (error.response.status === 503) {
                    console.warn(`Service unavailable (503). Retrying (${attempts}/${maxAttempts})...`);
                    if (attempts >= maxAttempts) {
                        throw new Error("Service unavailable after multiple retries");
                    }
                    await new Promise(resolve => setTimeout(resolve, 1000)); // Espera 1 segundo antes de reintentar
                    continue; // Reintenta la solicitud
                }
            }
            // Manejo de otros errores (por ejemplo, problemas de red)
            console.error("Error fetching PUUID:", error.message);
            throw new Error("An unexpected error occurred while fetching PUUID");
        }
    }

    // Si se supera el número máximo de intentos, lanza un error
    throw new Error("Unable to fetch PUUID after multiple retries");
}




app.get('/sumonnerIcon', async (req, res) => {
    const playerName = encodeURIComponent(req.query.sumName);
    const playerTag = encodeURIComponent(req.query.sumTag);
    const region = req.query.region;

    const regionMapping = {
        EUW: { global: "europe", specific: "euw1" },
        EUNE: { global: "europe", specific: "eun1" },
        NA: { global: "americas", specific: "na1" },
        LAN: { global: "americas", specific: "la1" },
        LAS: { global: "americas", specific: "la2" },
        BR: { global: "americas", specific: "br1" },
        KR: { global: "asia", specific: "kr" },
        JP: { global: "asia", specific: "jp1" },
        OCE: { global: "sea", specific: "oc1" },
        TR: { global: "europe", specific: "tr1" },
        PH: { global: "sea", specific: "ph2" },
        SG: { global: "sea", specific: "sg2" },
        TH: { global: "sea", specific: "th2" },
        TW: { global: "sea", specific: "tw2" },
        VN: { global: "sea", specific: "vn2" },
        ME: { global: "asia", specific: "me" }
    };

    // Verifica si la región existe en el mapeo
    const selectedRegion = regionMapping[region];
    if (!selectedRegion) {
        return res.status(400).json({ error: "Invalid region" });
    }

    const globalRegion = selectedRegion.global;
    const specificRegion = selectedRegion.specific;

    try {
        const PUUID = await getPlayerPUUID(playerName, playerTag, region);
        console.log(PUUID.puuid);
        console.log(PUUID.gameName);

        if (PUUID && PUUID.puuid) {
            const API_CALL = `https://${specificRegion}.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${PUUID.puuid}?api_key=${API_KEY}`;
            console.log(API_CALL);

            const summonerData = await axios
                .get(API_CALL)
                .then(response => response.data)
                .catch(err => {
                    console.error("Error fetching summoner data:", err.message);
                    return null;
                });

            if (summonerData) {
                // Agrega el campo gameName al objeto summonerData
                summonerData.gameName = PUUID.gameName;

                console.log(summonerData);
                return res.json(summonerData);
            } else {
                return res.status(404).json({ error: "Summoner data not found" });
            }
        } else {
            return res.status(400).json({ error: "Invalid PUUID" });
        }
    } catch (error) {
        console.error("Error:", error.message);
        return res.status(500).json({ error: "Internal server error" });
    }
});


app.get('/mostPlayedChampion', async (req, res, next) => {
    try {
        const playerName = encodeURIComponent(req.query.sumName);
        const playerTag = encodeURIComponent(req.query.sumTag);
        const region = req.query.region;

        // Verifica si la región existe en el mapeo
        const regionMapping = {
            EUW: { global: "europe", specific: "euw1" },
            EUNE: { global: "europe", specific: "eun1" },
            NA: { global: "americas", specific: "na1" },
            LAN: { global: "americas", specific: "la1" },
            LAS: { global: "americas", specific: "la2" },
            BR: { global: "americas", specific: "br1" },
            KR: { global: "asia", specific: "kr" },
            JP: { global: "asia", specific: "jp1" },
            OCE: { global: "sea", specific: "oc1" },
            TR: { global: "europe", specific: "tr1" },
            PH: { global: "sea", specific: "ph2" },
            SG: { global: "sea", specific: "sg2" },
            TH: { global: "sea", specific: "th2" },
            TW: { global: "sea", specific: "tw2" },
            VN: { global: "sea", specific: "vn2" },
            ME: { global: "asia", specific: "me" }
        };

        const selectedRegion = regionMapping[region];
        if (!selectedRegion) {
            return res.status(400).json({ error: "Invalid region provided" });
        }

        const globalRegion = selectedRegion.global;
        const specificRegion = selectedRegion.specific;

        // Intenta obtener el PUUID del jugador
        const PUUID = await getPlayerPUUID(playerName, playerTag, region);
        if (!PUUID || !PUUID.puuid) {
            return res.status(404).json({ error: "Player not found" });
        }

        // Realiza la llamada a la API para obtener el campeón más jugado
        const API_CALL = `https://${specificRegion}.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-puuid/${PUUID.puuid}?api_key=${API_KEY}`;
        const sumonnerData = await axios.get(API_CALL)
            .then(response => response.data[0]) // Obtiene el campeón más jugado
            .catch(err => {
                throw new Error("Error fetching champion mastery data");
            });

        if (!sumonnerData || !sumonnerData.championId) {
            return res.status(404).json({ error: "No champion data found for player" });
        }

        // Obtiene los datos de los campeones
        const championsResponse = await axios.get(`https://ddragon.leagueoflegends.com/cdn/14.24.1/data/en_US/champion.json`);
        const championsData = championsResponse.data.data;

        // Busca el nombre del campeón correspondiente
        const championName = Object.values(championsData).find(
            champ => champ.key === JSON.stringify(sumonnerData.championId)
        )?.id;

        if (!championName) {
            return res.status(404).json({ error: "Champion not found in data" });
        }

        // Responde con el nombre del campeón más jugado
        res.json(championName);
    } catch (error) {
        console.error("Error in /mostPlayedChampion:", error.message);
        next(error); // Envía el error al middleware global para manejarlo
    }
});


app.get('/playerMatches', async (req, res) => {
    try {
        const playerName = encodeURIComponent(req.query.sumName);
        const playerTag = encodeURIComponent(req.query.sumTag);
        const region = req.query.region;

        const regionMapping = {
            EUW: { global: "europe", specific: "euw1" },
            EUNE: { global: "europe", specific: "eun1" },
            NA: { global: "americas", specific: "na1" },
            LAN: { global: "americas", specific: "la1" },
            LAS: { global: "americas", specific: "la2" },
            BR: { global: "americas", specific: "br1" },
            KR: { global: "asia", specific: "kr" },
            JP: { global: "asia", specific: "jp1" },
            OCE: { global: "sea", specific: "oc1" },
            TR: { global: "europe", specific: "tr1" },
            PH: { global: "sea", specific: "ph2" },
            SG: { global: "sea", specific: "sg2" },
            TH: { global: "sea", specific: "th2" },
            TW: { global: "sea", specific: "tw2" },
            VN: { global: "sea", specific: "vn2" },
            ME: { global: "asia", specific: "me" }
        };

        const selectedRegion = regionMapping[region];
        if (!selectedRegion) {
            return res.status(400).json({ error: "Invalid region." });
        }

        const globalRegion = selectedRegion.global;
        const specificRegion = selectedRegion.specific;

        const PUUID = await getPlayerPUUID(playerName, playerTag, region);

        const getItemName = (itemId, itemData) => {
            return itemData[itemId] ? itemData[itemId].name : 'Desconocido';
        };

        if (!PUUID || !PUUID.puuid) {
            return res.status(404).json({ error: "Player not found." });
        }

        const API_CALL = `https://${globalRegion}.api.riotgames.com/lol/match/v5/matches/by-puuid/${PUUID.puuid}/ids?api_key=${API_KEY}`;

        const matches = await axios.get(API_CALL).then(response => response.data).catch(err => {
            throw new Error("Error fetching match IDs.");
        });

        const playerMatches = [];

        for (const match of matches) {
            const API_CALL_2 = `https://${globalRegion}.api.riotgames.com/lol/match/v5/matches/${match}?api_key=${API_KEY}`;

            const matchData = await axios.get(API_CALL_2).then(response => response.data).catch(err => {
                throw new Error("Error fetching match data.");
            });

            const playerData = matchData.info.participants.find(player => player.puuid === PUUID.puuid);

            if (playerData) {
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
                    return `${minutes}:${leftoverSeconds.toString().padStart(2, '0')}m`;
                }

                function getGameMode(queueId) {
                    return queueMap[queueId] || "Unknown Mode";
                }

                async function getChampionName(champion) {
                    return championNameMap[champion] || "Unknown champion";
                }

                playerMatches.push({
                    match,
                    championTextName: await getChampionName(playerData.championName),
                    championDisplayName: playerData.championName,
                    kills: playerData.kills,
                    deaths: playerData.deaths,
                    assists: playerData.assists,
                    score: `${playerData.kills}/${playerData.deaths}/${playerData.assists}`,
                    minionsKilled: playerData.totalMinionsKilled + playerData.neutralMinionsKilled,
                    win: playerData.win ? "Victory" : "Defeat",
                    duration: formatGameDuration(matchData.info.gameDuration),
                    mode: getGameMode(matchData.info.queueId),
                    item0: playerData.item0,
                    item1: playerData.item1,
                    item2: playerData.item2,
                    item3: playerData.item3,
                    item4: playerData.item4,
                    item5: playerData.item5,
                    item6: playerData.item6,
                    itemName0: getItemName(playerData.item0, itemData),
                    itemName1: getItemName(playerData.item1, itemData),
                    itemName2: getItemName(playerData.item2, itemData),
                    itemName3: getItemName(playerData.item3, itemData),
                    itemName4: getItemName(playerData.item4, itemData),
                    itemName5: getItemName(playerData.item5, itemData),
                    itemName6: getItemName(playerData.item6, itemData),
                });
            }
        }

        res.json(playerMatches);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred while processing your request." });
    }
});


app.get('/getRank', async (req, res) => {
    try {
        const playerName = encodeURIComponent(req.query.sumName);
        const playerTag = encodeURIComponent(req.query.sumTag);
        const region = req.query.region;

        const regionMapping = {
            EUW: { global: "europe", specific: "euw1" },
            EUNE: { global: "europe", specific: "eun1" },
            NA: { global: "americas", specific: "na1" },
            LAN: { global: "americas", specific: "la1" },
            LAS: { global: "americas", specific: "la2" },
            BR: { global: "americas", specific: "br1" },
            KR: { global: "asia", specific: "kr" },
            JP: { global: "asia", specific: "jp1" },
            OCE: { global: "sea", specific: "oc1" },
            TR: { global: "europe", specific: "tr1" },
            PH: { global: "sea", specific: "ph2" },
            SG: { global: "sea", specific: "sg2" },
            TH: { global: "sea", specific: "th2" },
            TW: { global: "sea", specific: "tw2" },
            VN: { global: "sea", specific: "vn2" },
            ME: { global: "asia", specific: "me" }
        };

        const selectedRegion = regionMapping[region];

        if (!selectedRegion) {
            return res.status(400).json({ error: "Invalid region." });
        }

        const globalRegion = selectedRegion.global;
        const specificRegion = selectedRegion.specific;

        const PUUID = await getPlayerPUUID(playerName, playerTag, region);

        if (!PUUID || !PUUID.puuid) {
            return res.status(404).json({ error: "Player not found." });
        }

        const API_CALL = `https://${specificRegion}.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${PUUID.puuid}?api_key=${API_KEY}`;

        const summonerId = await axios.get(API_CALL).then(response => response.data.id).catch(err => {
            throw new Error("Error fetching summoner ID.");
        });

        const API_CALL_2 = `https://${specificRegion}.api.riotgames.com/lol/league/v4/entries/by-summoner/${summonerId}?api_key=${API_KEY}`;

        const summonerRank = await axios.get(API_CALL_2).then(response => response.data).catch(err => {
            throw new Error("Error fetching summoner rank.");
        });

        res.json(summonerRank);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred while processing your request." });
    }
});


// Middleware global para manejar errores
app.use((err, req, res, next) => {
    console.error("Error capturado:", err.message);

    // Devuelve una respuesta de error al cliente
    res.status(err.status || 500).json({
        error: "Internal Server Error",
        message: err.message,
    });
});

module.exports = app;