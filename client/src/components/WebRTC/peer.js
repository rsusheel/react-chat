const remoteDescriptions = {};

class PeerService {
  constructor() {
    if (!this.peer) {
      this.peer = new RTCPeerConnection({
        iceServers: [
          {
            urls: [
              "stun:stun.l.google.com:19302",
              "stun:global.stun.twilio.com:3478",
            ],
          },
        ],
      });
    }
  }

  async getAnswer(offer) {
    if (this.peer) {
      await this.peer.setRemoteDescription(offer);
      const ans = await this.peer.createAnswer();
      await this.peer.setLocalDescription(new RTCSessionDescription(ans));
      return ans;
    }
  }

  async setRemoteDescription(newUserOffer) {
    if (this.peer) {
      await this.peer.setRemoteDescription(newUserOffer);
      const ans = await this.peer.createAnswer();
      return ans;
    }
  }

  

  async setRemoteAnswer(ans, userId) {
    if(this.peer){
      // console.log('waiting  jkbkj')
      // if(this.peer.signalingState==='stable'){
      //   await this.peer.setRemoteDescription(ans);
      // }
      
      // console.log('remote answer setttt')
      await this.peer.setLocalDescription()
      if (!remoteDescriptions[userId]) {
        // Check if the signaling state is appropriate for setting the remote description
        if (this.peer.signalingState === 'have-local-offer' || this.peer.signalingState === 'have-remote-offer') {
          // Set the remote description
          console.log("count")
          console.log(ans)
          console.log('ans end')
          await this.peer.setRemoteDescription(new RTCSessionDescription(ans))
            .then(() => {
              remoteDescriptions[userId] = true;
              console.log(`Remote description set for user ${userId}`);
            })
            .catch((error) => {
              this.setRemoteAnswer(ans, userId)
              console.log(`Failed to set remote description for user ${userId}: ${error}`);
            });
          
        } else {
          console.log(`Signaling state is ${this.peer.signalingState}, cannot set remote description for user ${userId}`);
        }
      } else {
        console.log(`Remote description already set for user ${userId}`);
      }



    }
  }

  async setLocalDescription() {
    if (this.peer) {
      const offer = await this.peer.createOffer();
      await this.peer.setLocalDescription(new RTCSessionDescription(offer));
      return offer;
    }
  }
}

export default new PeerService();