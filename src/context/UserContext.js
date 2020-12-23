import React from 'react'

const UserContext = React.createContext({
  userData: {userName: '', isOnline: false},
  setUserData: () => ({})
})

export default UserContext
