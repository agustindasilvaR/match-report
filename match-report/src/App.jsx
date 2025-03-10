import { useEffect, useState } from 'react'
import './App.css'
import axios from 'axios'
import SumonnerProfile from './components/sumonnerProfile/SumonnerProfile'
import { Icon, IconButton, Input, Theme } from '@chakra-ui/react'
import { Select } from '@chakra-ui/react'
import { InputGroup } from './components/ui/input-group'
import { Skeleton } from '@chakra-ui/react'
import { LuSearch } from 'react-icons/lu'
import MatchCard from './components/matchCard/MatchCard'
import RankCard from './components/RankCard/RankCard'
import Footer from './components/Footer/Footer'
import { Spinner } from '@chakra-ui/react'
import { Text } from '@chakra-ui/react'
import {
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from "@chakra-ui/react"

function SkeletonCircle({ size = "50px" }) {
  return (
    <Skeleton
      height={size}
      width={size}
      borderRadius="50%"
      startColor="gray.10"
      endColor="gray.100"
    />
  );
}

function App() {


  const [sumonnerIcon, setSumonnerIcon] = useState('')
  const [mostPlayedChampion, setMostPlayedChampion] = useState('')
  const [sumonnerName, setSumonnerName] = useState('')
  const [sumonnerTag, setSumonnerTag] = useState('')
  const [playerMatches, setPlayerMatches] = useState([])
  const [sumonnerRankSolo, setSumonnerRankSolo] = useState('')
  const [sumonnerRankFlex, setSumonnerRankFlex] = useState('')
  const [sumonnerLevel, setSumonnerLevel] = useState('')
  const [winRateSolo, setWinRateSolo] = useState(0)
  const [winRateFlex, setWinRateFlex] = useState(0)
  const [gameVersion, setGameVersion] = useState('');
  const [itemData, setItemData] = useState('');
  const [visibleCount, setVisibleCount] = useState(5);
  const increment = 5; 
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('')

  const getCurrentVersion = async () => {
  
    const response = await fetch('https://ddragon.leagueoflegends.com/api/versions.json')
 
    const versions = await response.json();
 
    setGameVersion(versions[0]);
 
   }

 
   getCurrentVersion();

   const clearSummonerData = () => {
    setVisibleCount(5)
    setSumonnerRankSolo(null);
    setSumonnerRankFlex(null);
    setWinRateSolo(0);
    setWinRateFlex(0);
    setSumonnerIcon('');
    setSumonnerLevel('');
    setSumonnerName('');
    setSumonnerTag('');

  };
  
  const sumonnerIconSource = `https://ddragon.leagueoflegends.com/cdn/${gameVersion}/img/profileicon/${sumonnerIcon}.png`
  const splashSource = `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${mostPlayedChampion}_0.jpg`

  document.addEventListener('scroll', () => {
    const target = document.getElementById('champ')

    const scrollAmount = window.scrollY;
    const blurValue = scrollAmount > 100 ? Math.min((scrollAmount - 100) / 10, 2) : 0;
    target.style.filter = `blur(${blurValue}px)`;
  })

  const profileBlock = document.getElementById('profile-block');
  const sumonnerBlock = document.getElementById('sumonner-block');
  const defaultHeight = 500;
  const minHeight = 100;
  
  window.addEventListener('scroll', () => {
    const scrollPosition = window.scrollY;
    
    let newHeight = defaultHeight - scrollPosition;
    if (newHeight < minHeight) {
      newHeight = minHeight;
    }
    
    profileBlock.style.height = `${newHeight}px`;
  
    let opacity = Math.max(0, Math.min(1, (newHeight - minHeight) / (defaultHeight - minHeight) - 0.5));

    if (newHeight === defaultHeight) {
      opacity = 1;
    }

    const maxBlur = 8;
    const blur = ((defaultHeight - newHeight) / (defaultHeight - minHeight)) * maxBlur;
    profileBlock.style.filter = `blur(${blur.toFixed(2)}px)`;
    sumonnerBlock.style.opacity = opacity.toFixed(2);
  });
  

  function getSumonnerData(event) {
    const nameValue = document.getElementById("sumonner-name").value
    const [sumonnerName, sumonnerTag] = nameValue.split("#");
    const sumonnerRegion = document.getElementById("sumonner-region").value
    

    axios.get("https://match-report-api-delta.vercel.app/sumonnerIcon", {params: { sumName: sumonnerName, sumTag: sumonnerTag, region: sumonnerRegion }})
      .then((response) => {
        if(response.data.status != 400) {

          setSumonnerName(response.data.gameName)
          setSumonnerTag(sumonnerTag)
          setSumonnerIcon(response.data.profileIconId);
          setSumonnerLevel(response.data.summonerLevel)
          setError('')

        } else {
          setSumonnerIcon('')
          setSumonnerTag('')
          setSumonnerIcon('');
        }


      }).catch((error) => {

        if(error.status === 404) {
          setError('404')
        }

        if(error.status === 429) {
          setError('429')
        }

      }).finally(() => {



      })
  }

  function getMostPlayedChampion(event) {

    const nameValue = document.getElementById("sumonner-name").value
    const [sumonnerName, sumonnerTag] = nameValue.split("#");
    const sumonnerRegion = document.getElementById("sumonner-region").value
    


    axios.get("https://match-report-api-delta.vercel.app/mostPlayedChampion", {params: { sumName: sumonnerName, sumTag: sumonnerTag, region: sumonnerRegion }})
    .then((response) => {
      if(response.data.status != 400) {

        setMostPlayedChampion(response.data);

      }


    }).catch((error) => {

      

    }).finally(() => {


    })
  }

  function getPlayerMatches(event) {

    const nameValue = document.getElementById("sumonner-name").value
    const [sumonnerName, sumonnerTag] = nameValue.split("#");
    const sumonnerRegion = document.getElementById("sumonner-region").value


    axios.get("https://match-report-api-delta.vercel.app/playerMatches", {params: { sumName: sumonnerName, sumTag: sumonnerTag, region: sumonnerRegion }})
      .then((response) => {

        setPlayerMatches(response.data);

      }).catch((error) => {

      }).finally(()=> {

      })

  }

  const showMoreMatches = () => {
    setVisibleCount(prevCount => prevCount + increment);
  };

  function getPlayerRank(event) {

    const nameValue = document.getElementById("sumonner-name").value
    const sumonnerRegion = document.getElementById("sumonner-region").value
    const [sumonnerName, sumonnerTag] = nameValue.split("#");



    axios.get('https://match-report-api-delta.vercel.app/getRank', {params: {sumName: sumonnerName, sumTag: sumonnerTag, region: sumonnerRegion }})
      .then((response) => {


        setSumonnerRankSolo(response.data[0])
        setSumonnerRankFlex(response.data[1])
        const victoriesSolo = response.data[0].wins;
        const lossesSolo = response.data[0].losses;
        const totalGamesSolo = victoriesSolo + lossesSolo;
        setWinRateSolo(((victoriesSolo / totalGamesSolo) * 100).toFixed(0))


        const victoriesFlex = response.data[1].wins;
        const lossesFlex = response.data[1].losses;
        const totalGamesFlex = victoriesFlex + lossesFlex;
        setWinRateFlex(((victoriesFlex / totalGamesFlex) * 100).toFixed(0))



      }).catch((error) => {

      }).finally(() => {

      })



  }

  const allData = async (event) => {
    clearSummonerData();
    setIsLoading(true); 
    try {
      await Promise.all([
        getSumonnerData(),
        getMostPlayedChampion(),
        getPlayerMatches(),
        getPlayerRank(),
      ]);
      await new Promise(resolve => setTimeout(resolve, 5000));
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };
  

  return (
    <div id="page-container">
      <InputGroup
        id='search-bar'
        endElement={
          <div style={{display: "flex", gap: "8px"}}>
            <select name="region" id="sumonner-region" style={{padding: "4px"}}>
              <option value="EUW">EUW</option>
              <option value="EUNE">EUNE</option>
              <option value="NA">NA</option>
              <option value="LAN">LAN</option>
              <option value="LAS">LAS</option>
              <option value="BR">BR</option>
              <option value="KR">KR</option>
              <option value="JP">JP</option>
              <option value="OCE">OCE</option>
              <option value="TR">TR</option>
              <option value="PH">PH</option>
              <option value="SG">SG</option>
              <option value="TH">TH</option>
              <option value="TW">TW</option>
              <option value="VN">VN</option>
              <option value="ME">ME</option>
            </select>
            <IconButton
              onClick={allData}
              size="xs"
              focusable="true"
              id="sub-btn"
              backgroundColor={'rgb(34, 34, 34)'}
            >
              <LuSearch />
            </IconButton>
          </div>
        }
      >
        <Input
          type="text"
          id="sumonner-name"
          placeholder="Search a summoner..."
          variant="filled"
          background={'white'}
          color={'black'}
          size="xl"
          borderRadius="20px"
          width={400}
          height={50}
          colorPalette="white"
        />
      </InputGroup>
      {isLoading ? (
        <div   style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh', 
          width: '100%', 
          backgroundColor: 'rgba(0, 0, 0, 0.1)', 
        }}>
          <Spinner size="xl" color={'white'} />
        </div>
      ) : (
        sumonnerIcon !== "" && (
          <div>
            <div 
              id='profile-block' 
              style={{
                backgroundImage: `url(${splashSource})`, 
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                backgroundBlendMode: 'multiply',
                backgroundColor: 'rgba(0, 0, 0, 0.65)'
              }}
            >
              <div id='sumonner-block'>
                <SumonnerProfile
                  sumonnerIconSource={sumonnerIconSource}
                  sumonnerName={sumonnerName}
                  sumonnerLevel={sumonnerLevel}
                  sumonnerTag={sumonnerTag}
                />
              </div>
            </div>
            <div id='rank-container'>
              <RankCard 
                rank={sumonnerRankSolo?.tier || "UNRANKED"} 
                tier={sumonnerRankSolo?.rank || ""} 
                leaguePoints={sumonnerRankSolo?.leaguePoints ?? 0} 
                wins={sumonnerRankSolo?.wins ?? 0} 
                losses={sumonnerRankSolo?.losses ?? 0} 
                wr={winRateSolo ?? 0}
                rankFlex={sumonnerRankFlex?.tier || "UNRANKED"}
                tierFlex={sumonnerRankFlex?.rank || ""}
                leaguePointsFlex={sumonnerRankFlex?.leaguePoints ?? 0}
                winsFlex={sumonnerRankFlex?.wins ?? 0}
                lossesFlex={sumonnerRankFlex?.losses ?? 0}
                wrFlex={winRateFlex ?? 0}
              />
            </div>
            <div id="match-card-container">
              {playerMatches.slice(0, visibleCount).map((match, index) => (
                <MatchCard
                  key={index}
                  championIcon={`https://ddragon.leagueoflegends.com/cdn/${gameVersion}/img/champion/${match.championDisplayName}.png`}
                  championName={match.championTextName}
                  gameMode={match.mode}
                  time={match.duration}
                  result={match.win}
                  item0Src={`https://ddragon.leagueoflegends.com/cdn/${gameVersion}/img/item/${match.item0}.png`}
                  item1Src={`https://ddragon.leagueoflegends.com/cdn/${gameVersion}/img/item/${match.item1}.png`}
                  item2Src={`https://ddragon.leagueoflegends.com/cdn/${gameVersion}/img/item/${match.item2}.png`}
                  item3Src={`https://ddragon.leagueoflegends.com/cdn/${gameVersion}/img/item/${match.item3}.png`}
                  item4Src={`https://ddragon.leagueoflegends.com/cdn/${gameVersion}/img/item/${match.item4}.png`}
                  item5Src={`https://ddragon.leagueoflegends.com/cdn/${gameVersion}/img/item/${match.item5}.png`}
                  trinketSrc={`https://ddragon.leagueoflegends.com/cdn/${gameVersion}/img/item/${match.item6}.png`}
                  kda={match.score}
                  minions={match.minionsKilled}
                  itemName1={match.itemName0}
                  itemName2={match.itemName1}
                  itemName3={match.itemName2}
                  itemName4={match.itemName3}
                  itemName5={match.itemName4}
                  itemName6={match.itemName5}
                  trinketName={match.itemName6}
                />
              ))}

              {visibleCount < playerMatches.length && (
                <button onClick={showMoreMatches} style={{backgroundColor:'rgb(30,30,30)', color:'white'}}>Show More</button>
              )}
            </div>
          </div>
        )
      )}
      {!isLoading && error === '404' && (
        <div style={{display: 'flex', flexDirection: 'column', height: '100%', alignItems: 'center', justifyContent: 'center', gap: '20px'}}>
          <img src='assets/not-found.png'/>
          <Text color={'white'}>Summoner not found, please check your sumonner name, tag and region.</Text>
        </div>
      )}
      {!isLoading && error === '429' && (
        <div style={{display: 'flex', flexDirection: 'column', height: '100%', alignItems: 'center', justifyContent: 'center'}}>
          <img src='assets/too-many-requests.png'/>
          <Text color={'white'}>Oops, too many requests! Please, wait a moment before trying again.</Text>
        </div>
      )}
      <Footer/>
    </div>
  );
  
}

export default App
