import React from 'react'

const TeamBox = ({team}) => {
  return (
    <div className="w-full h-10 bg-slate-500 ">
        {team.name}
    </div>
  )
}

export default TeamBox