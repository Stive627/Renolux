import React from 'react'
import { Rimg, Rurl } from '../tools'

function HomeSectionLeft(){
    
    return(
        <div className = 'col-span-4'>
            <div className=' pt-4'>
                <span className=' text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-green-500'>Nous sommes </span>
                <span className=' bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-green-500'>recommandés pour</span>
            </div>

        </div>
    )
}

function HomeSection() {
  return (
    <div className=' h-screen w-screen grid grid-cols-7'>
        <Rimg className={'col-span-3'} url={Rurl('homeImg')} alt={'image principale'}/>
    </div>
  )
}

export default HomeSection