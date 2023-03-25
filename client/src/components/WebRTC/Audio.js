import React, { useCallback, useEffect, useState } from 'react'
import { usePeer } from './Peer'
import ReactPlayer from 'react-player'

function Audio(props) {

    const socket = props.socket

    const [myStream, setMyStream] = useState(null)

    const { peer, createOffer, createAnswer, setRemoteAnswer, sendStream, remoteStream } = usePeer()

  const getUserMediaStream = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({audio: true, video: true})
    sendStream(stream)
    setMyStream(stream)
  }, [sendStream])

  useEffect(()=>{
    getUserMediaStream()
  }, [getUserMediaStream])

  return (
    <>
      <ReactPlayer url={myStream} playing muted/>
      <br/>
      <ReactPlayer url={remoteStream} playing muted/>
      hello
    </>
  )
}

export default Audio