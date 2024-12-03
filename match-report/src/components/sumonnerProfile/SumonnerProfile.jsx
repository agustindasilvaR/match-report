import './SumonnerProfile.css'
import { Text } from '@chakra-ui/react'

function SumonnerProfile(props) {

  return (
    <div>
          <div>
              <img src={props.sumonnerIconSource} id='sumonner-icon' />
              <Text>{props.sumonnerName}</Text>
          </div>
    </div>
  )
}

export default SumonnerProfile