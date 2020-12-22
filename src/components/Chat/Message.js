import './Message.css'

const Message = ({msg, userName, time, isMe = false}) => {
  const date = new Date(time)
  const dateString = `${date.getDate()}/${(date.getMonth() + 1)}/${date.getFullYear()} - ${date.getHours()}:${date.getMinutes()}`
  const msgClassName = "message" + (isMe ? " -mine" : "")

  return (
    <div className={msgClassName}>
      <span className="meta">
        <span className="user">{userName}</span>
        <span className="date">{dateString}</span>
      </span>
      <span className="text">{msg}</span>
    </div>
  )
}

export default Message
