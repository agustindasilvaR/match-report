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

  const sumonnerIconSource = `https://ddragon.leagueoflegends.com/cdn/14.24.1/img/profileicon/${sumonnerIcon}.png`
  const splashSource = `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${mostPlayedChampion}_0.jpg`


  document.addEventListener('scroll', () => {
    const target = document.getElementById('champ')

    const scrollAmount = window.scrollY;

    // Ajusta el valor del blur basado en la posición del scroll
    const blurValue = scrollAmount > 100 ? Math.min((scrollAmount - 100) / 10, 2) : 0;
    target.style.filter = `blur(${blurValue}px)`;
  })

  const profileBlock = document.getElementById('profile-block');
  const sumonnerBlock = document.getElementById('sumonner-block');
  const defaultHeight = 500; // Altura inicial en px
  const minHeight = 100; // Altura mínima en px
  
  window.addEventListener('scroll', () => {
    const scrollPosition = window.scrollY;
    
    // Calcula la nueva altura (disminuye progresivamente)
    let newHeight = defaultHeight - scrollPosition;
    if (newHeight < minHeight) {
      newHeight = minHeight;
    }
    
    // Aplica la nueva altura al bloque
    profileBlock.style.height = `${newHeight}px`;
  
    // Calcula la opacidad basada en la altura restante
    let opacity = Math.max(0, Math.min(1, (newHeight - minHeight) / (defaultHeight - minHeight) - 0.5));

    // Si el height actual es igual al defaultHeight, fuerza la opacidad a 1
    if (newHeight === defaultHeight) {
      opacity = 1;
    }

    const maxBlur = 8; // Máximo desenfoque en px
    const blur = ((defaultHeight - newHeight) / (defaultHeight - minHeight)) * maxBlur;
    profileBlock.style.filter = `blur(${blur.toFixed(2)}px)`;
    sumonnerBlock.style.opacity = opacity.toFixed(2); // Ajusta la opacidad
  });
  

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
    <div id="page-container">
      <InputGroup
        id='search-bar'
        endElement={
          <IconButton
            onClick={allData}
            size="xs"
            focusable="true"
            id="sub-btn"
          >
            <LuSearch />
          </IconButton>
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
  
      {/* Loading Skeleton */}
      {isLoading ? (
        <div>

        </div>
      ) : (
        sumonnerIcon !== "" && (
          // Summoner Profile Section
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
                  sumonnerTag={sumonnerTag}
                />
              </div>
            </div>
            <div id='match-card-container'>
              {playerMatches.map((index) => (
                <MatchCard championIcon={`https://ddragon.leagueoflegends.com/cdn/14.24.1/img/champion/${index.champion}.png`}championName={index.champion} gameMode={index.mode} time={index.duration} result={index.win} item0Src={`https://ddragon.leagueoflegends.com/cdn/14.23.1/img/item/${index.item0}.png`} item1Src={`https://ddragon.leagueoflegends.com/cdn/14.23.1/img/item/${index.item1}.png`} item2Src={`https://ddragon.leagueoflegends.com/cdn/14.23.1/img/item/${index.item2}.png`} item3Src={`https://ddragon.leagueoflegends.com/cdn/14.23.1/img/item/${index.item3}.png`} item4Src={`https://ddragon.leagueoflegends.com/cdn/14.23.1/img/item/${index.item4}.png`} item5Src={`https://ddragon.leagueoflegends.com/cdn/14.23.1/img/item/${index.item5}.png`} trinketSrc={`https://ddragon.leagueoflegends.com/cdn/14.23.1/img/item/${index.item6}.png`} kda={index.score}></MatchCard> 
              ))}
            </div>
          </div>
        )
      )}
    </div>
  );
  
}

export default App