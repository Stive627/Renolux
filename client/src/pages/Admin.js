import React from 'react'
import { useNavigate } from 'react-router-dom'
import FramePage from '../ComponentsAdmin/FramePage'

const ButtonDomain = ({value, handleClick}) => <button onClick={()=>handleClick()} className=' w-3/4 hover:bg-blue-600  hover:text-white text-lg' style={{border:'1px solid rgba(3, 4, 94, 1)'}}>{value}</button>
function Admin() {
    const navigate = useNavigate()
  return (
    <FramePage>
    <div className=' w-full h-full flex justify-center items-center'>
        <div className=' flex flex-col gap-1'>
            <ButtonDomain value={'Performance Renolux'} handleClick={()=>navigate('/adminPerformance')}/>
            <ButtonDomain value={'Manager les medias'} handleClick={()=>navigate('/adminMedia')}/>
            <ButtonDomain value={'Generer un devis'} handleClick={()=>navigate('/adminDevis')}/>
        </div>
    </div>
    </FramePage>
  )
}

export default Admin