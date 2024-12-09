import React, { useState } from 'react'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

const Link = ({elt, target}) => {
    const [hover, setHover] = useState(false)
     return(
       <a href={target}><p  onFocus={()=>setHover(true)} onPointerMove={()=>setHover(true)} onPointerLeave={()=> setHover(false)} className={` p-1 ${hover? 'text-black': 'text-white'}`}><ArrowForwardIosIcon className={`${hover? 'text-black': 'text-white'}`}/> {' '} {elt}</p> </a>
    )
}

const Newsletter = () => {
    const [email, setEmail] = useState('')
    return(
        <div>
            <p>Abonnez pour a notre newsletter.</p>
            <input value={email} onChange={(e) => setEmail(e.target.value)}/>
        </div>
    )
}
function Footer() {
    const date = new Date()
    const target = ['#accueil', '#devis', '#contact']
    const links = ['Accueil', 'Obtenir un devis', 'contact & localisation'].map((value, index)=><Link key={index} elt={value} target={target[index]}/>)
  return (
    <>
        <div className=' p-2 flex justify-between  mb-2'>
            <div className=' flex flex-col gap-1'>
                {links}
            </div>
            <Newsletter/>
        </div>
        <p className=' text-white text-[18px] text-center'> @ {date.getFullYear()} All right reserved.</p>
    </>   
  )
}

export default Footer