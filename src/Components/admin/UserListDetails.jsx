import React from 'react'
import { useLocation } from 'react-router-dom'

function userListDetails() {
    const location = useLocation();
    const user = location.state?.userData;

    console.log(user)

  return (
    <div>userListDetails</div>
  )
}

export default userListDetails