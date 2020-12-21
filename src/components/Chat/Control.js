import { useState } from 'react'
import './Control.css'

const Control = ({socket}) => {
  let [msg, setMsg] = useState('')

  const handleChange = e => {
    setMsg(e.target.value)
  }

  const handleSubmit = e => {
    console.log('send message', msg)
    socket.sendMessage(msg)
    setMsg('')
    e.preventDefault()
  }

  return (
    <form className="chat-control" onSubmit={handleSubmit}>
      <input type="text" value={msg} onChange={handleChange}></input>
      <button>Send</button>
    </form>
  )
}

export default Control
