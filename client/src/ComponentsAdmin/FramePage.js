import React from 'react'

function FramePage({children}) {
  return (
    <>
        <div className=' py-2 px-2 '><img src={()=>require('../../public/logo.png')} alt='logo' width={300} height={300}/> {' '} <span className=' font-bold  text-[25px]'> Renolux Cameroon</span></div>
        <hr style = {{color:'rgba(226, 221, 221, 1)', backgroundColor:'rgba(226, 221, 221, 1)'}}/>
        <div className=' w-full h-full'>
            {children}
        </div>
    </>
  )
}

export default FramePage