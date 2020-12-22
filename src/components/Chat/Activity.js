import './Activity.css'

const Activity = ({msg, userName, time, isMe = false}) => {
  const date = new Date(time)
  const dateString = `${date.getDate()}/${(date.getMonth() + 1)}/${date.getFullYear()} - ${date.getHours()}:${date.getMinutes()}`
  const msgClassName = "activity" + (isMe ? " -mine" : "")

  return (
    <div className={msgClassName}>
      {userName} {msg} <i>@ {dateString}</i>
    </div>
  )
}

export default Activity
