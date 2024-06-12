import React from 'react'
import GoogleApiWrapper from './GoogleApiWrapper'

const Map = (user) => {
  console.log("user>>>",user)
  return (
    <div>
      <GoogleApiWrapper user={user}/>
    </div>
  )
}

export default Map
