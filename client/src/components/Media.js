import React from 'react'
import Audio from './WebRTC/Audio'

function Media(props) {
  return (
    <div>
        <Audio socket={props.socket}/>
    </div>
  )
}

export default Media