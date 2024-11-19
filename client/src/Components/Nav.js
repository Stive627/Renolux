import React, { useState } from 'react'
import { Rbutton, Rimg, Rurl } from '../tools'
import MenuIcon from '@mui/icons-material/Menu';

function LeftNav(){
    return(
        <div className='flex flex-row items-center gap-2'>
            <Rimg alt={'Logo Renolux'} url={Rurl('logo')} className={'w-7 h-7'}/>
            <p style={{color:'rgba(57, 55, 55, 1)'}} className=' font-semibold  text-lg'>Renolux Cameroun</p>
        </div>
    )
}
function RightNav({className}){
    
    const scroll = (id) => {
        const elt = document.getElementById(id)
        if(elt){
            elt.scrollIntoView({
                behavior:'smooth',
                block:'start'
            })
        }
    }
    const elt = [{title:'Catalogue', link:'#catalogue'}, {title:'Obtenir un devis', link:'#devis'}, {title:'Contact & localisation', link:'#contact'}]
    const links = elt.map((elt) =><a href={elt.link} onClick={scroll(elt.link.slice(1))} style={{color:'rgba(57, 55, 55, 1)'}} className = 'text-sm no-underline'>{elt.title}</a>)
    return(
        <div className={className}>
            {links}
        </div>
    )
}

function Nav() {
    const [sm, setSm] = useState(false)
  return (
    <div className=' border' style={{borderColor:''}}>
    <div className=' flex justify-between px-2 py-3'>
        <LeftNav/>
        <RightNav className={'flex sm:hidden gap-2'}/>
        <Rbutton handleClick={() =>setSm(!sm)} value={<div className=' hidden sm:block border border-gray-300 p-2'><MenuIcon className={' w-5 h-6'}/></div>}/>
    </div>
    {sm && <RightNav className={'flex flex-col justify-center gap-2 bg-white py-2'}/>}    
    </div>
  )
}

export default Nav 