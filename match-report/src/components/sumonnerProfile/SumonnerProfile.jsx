import './SumonnerProfile.css'
import { Text } from '@chakra-ui/react'

function SumonnerProfile(props) {

  return (
    <div>
          <div id='sumonner-profile'>
              <img src={props.sumonnerIconSource} id='sumonner-icon' />
              <Text id='sumonner-name'>{props.sumonnerName}</Text>
          </div>
    </div>
  )
}

export default SumonnerProfile