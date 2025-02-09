import React, {useEffect, useRef, useState } from 'react'
import { checkValidForm, fetchLink, Loader, Tdelay, Timg, Tspinner } from '../Ttools'
import PreviewIcon from '@mui/icons-material/Preview';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import SettingsIcon from '@mui/icons-material/Settings';
import PersonIcon from '@mui/icons-material/Person';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import '../../../client/src/App.css'

const Label = ({services, currService, currSubService}) => {

    return(

        <div className=' col-span-2'>

        {
            services.map(
                (elt, indx) => 
                <div key={indx} className = {` w-full h-full ${currService(Object.keys(elt)[0]) ? 'border border-blue-500' : 'border border-gray-100 p-1'} `}>
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
    
    if(loader){
        return <Loader/>
    }
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

const DevisForm = () => {

    const [devis, setDevis] = useState({service:'', superficie:0})
    const [devisLink, setDevisLink] = useState('')
    const [spinner, setSpinner] = useState(false)
    const inputRef = useRef(null)
    const nextInput = (servi) => {
        setDevis({...devis, service:servi})
        inputRef.current.focus()
    }
    const validForm = devis.service && devis.superficie
    const  handleSubmit = async(e) =>{
        e.preventDefault()
        if(validForm){ 
        setSpinner(true)
        await Tdelay(2000)
        const formdata = new FormData()
        formdata.append('service', devis.service)
        formdata.append('superficie', devis.superficie)
        fetch(fetchLink('generate/devis'), {
            body:formdata
        })
        .then((response) =>{
            response.json()
        })
        .then((value) =>{ setSpinner(false); setDevisLink(value)})
        .catch((error) =>{
            setSpinner(false)
            console.log('An error occured', error)
        })}
    }
    return(
        <form onSubmit={handleSubmit} className='text-gray-700 row-span-2 bg-gradient-to-r flex justify-center items-center lineargrad'>
           <div>
                <div className = 'flex justify-between '>
                     <SelectS callback={nextInput}/>
                     <div><input ref={inputRef} type='number' value={devis.superficie} onChange={(e) => setDevis({...devis, superficie:e.target.value})} /></div>
                     <button type='submit' className={` ${checkValidForm(validForm)} text-lg p-1 rounded-md`}>{spinner && <Tspinner content={<SettingsIcon className=' text-gray-700'/>} className = {''}/>} Generer</button>
                </div>
                {devisLink && <div className=' flex justify-center to-gray-700'>
                    <button onClick={()=> window.location.href = devisLink} className=' p-1 bg-gray-200 border border-black'><PreviewIcon/>{' '} Appercu</button>
                    <button className=' p-1 bg-gray-200 border border-black'><SaveAltIcon/>{' '} Telecharger</button>
                </div>}
           </div>
        </form>
    )
    
}

const Stars = ({getStars}) =>{
    const [rank, setRank] = useState([0, 0, 0, 0, 0])
    const handleChange = (indx) => {
        const newRank = rank.map((elt, index) => index > indx ?  elt : 1)
        setRank(newRank)
        getStars(indx + 1)
    }
    return(
        <div className=' flex flex-row gap-2'>
            {
                Array(5).fill(0).map((elt, indx) => <div key={indx} onMouseOver={() =>handleChange(indx)} onClick={() =>handleChange(indx)}>{rank[indx] ? <StarOutlineIcon className=' text-yellow-500'/> : <StarOutlineIcon className=' text-gray-500'/>}</div>)
            }
        </div>
    )
}

const FormComment = ({handleAddComment}) => {

    const [comment, setComment] = useState({username:'', message:'', stars:0})
    const [imgSucc, setImgSucc] = useState('')
    const [spinner, setSpinner] = useState(false)
    const getStars = (stars) =>{
        setComment({...comment, stars:stars})
    } 
    const validForm = comment.message && comment.stars

    const handleSubmit = async(e) => {
        e.preventDefault()
        if(validForm){
            setSpinner(true)
            Tdelay(2000)
            handleAddComment(comment)
            const formdata = new FormData()
            formdata.append('username',comment.username)
            formdata.append('message', comment.message)
            formdata.append('stars', comment.stars)

            fetch(fetchLink('comment/add'), {
                body:formdata
            })
            .then((value)=>value.json())
            .then((value) => {setSpinner(false); setImgSucc(value)})
            .catch((reason) => {setSpinner(false); console.log('An error occurred ', reason)})
        }
    }
    if(imgSucc){
        return(
            <div className=' border border-gray-300 col-span-2 flex justify-center items-center'>
                <Timg url={imgSucc} className={'w-1/2  h-1/2'}/>
                <p className = ' text-gray-700'>Message recu, merci!</p>
            </div>
        )
    }
    return(
        <form onSubmit={handleSubmit}  className=' w-full h-full flex justify-center gap-1 border border-gray-300'>
            <div className=' flex'> <AccountCircleIcon className=' to-gray-400'/><input className=' w-3/4' placeholder='Prenom' value={comment.username} onChange={(e)=>setComment(e.target.value)}/></div>
            <textarea rows={5} cols={33} placeholder='Votre message...'></textarea>
            <Stars getStars = {getStars}/>
            <button disabled={!validForm} type='submit' className={`float-right text-sm ${checkValidForm(validForm)}`}>{spinner && <Tspinner content={<SettingsIcon className=' text-gray-700'/>} className = {''}/>} Post</button>
        </form>
    )
}

const Card = ({comment}) =>{

    const stars = Array(5).fill(0).map((elt, indx) => {if(indx > comment.stars - 1){return elt}else{return 1}})
                  .map((elt, index) => <div key={index}>{elt ? <StarOutlineIcon className=' text-yellow-500'/> : <StarOutlineIcon className=' text-gray-500'/>}</div>)
    return(
        <div className=' shadow-lg border w-8 border-gray-300 rounded-md p-2'>
            <h2 className=' text-blue-900'><PersonIcon className=' text-gray-700'/> {' '} {comment.username}</h2>
            <div className=' flex flex-row gap-1'>{stars}</div>
            <div>{' '}</div>
            <p className=' text-[18px] text-slate-800'><q>{comment.message}</q></p>
        </div>
    )
}

const ButtonCom = ({condition, element, handleClick}) =>{
    return(
        <button onClick={handleClick} className={` p-2 rounded-full border  border-slate-800 ${condition? 'bg-gray-400 text-gray-800' : 'bg-blue-600 text-white'}`}>{element}</button>
    )
}

const CommentList = ({comment}) => {
    const [indx, setIndx] = useState(2)
    const total = comment?.length
    const comRef = useRef(new Map())

    const handleFoward = () => {
        if(indx > total - 1) return ;
        setIndx(prev => prev + 1)
        const node = comRef.current.get(comment[indx])
        node.scrollIntoView({
            behaviour:'smooth',
            block:'nearest',
            inline:'center'
        })
    }

    const handleBack = () => {
        if(indx < 3) return ;
        setIndx(prev => prev -1)
        const node = comRef.current.get(comment[indx])
        node.scrollIntoView({
            behaviour:'smooth',
            block:'nearest',
            inline:'center'
        })
    }
    if(!comment){
        return(
            <div className=' flex justify-center items-center'>
                <Tspinner className={'rounded-full w-5 h-5 border border-blue-500 border-b-white'} content={' '}/>
            </div>
        )
    }
    return(
        <>
        <div className=' flex-row-reverse gap-1 mb-2'>
            <ButtonCom element={<ArrowBackIosIcon/>} condition={indx < 3} handleClick={handleBack}/>
            <ButtonCom element={<ArrowForwardIosIcon/>} condition={indx > total -1} handleClick={handleFoward}/>
        </div>
        <div className=' flex items-center border border-gray-300 animate-spin gap-1 p-1 ' style={{animation:'infinite '}} >
            {comment.map((elt, indx) => <div ref={(node)=>{if(node){comRef.current.set(elt, node)}else{comRef.current.delete(elt)}}}><Card key = {indx} comment = {elt} /></div>)}
        </div>
        </>
    )
}

const CommmentR = () => {
    const [comment, setComment] = useState(null)
    useEffect(() => {
        const fetchCom = async () => {
            fetch(fetchLink('comment/show'))
            .then((value)=> value.json())
            .then((value)=>{
                setComment(value)
            })
            .catch((reason) => console.log(reason))
        }
        fetchCom()
    }, [])

    const handleAddComment = (newComment) =>{
        setComment([...comment, newComment])
    }

    return(
        <div className=' row-span-4 grid-cols-5 '>
            <FormComment handleAddComment={handleAddComment}/>
            <CommentList comment={comment}/>
        </div>
    )

}

function ShowCase() {
  return (
    <div className=' w-screen h-screen grid grid-rows-10'>
        <Gallery/>
        <DevisForm/>
        <CommmentR/>
    </div>
  )
}

export default ShowCase