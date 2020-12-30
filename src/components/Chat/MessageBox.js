import { useCallback, useContext, useEffect } from 'react'
import './MessageBox.css'
import Message from './Message'
import Activity from './Activity'
import GameContext from '../../context/GameContext'

const MessageBox = ({msgList}) => {
  let $root;
  let {userData} = useContext(GameContext)

  const printMessages = useCallback(() => {
    return msgList.map(value => {
      switch (value.type) {
        case 'message':
          return (
            <Message
              key={value.id}
              isMe={value.userName === userData.userName}
              userName={value.userName}
              time={value.timestamp}
              msg={value.message}
            />
          )
        default:
          return (
            <Activity
              key={value.id}
              isMe={value.userName === userData.userName}
              userName={value.userName}
              time={value.timestamp}
              msg={value.message} />
          )
      }
    })
  }, [msgList, userData.userName])

  useEffect(() => {
    if ($root) {
      $root.scrollTo(0,$root.scrollHeight)
    }
  }, [msgList, $root])

  return (
    <div ref={elm => ($root = elm)} className="chat-messages">
      {printMessages()}
    </div>
  )
}

export default MessageBox
