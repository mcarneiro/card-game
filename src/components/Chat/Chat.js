import { useState } from 'react'
import './Chat.css'
import Control from './Control'
import MessageBox from './MessageBox'

const Chat = ({socket}) => {
  return (
    <div className="chat">
      <MessageBox socket={socket}></MessageBox>
      <Control socket={socket}></Control>
    </div>
  )
}

export default Chat
