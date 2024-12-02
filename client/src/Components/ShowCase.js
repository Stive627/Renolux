import React, { useEffect, useRef, useState } from 'react'
import { fetchLink, Tdelay, Timg } from '../Ttools'
import PreviewIcon from '@mui/icons-material/Preview';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

const Label = ({services, currService, currSubService}) => {

    return(

        <div className=' col-span-2'>

        {
            services.map((elt) => 
                <div className = {` w-full h-full ${currService(Object.keys(elt)[0]) ? 'border border-blue-500' : 'border border-gray-100 p-1'} `}>
                    <button className={`${currService(Object.keys(elt)[0]) ? ' text-white bg-blue-600' : ' text-gray-800 bg-slate-50 text-lg'}`}>{Object.keys(elt)[0]}</button>
                        {
                            currService(Object.keys(elt)[0]) && 
                                <div className = ' w-full h-full flex flex-col gap-1'>
                                    {Object.values(elt)[0].map((elt) => {
                                    return  <button className = {`${currSubService(elt) && currService(Object.keys(elt)[0]) ? ' text-white bg-blue-600' : ' text-gray-800 bg-slate-50 text-lg'}`}>{elt}</button>
                                })} 
                                </div>
                        }
                </div>
                        )
        }

        </div>
    )

}

const Medias = ({media}) => {

    const [indx, setIndx] = useState(0)
    const [mediaI, setMediaI] = useState(media)
    const imgRef = useRef(new Map())
    useEffect(() => {
       async function anim(){
                const node = imgRef.current.get(mediaI[indx % media.length])
                node.scrollIntoView({
                behaviour:'smooth',
                block:'nearest',
                inline:'center'
            })
            
            await Tdelay(1500)
            setMediaI([...mediaI, mediaI[indx]])
            setIndx(indx + 1)
        }
        anim()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[indx])
    
    return(
        <div className={'col-span-3 border border-gray-300 flex gap-1  p-1 overflow-hidden'}>
            {
                mediaI.map((elt, indx) => 
                <div className=' w-full h-full'  key = {indx} ref = {(node) => {
                        if(node){
                            imgRef.current.set(elt, node)
                        }
                        else
                        {
                            imgRef.current.delete(elt)
                        } }}>
                            <Timg  url={elt.url} alt={`Image de la category ${elt.category} et du service ${elt.service}`} className={'w-full h-full'}/>
                </div>)
            }
        </div>
    )
    
}

const Gallery = () => {

    const [loader, setLoader] = useState(true)
    const [currentIndx, setCurrentIndx] = useState(0)
    const [med, setMed] = useState([])
    const services = [{Construction:['placoplatre', 'etanchiete', 'raccord', 'drainage']}, {Decoration:['papierPeint']}, {Peinture:['peintureEau', 'peintureHuile']}]
    useEffect(() =>{
        fetch(fetchLink('medias/show'))
        .then((value) => value.json())
        .then((response) => {
            setMed(response)
            setLoader(false)
        })
        .catch((reason) => console.log('An error occured', reason))
    }, [])

    useEffect(()=>{
       async function anim(){
                await Tdelay(1500)
                setCurrentIndx(currentIndx + 1 )
        }
        anim()
    },[currentIndx])

    return(
        <div className=' row-span-4 grid grid-cols-5' >
            <Label services={services} currSubService={(subService) => subService === med[currentIndx % med.length].subService} currService={(service) => service === med[currentIndx % med.length].service}/>
            <Medias media={med}/>
        </div>
            )

}

const SelectS = ({callback}) => {

    const [service, setService] = useState(null)
    const [open, setOpen] = useState(false)
    const travaux = ['Placo design', 'Peinture', 'Papier peint'].map((elt) => <button onClick={() =>handleSelect(elt)} className = ' border-none  p-1 to-gray-800 '> {elt}</button>)

    const handleSelect = (service) => {
        setService(service)
        setOpen(prev => !prev)
        callback(service)
    }
    return(
        <div className=' flex flex-col text-gray-700'>
        <button onClick={()=>setOpen(!open)} className=' rounded-md border border-black p-1  outline-0 outline-blue-500  bg-gray-200 to-gray-800 '>{service ? service : 'Selectionnez un service'}{'  '} <KeyboardArrowDownIcon/></button>
        {open &&<div className=' border-blue-50 p-1 flex flex-col divide-y'>
            {
               travaux 
            }
        </div>}
        </div>
    )
}

const Devis = () => {

    const [service, setService] = useState(null)
    const [superficie, setSuperficie] = useState(0)
    const [result, setResult] = useState(false)
    const [devisLink, setDevisLink] = useState(false)
    const inputRef = useRef(null)
    const nextInput = (servi) => {
        setService(servi)
        inputRef.current.focus()
    }

    const handleSubmit = () =>{
        const formdata = new FormData()
        formdata.append('service', service)
        formdata.append('superficie', superficie)
        fetch(fetchLink('generate/devis'), {
            body:formdata
        })
        .then((response) =>{
            response.json()
        })
        .then((value) => setDevisLink(value))
        .catch((error) =>{
            console.log('An error occured', error)
        })
    }
    return(
        <div className='text-gray-700 row-span-2 bg-gradient-to-r flex justify-center items-center' style={{backgroundImage:'linear-gradient(to right, rgba(234, 213, 233, 1), rgba(59, 136, 219, 0.51),  rgba(245, 245, 245, 1));'}}>
           <div>
                <div className = 'flex justify-between '>
                     <SelectS callback={nextInput}/>
                     <div><input ref={inputRef} type='number' onChange={(e) => setService(e.target.value)} /></div>
                     <button className=' text-gray-700 bg-gray-200 text-lg p-1 rounded-md'>Generer</button>
                </div>
                {result && <div className=' flex justify-center to-gray-700'>
                    <button onClick={()=> window.location.href = devisLink} className=' p-1 bg-gray-200 border border-black'><PreviewIcon/> Appercu</button>
                    <button className=' p-1 bg-gray-200 border border-black'><SaveAltIcon/> Telecharger</button>
                </div>}
           </div>
        </div>
    )
    
}

const Commment = () =>{

}

function ShowCase() {
  return (
    <div className=' w-screen h-screen grid grid-rows-10'>
        <Gallery/>

    </div>
  )
}

export default ShowCase