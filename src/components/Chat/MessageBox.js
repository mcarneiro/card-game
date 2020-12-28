import { useCallback, useContext, useEffect } from 'react'
import './MessageBox.css'
import Message from './Message'
import Activity from './Activity'
import UserContext from '../../context/UserContext'

const MessageBox = ({msgList}) => {
  let $root;
  let {userData} = useContext(UserContext)

  const printMessages = useCallback(() => {
    return msgList.map(value => {
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
          return null
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
