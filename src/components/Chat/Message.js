import './Message.css'

const Message = ({msg, id, myUserID, userID, time}) => {
  const date = new Date(time)
  const dateString = `${date.getDate()}/${(date.getMonth() + 1)}/${date.getFullYear()} - ${date.getHours()}:${date.getMinutes()}`
  const msgClassName = "message" + (myUserID === userID ? " -mine" : "")

  console.log('[id]', id)

  return (
    <div className={msgClassName}>
      <span className="meta">
        <span className="user">{userID}</span>
        <span className="date">{dateString}</span>
      </span>
      <span className="text">{msg}</span>
    </div>
  )
}

export default Message
