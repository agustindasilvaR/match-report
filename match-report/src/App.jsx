import { useEffect, useState } from 'react'
import './App.css'
import axios from 'axios'
import SumonnerProfile from './components/sumonnerProfile/sumonnerProfile'
import { Icon, IconButton, Input} from '@chakra-ui/react'
import { InputGroup } from './components/ui/input-group'
import { Skeleton } from '@chakra-ui/react'
import { LuSearch } from 'react-icons/lu'

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
  const [sumonnerName, setSumonnerName] = useState('')
  const [sumonnerTag, setSumonnerTag] = useState('')


  const sumonnerIconSource = `https://ddragon.leagueoflegends.com/cdn/14.23.1/img/profileicon/${sumonnerIcon}.png`

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

  return (

    <div>
    <div id='search-bar'>
      <InputGroup endElement={<IconButton onClick={getSumonnerData} size='xs' focusable='true'><LuSearch/></IconButton>}>
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
              <img src='./assets/Yone_0.jpg'></img>
          </div>
          <SumonnerProfile sumonnerIconSource={sumonnerIconSource} sumonnerName={sumonnerName} sumonnerTag={sumonnerTag}></SumonnerProfile>
        </div>
      )
    )}

    </div>
    </div>
  )
}

export default App