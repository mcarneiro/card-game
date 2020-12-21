import { useCallback, useEffect, useState } from 'react'
import './MessageBox.css'
import Message from './Message'

const Messages = ({socket}) => {
  const [msg, setMsg] = useState([])
  let $root;

  const handleNewMessage = useCallback(value => {
    setMsg(prev => prev.concat(value))
  }, [setMsg])

  const printMessages = useCallback(() => {
    return msg.map(value => {
      console.log(value)
      return (
        <Message
          key={value.id}
          myUserID={socket.userID}
          userID={value.userID}
          time={value.timestamp}
          id={value.id}
          msg={value.msg}
        />
      )
    })
  }, [msg])

  useEffect(() => {
    const clearHandleHistory = socket.handleHistory(handleNewMessage)
    const clearHandleMessage = socket.handleMessage(handleNewMessage)

    return () => {
      clearHandleHistory()
      clearHandleMessage()
    }
  }, [socket, handleNewMessage])

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

export default Messages
