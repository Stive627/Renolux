import React, { useEffect, useState } from 'react'
import { fetchLink, Loader, Timg, TypeWriterArr } from '../Ttools'

const Plans = () => {
    const [preload, setPreload] = useState(true) 
    const [plans, setPlans] = useState([])
    useEffect(()=>{
        fetch((fetchLink('images/plans')), {
            method: 'GET',
        })
        .then((value)=> value.json())
        .then((value)=>{
            const items = value.map((elt,indx) => <Timg key={indx} url={elt} className={' w-full h-full rounded-sm'} alt={`plan de placo n0${indx}`}/>)
            setPlans(items); 
            console.log(value); 
            setPreload(false)})
        .catch((error) => console.log('An error occured!', error))
    }, [])
    const PlanContainer = () =>{
        return(
            <div className=' w-max h-max border border-gray-200 p-2 rounded-sm flex flex-col gap-1 overflow-hidden scrollVertical'>
                <div className=' w-full h-full flex flex-col gap-1 scrollVertical '>
                    {plans}
                </div>             
            </div>
        )
    }


    if(preload) return <Loader sizeContainer={''} sizeSpin={''}/>

    return<PlanContainer/>
    
}

function HomeSectionRight(){
    
    return(
        <div className = 'col-span-4'>
            <div className=' pt-4'>
                <span className=' text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-green-500 text-lg'>Nous sommes </span>
                <span className=' bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-green-500 text-lg'>recommandés pour</span>
            </div>
            <div className=' border border-black p-1 bg-gradient-to-r  from-blue-500 to bg-green-500'><TypeWriterArr arr={['Des solutions innovantes', 'Un service de qualité', 'le  respect des delais', 'Une approche orientée client.']} className={'text-[40px] font-bold text-white'} ms={100}/></div>
            <Plans/>
        </div>
    )
}

function HomeSection() {
  return (
    <div className=' h-screen w-screen grid grid-cols-7'>
        <Timg className={'col-span-3'} url={fetchLink('images/homeImg')} alt={'image principale'}/>
        <HomeSectionRight/>
    </div>
  )
}

export default HomeSection