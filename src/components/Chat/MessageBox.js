import { useCallback, useContext, useEffect, useState } from 'react'
import './MessageBox.css'
import Message from './Message'
import Activity from './Activity'
import UserContext from '../../context/UserContext'

const MessageBox = ({handleHistory, handleActivity}) => {
  const [msg, setMsg] = useState([])
  let $root;
  let {userData} = useContext(UserContext)

  const handleNewMessage = useCallback(value => {
    setMsg(value)
  }, [setMsg])

  const printMessages = useCallback(() => {
    return msg.map(value => {
      switch (value.type) {
        case 'user':
          return (
            <Activity
              key={value.id}
              isMe={value.userName === userData.userName}
              userName={value.userName}
              time={value.timestamp}
              msg={value.message} />
          )
        default:
          return (
            <Message
              key={value.id}
              isMe={value.userName === userData.userName}
              userName={value.userName}
              time={value.timestamp}
              msg={value.message}
            />
          )
      }
    })
  }, [msg, userData.userName])

  useEffect(() => {
    const clearHandleHistory = handleHistory(handleNewMessage)
    const clearHandleActivity = handleActivity(handleNewMessage)

    return () => {
      clearHandleHistory()
      clearHandleActivity()
    }
  }, [handleHistory, handleActivity, handleNewMessage])

  useEffect(() => {
    if ($root) {
      $root.scrollTo(0,$root.scrollHeight)
    }
  }, [msg, $root])

  return (
    <div ref={elm => ($root = elm)} className="chat-messages">
      {printMessages()}
    </div>
  )
}

export default MessageBox
