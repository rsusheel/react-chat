import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const PeerContext = createContext(null)

export const usePeer = () => useContext(PeerContext)

export const PeerProvider = (props) => {

  const [remoteStream, setRemoteStream] = useState(null)

  const peer = useMemo(() => new RTCPeerConnection({
    iceServers: [
      {
          urls : [
            "stun:stun.l.google.com:19302"
          ]
      }
    ]
  }), [])

  const createOffer = async () => {
    const offer = await peer.createOffer()
    await peer.setLocalDescription(offer)
    return offer
  }

  const createAnswer = async (offer) => {
    await peer.setRemoteDescription(offer)
    const answer = await peer.createAnswer()
    await peer.setLocalDescription(answer)
    return answer
  }

  const setRemoteAnswer = async (ans) => {
    await peer.setRemoteDescription(ans)
  }

  const sendStream = async (stream) => {
    const tracks = stream.getTracks()
    for(const track of tracks){
      peer.addTrack(track, stream)
    }
  }

  const handleTrackEvent = (ev) => {
    const streams = ev.streams
    setRemoteStream(streams[0])
    console.log('streaming')
  }

  useEffect(()=>{
    peer.addEventListener('track', handleTrackEvent)

    return () => {
      peer.removeEventListener('track', handleTrackEvent)
    }
  }, [peer, handleTrackEvent])

  return (
    <PeerContext.Provider value={{ peer, createOffer, createAnswer, setRemoteAnswer, sendStream, remoteStream}}>
      {props.children}
    </PeerContext.Provider>
  )
}