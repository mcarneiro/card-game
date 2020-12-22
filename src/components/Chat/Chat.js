import './Chat.css'
import Control from './Control'
import MessageBox from './MessageBox'

const Chat = ({socket}) => {
  return (
    <div className="chat">
      <MessageBox
        handleHistory={socket.handleHistory}
        handleActivity={socket.handleActivity}
      />
      <Control sendMessage={socket.sendMessage} />
    </div>
  )
}

export default Chat
