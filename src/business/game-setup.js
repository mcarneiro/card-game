const gameSetup = async () => {
  let rawData = await fetch('core.json')
    .then(response => response.json())

  // get online users
  
  // randomize characters
  
  // select characters for online users
  
  // randomize enemies
  
  // create enemies math.ceil(users.length/2)
  
  // randomize multipliers
  
  // multiply destroyables
  
  // randomize events
  
  // set state
  return rawData
}

export default gameSetup