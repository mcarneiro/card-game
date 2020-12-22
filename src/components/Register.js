import { useState, useContext, useCallback } from 'react'
import './Register.css'
import UserContext from '../context/UserContext'

const Register = ({socket}) => {
  const {setUserData} = useContext(UserContext)
  const [name, setName] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const handleChange = evt => {
    setName(evt.target.value)
  }

  const handleSubmit = useCallback(e => {
    e.preventDefault()

    socket.connect(name, res => {
      if (res.type === 'success') {
        setUserData(prev => ({...prev, name, isOnline: true}))
      } else {
        setErrorMessage(() => {
          switch(res.msg) {
            case 'user-exists':
              return 'User already exists!'
            default:
              return 'Unexpected error!'
          }
        })
      }
    })
  }, [socket, name, setUserData, setErrorMessage])

  return (
    <div className="register">
      <form onSubmit={handleSubmit}>
        <p>Choose your name:</p>
        <input type="text" value={name} onChange={handleChange} />
        <button>Send</button>
        {errorMessage !== '' ? <p>{errorMessage}</p> : ''}
      </form>
    </div>
  )
}

export default Register
