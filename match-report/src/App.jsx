import { useEffect, useState } from 'react'
import './App.css'
import axios from 'axios'
import SumonnerProfile from './components/sumonnerProfile/SumonnerProfile'
import { Icon, IconButton, Input } from '@chakra-ui/react'
import { Select } from '@chakra-ui/react'
import { InputGroup } from './components/ui/input-group'
import { Skeleton } from '@chakra-ui/react'
import { LuSearch } from 'react-icons/lu'
import MatchCard from './components/matchCard/MatchCard'
import RankCard from './components/RankCard/RankCard'
import Footer from './components/Footer/Footer'
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

  const [isLoading, setIsLoading] = useState(false)

  const [sumonnerIcon, setSumonnerIcon] = useState('')
  const [mostPlayedChampion, setMostPlayedChampion] = useState('')
  const [sumonnerName, setSumonnerName] = useState('')
  const [sumonnerTag, setSumonnerTag] = useState('')
  const [playerMatches, setPlayerMatches] = useState([])
  const [sumonnerRank, setSumonnerRank] = useState('')
  const [sumonnerLevel, setSumonnerLevel] = useState('')
  const [winRate, setWinRate] = useState('')
  const [gameVersion, setGameVersion] = useState('');
  const [itemData, setItemData] = useState('');
  const [visibleCount, setVisibleCount] = useState(5); // Number of MatchCards to display initially
  const increment = 5; // Number of MatchCards to add when "Show More" is clicked

  const getCurrentVersion = async () => {
  
    const response = await fetch('https://ddragon.leagueoflegends.com/api/versions.json')
 
    const versions = await response.json();
 
    setGameVersion(versions[0]);
 
   }

 
   getCurrentVersion();






  const sumonnerIconSource = `https://ddragon.leagueoflegends.com/cdn/${gameVersion}/img/profileicon/${sumonnerIcon}.png`
  const splashSource = `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${mostPlayedChampion}_0.jpg`
  
   console.log(Select)





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
    sumonnerBlock.style.opacity = opacity.toFixed(2); // Ajusta la opacidad
  });
  

  function getSumonnerData(event) {
    const nameValue = document.getElementById("sumonner-name").value
    const [sumonnerName, sumonnerTag] = nameValue.split("#");
    const sumonnerRegion = document.getElementById("sumonner-region").value
    
    setIsLoading(true);

    axios.get("http://localhost:4000/sumonnerIcon", {params: { sumName: sumonnerName, sumTag: sumonnerTag, region: sumonnerRegion }})
      .then((response) => {
        if(response.data.status != 400) {
          setIsLoading(true);
          setSumonnerName(response.data.gameName)
          setSumonnerTag(sumonnerTag)
          setSumonnerIcon(response.data.profileIconId);
          setSumonnerLevel(response.data.summonerLevel)
          setIsLoading(false)
        } else {
          setSumonnerIcon('')
          setSumonnerTag('')
          setSumonnerIcon('');
        }


      }).catch((error) => {

        

      }).finally(() => {

        setIsLoading(false)

      })
  }

  function getMostPlayedChampion(event) {

    const nameValue = document.getElementById("sumonner-name").value
    const [sumonnerName, sumonnerTag] = nameValue.split("#");
    const sumonnerRegion = document.getElementById("sumonner-region").value

    axios.get("http://localhost:4000/mostPlayedChampion", {params: { sumName: sumonnerName, sumTag: sumonnerTag, region: sumonnerRegion }})
    .then((response) => {
      if(response.data.status != 400) {
        setIsLoading(true);
        setMostPlayedChampion(response.data);
        setIsLoading(false);
      }


    }).catch((error) => {

      

    }).finally(() => {

      setIsLoading(false)

    })
  }

  function getPlayerMatches(event) {

    const nameValue = document.getElementById("sumonner-name").value
    const [sumonnerName, sumonnerTag] = nameValue.split("#");
    const sumonnerRegion = document.getElementById("sumonner-region").value

    axios.get("http://localhost:4000/playerMatches", {params: { sumName: sumonnerName, sumTag: sumonnerTag, region: sumonnerRegion }})
      .then((response) => {
        setPlayerMatches(response.data)
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

    axios.get('http://localhost:4000/getRank', {params: {sumName: sumonnerName, sumTag: sumonnerTag, region: sumonnerRegion }})
      .then((response) => {
        setSumonnerRank(response.data[0])
        const victories = response.data[0].wins;
        const losses = response.data[0].losses;
        const totalGames = victories + losses;
        setWinRate(((victories / totalGames) * 100).toFixed(0))

      }).catch((error) => {

      }).finally(() => {

      })



  }

  function allData(event) {
    getSumonnerData();
    getMostPlayedChampion();
    getPlayerMatches();
    getPlayerRank();
  }

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
            >
              <LuSearch />
            </IconButton>
          </div>
        }
      >
        <Input
          type="text"
          id="sumonner-name"
          placeholder="Search a sumonner..."
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
        <div>

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
                rank={sumonnerRank?.tier || "UNRANKED"} 
                tier={sumonnerRank?.rank || ""} 
                leaguePoints={sumonnerRank?.leaguePoints ?? 0} 
                wins={sumonnerRank?.wins ?? 0} 
                losses={sumonnerRank?.losses ?? 0} 
                wr={winRate ?? 0} 
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
                  item0Src={`https://ddragon.leagueoflegends.com/cdn/14.23.1/img/item/${match.item0}.png`}
                  item1Src={`https://ddragon.leagueoflegends.com/cdn/14.23.1/img/item/${match.item1}.png`}
                  item2Src={`https://ddragon.leagueoflegends.com/cdn/14.23.1/img/item/${match.item2}.png`}
                  item3Src={`https://ddragon.leagueoflegends.com/cdn/14.23.1/img/item/${match.item3}.png`}
                  item4Src={`https://ddragon.leagueoflegends.com/cdn/14.23.1/img/item/${match.item4}.png`}
                  item5Src={`https://ddragon.leagueoflegends.com/cdn/14.23.1/img/item/${match.item5}.png`}
                  trinketSrc={`https://ddragon.leagueoflegends.com/cdn/14.23.1/img/item/${match.item6}.png`}
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
                <button onClick={showMoreMatches}>Show More</button>
              )}
            </div>
          </div>
        )
      )}
      <Footer/>
    </div>
  );
  
}

export default App