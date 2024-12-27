import './SumonnerProfile.css'
import { Text, Badge } from '@chakra-ui/react'

function SumonnerProfile(props) {

  return (
    <div>
          <div id='sumonner-profile'>
              <img src={props.sumonnerIconSource} id='sumonner-icon' />
              <Text id='sumonner-name'>{props.sumonnerName}</Text>
              <Badge variant={'subtle'} size={'lg'}>Level {props.sumonnerLevel}</Badge>
          </div>
    </div>
  )
}

export default SumonnerProfile