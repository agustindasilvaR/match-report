import { useEffect, useState } from 'react'
import './App.css'
import axios from 'axios'
import SumonnerProfile from './components/sumonnerProfile/sumonnerProfile'
import { Icon, IconButton, Input} from '@chakra-ui/react'
import { InputGroup } from './components/ui/input-group'
import { Skeleton } from '@chakra-ui/react'
import { LuSearch } from 'react-icons/lu'
import MatchCard from './components/matchCard/matchCard'

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

  const sumonnerIconSource = `https://ddragon.leagueoflegends.com/cdn/14.23.1/img/profileicon/${sumonnerIcon}.png`
  const splashSource = `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${mostPlayedChampion}_0.jpg`

  function getSumonnerData(event) {
    const nameValue = document.getElementById("sumonner-name").value
    const [sumonnerName, sumonnerTag] = nameValue.split("#");
    
    setIsLoading(true);

    axios.get("http://localhost:4000/sumonnerIcon", {params: { sumName: sumonnerName, sumTag: sumonnerTag }})
      .then((response) => {
        if(response.data.status != 400) {
          setIsLoading(true);
          setSumonnerName(sumonnerName)
          setSumonnerTag(sumonnerTag)
          setSumonnerIcon(response.data);
          setIsLoading(false)
        } else {
          setSumonnerIcon('')
          setSumonnerTag('')
          setSumonnerIcon('');
        }

        console.log(response.data)

      }).catch((error) => {

        

      }).finally(() => {

        setIsLoading(false)

      })
  }

  function getMostPlayedChampion(event) {

    const nameValue = document.getElementById("sumonner-name").value
    const [sumonnerName, sumonnerTag] = nameValue.split("#");

    axios.get("http://localhost:4000/mostPlayedChampion", {params: { sumName: sumonnerName, sumTag: sumonnerTag }})
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

    axios.get("http://localhost:4000/playerMatches", {params: { sumName: sumonnerName, sumTag: sumonnerTag }})
      .then((response) => {
        console.log(response.data)
        setPlayerMatches(response.data)
      }).catch((error) => {

      }).finally(()=> {
      })

  }

  function allData(event) {
    getSumonnerData();
    getMostPlayedChampion();
    getPlayerMatches();
  }

  return (

    <div>
    <div id='search-bar'>
      <InputGroup endElement={<IconButton onClick={allData} size='xs' focusable='true' id='sub-btn'><LuSearch/></IconButton>}>
        <Input type='text' id='sumonner-name'  placeholder='Search a sumonner...' variant='filled' size='xl' borderRadius='20px' width={400} height={50} colorPalette={'white'}/>
      </InputGroup>
        <br/>
    </div>
    <div>
    {isLoading ? (
      <div>
          <Skeleton height="480px" style={{position: 'fixed', top: 0, left: 0, width: '100%'}} loading={isLoading} variant='pulse'></Skeleton>
          <SkeletonCircle size='250px' />
      </div>
    ) : (
      sumonnerIcon !== '' && (
        <div>
          <div id='champ'>
              <img src={splashSource}></img>
          </div>
          <SumonnerProfile sumonnerIconSource={sumonnerIconSource} sumonnerName={sumonnerName} sumonnerTag={sumonnerTag}></SumonnerProfile>
          <div id='match-card-container'>
            {playerMatches.map((index) => (
               <MatchCard championIcon={`https://ddragon.leagueoflegends.com/cdn/14.23.1/img/champion/${index.champion}.png`}championName={index.champion} gameMode={index.mode} time={index.duration} result={index.win} item0Src={`https://ddragon.leagueoflegends.com/cdn/14.23.1/img/item/${index.item0}.png`} item1Src={`https://ddragon.leagueoflegends.com/cdn/14.23.1/img/item/${index.item1}.png`} item2Src={`https://ddragon.leagueoflegends.com/cdn/14.23.1/img/item/${index.item2}.png`} item3Src={`https://ddragon.leagueoflegends.com/cdn/14.23.1/img/item/${index.item3}.png`} item4Src={`https://ddragon.leagueoflegends.com/cdn/14.23.1/img/item/${index.item4}.png`} item5Src={`https://ddragon.leagueoflegends.com/cdn/14.23.1/img/item/${index.item5}.png`} trinketSrc={`https://ddragon.leagueoflegends.com/cdn/14.23.1/img/item/${index.item6}.png`} kda={index.score}></MatchCard> 
            ))}
          </div>
        </div>
      )
    )}

    </div>
    
    </div>
  )
}

export default App