import { useState } from 'react'
import './Control.css'

const Control = ({sendMessage}) => {
  let [msg, setMsg] = useState('')

  const handleChange = e => {
    setMsg(e.target.value)
  }

  const handleSubmit = e => {
    sendMessage(msg)
    setMsg('')
    e.preventDefault()
  }

  return (
    <form className="chat-control" onSubmit={handleSubmit}>
      <input type="text" value={msg} onChange={handleChange} />
      <button>Send</button>
    </form>
  )
}

export default Control
