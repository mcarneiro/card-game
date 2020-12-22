import React from 'react'

const UserContext = React.createContext({
  userData: {name: '', isOnline: false},
  setUserData: () => ({})
})

export default UserContext
