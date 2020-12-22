import { useCallback, useContext, useEffect, useState } from 'react'
import './MessageBox.css'
import Message from './Message'
import UserContext from '../../context/UserContext'

const MessageBox = ({handleHistory, handleMessage}) => {
  const [msg, setMsg] = useState([])
  let $root;
  let {userData} = useContext(UserContext)

  const handleNewMessage = useCallback(value => {
    setMsg(prev => prev.concat(value))
  }, [setMsg])

  const printMessages = useCallback(() => {
    return msg.map(value => {
      console.log(value)
      return (
        <Message
          key={value.id}
          isMe={value.userName === userData.name}
          userName={value.userName}
          time={value.timestamp}
          msg={value.msg}
        />
      )
    })
  }, [msg])

  useEffect(() => {
    const clearHandleHistory = handleHistory(handleNewMessage)
    const clearHandleMessage = handleMessage(handleNewMessage)

    return () => {
      clearHandleHistory()
      clearHandleMessage()
    }
  }, [handleHistory, handleMessage, handleNewMessage])

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
