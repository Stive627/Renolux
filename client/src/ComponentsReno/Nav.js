import React, { useState } from 'react'
import { fetchLink, Rbutton, Timg } from '../Ttools'
import MenuIcon from '@mui/icons-material/Menu';

const scroll = (id) => {
    const elt = document.getElementById(id)
    if(elt){
        elt.scrollIntoView({
            behavior:'smooth',
            block:'start'
        })
    }
}

export const  link = [{title:'Catalogue', link:'#catalogue'}, {title:'Obtenir un devis', link:'#devis'}, {title:'Contact & localisation', link:'#contact'}]

export function LeftNav(){
    return(
        <div className='flex flex-row items-center gap-2'>
            <Timg alt={'Logo Renolux'} url={fetchLink('logo')} className={'w-7 h-7'}/>
            <p style={{color:'rgba(57, 55, 55, 1)'}} className=' font-semibold  text-lg'>Renolux Cameroun</p>
        </div>
    )
}

function RightNav({className}){
    const links = link.map((elt, indx) =><a key={indx} href={elt.link} onClick={scroll(elt.link.slice(1))} style={{color:'rgba(57, 55, 55, 1)'}} className = 'text-sm no-underline'>{elt.title}</a>)
    return(
        <div className={className}>
            {links}
        </div>
    )
}

export function NavFrame(){
    return(
        <div className='px-2 py-3'>
            <LeftNav/>
        </div>
    )
}

function NavSmallScreen({handleClose}){
    
    const handleOnclick = (scrollTo) =>{
        handleClose()
        scroll(scrollTo)
    }
    const links = link.map((elt) =><a  href={elt.link} onClick={handleOnclick(elt.link.slice(1))} style={{color:'rgba(57, 55, 55, 1)'}} key={elt.title} className = 'text-lg no-underline to-gray-800'>{elt.title}</a>)
    return(
        <div className =' w-screen h-screen bg-white justify-center pt-5'>
            <RightNav />
            <div className=' grid grid-cols-1 divide-y gap-2'>
                {links}
            </div>
        </div>
    )
}

function Nav() {
    const [sm, setSm] = useState(false)
  return (
    <>
    <div className=' flex justify-between px-2 py-3'>
        <LeftNav/>
        <RightNav className={'flex flex-row gap-2 items-center sm:hidden'}/>
        <Rbutton handleClick={() =>setSm(!sm)} value={<div className=' hidden sm:block border border-gray-300 p-2'><MenuIcon className={' w-5 h-6'}/></div>}/>
    </div>
    {sm && <NavSmallScreen handleClose={()=>setSm(!sm)}/>}    
    </>
  )
}

export default Nav 