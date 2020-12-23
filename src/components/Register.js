import { useState, useContext, useCallback } from 'react'
import './Register.css'
import UserContext from '../context/UserContext'

const Register = ({join}) => {
  const {setUserData} = useContext(UserContext)
  const [userName, setUserName] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const handleChange = evt => {
    setUserName(evt.target.value)
  }

  const handleSubmit = useCallback(e => {
    e.preventDefault()

    join(userName, res => {
      if (res.type === 'success') {
        setUserData(prev => ({...prev, userName}))
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
  }, [join, userName, setUserData, setErrorMessage])

  return (
    <div className="register">
      <form onSubmit={handleSubmit}>
        <p>Choose your name:</p>
        <input type="text" value={userName} onChange={handleChange} />
        <button>Send</button>
        {errorMessage !== '' ? <p>{errorMessage}</p> : ''}
      </form>
    </div>
  )
}

export default Register
