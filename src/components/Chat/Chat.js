import { useEffect, useState } from 'react'
import './Chat.css'
import Control from './Control'
import MessageBox from './MessageBox'

const Chat = ({socket}) => {
  const [msgList, setMsgList] = useState([])

  useEffect(() => {
    const clear = [
      socket.handleHistory(setMsgList),
      socket.handleUserActivity(setMsgList)
    ]

    return () => clear.map(fn => fn())
  }, [socket, setMsgList])

  return (
    <div className="chat">
      <MessageBox msgList={msgList} />
      <Control sendMessage={socket.sendMessage} />
    </div>
  )
}

export default Chat
