import { useEffect, useState } from 'react'
import './Chat.css'
import Control from './Control'
import MessageBox from './MessageBox'

const Chat = ({socket}) => {
  const [msgList, setMsgList] = useState([])

  useEffect(() => {
    const clearHandleHistory = socket.handleHistory(setMsgList)
    const clearHandleUserActivity = socket.handleUserActivity(setMsgList)

    return () => {
      clearHandleHistory()
      clearHandleUserActivity()
    }
  }, [socket, setMsgList])

  return (
    <div className="chat">
      <MessageBox msgList={msgList} />
      <Control sendMessage={socket.sendMessage} />
    </div>
  )
}

export default Chat
