import React, { useEffect, useState } from 'react'
import FramePage from '../ComponentsAdmin/FramePage'
import AttachFileIcon from '@mui/icons-material/AttachFile';
import CloseIcon from '@mui/icons-material/Close';
import { fetchLink } from '../Ttools';

const Options = ({value, handleClick, current}) =>{
    return(
        <>
        <div className=' flex flex-col gap-1'>
            <button onClick={()=>handleClick()} className={`border border-none ${current ? 'text-white bg-blue-600' : 'text-black'}`}>{value}</button>
            {current && <hr className=' w-max bg-blue-600'/>}
        </div>
        </>
    )
}

const NoContenttUI  = ({message}) => <div className=' w-full h-full flex justify-center items-center'><div><p>{message}</p></div></div>

const CardUI = ({link, handleShow}) =>{
    return(
        <div onClick={()=>handleShow()} className=' w-8 h-8 border border-gray-300'>
            <img alt={`media ${link}`} src={link} className=' object-cover'/>
        </div>
    )
}

const OverlayUI = ({children}) =>{
    return(
        <div style={{backgroundColor:'rgba(0, 0, 0, 0.02)'}} className=' fixed top-0 right-0 left-0 bottom-0 w-full h-full'>
        <div className=' w-full h-full flex justify-center items-center'>
        <div className=' border border-blue-500 grid grid-cols-2 px-5 py-1'>
        {children}
        </div>
        </div>
        </div>    
    )
}

const FileUI = ({file, handleRemove, handleCancel, handleAdd}) =>{
    return(
        <OverlayUI>
                    {file.map((elt, index) => {
                        return(
                            <div key={index}>
                            <div className=' w-7 h-7 relative' key={index}>
                                <div className=' w-full h-6'><img alt={`file${index}`} src={URL.createObjectURL(elt)} className=' object-cover'/></div>
                                <div className=' absolute top-1 right-1'>
                                    <button onClick={()=>handleRemove(index)}><CloseIcon/></button>
                                </div>
                            </div>
                            <div className=' flex justify-between'>
                                <button onClick={()=>handleCancel()} className=' my-2 border border-black p-1'>Cancel</button>
                                <button onClick={()=>handleAdd()} className=' bg-black p-1 text-white font-bold text-sm'>Ajouter</button>
                            </div>
                            </div>
                        )
                    })}
        </OverlayUI>
    )
}

const ShowUI = ({show, replace, handleReplace, handleConfirm}) =>{
    const [supprimer, setSupprimer] = useState(false)
    return(
        <OverlayUI>
        <div className=' relative'>
        {supprimer && 
        <div className='absolute top-0 right-0 left-0 bottom-0 w-full h-full' style={{backgroundColor:'rgba(0, 0, 0, 0.02)'}}>
            <div className=' w-full h-full flex items-center justify-center'>
                <div className=' border border-gray-300 p-3'>
                    <p className=' font-semibold text-[18px]'>Etes vous sur de vouloir supprimer l'image</p>
                    <div className=' my-2'>{' '}</div>
                    <div className=' flex justify-between'>
                        <button>Annuler</button>
                        <button onClick={()=> handleConfirm()}>Confirmer</button>
                    </div>
                </div>
            </div>
        </div>}
        <div className=' w-9 h-9'><img alt='select media' src={show} className=' object-cover'/></div>
        {!supprimer && <div className=' flex flex-col gap-1'>
            <div><input id='change' value={replace} onChange={handleReplace}  /> <label htmlFor='change'><p className=' px-3 p-1 border border-gray-300'>Remplacer</p></label></div>
            <button className=' border border-gray-200' onClick={()=>setSupprimer(!supprimer)}>Supprimer</button>
        </div>}
        </div>
    </OverlayUI>
    )
}

const DomainUI = ({message, category, content, file, handleRemove, handleAdd, handleCancel, handleShow, show, replace, handleReplace, handleConfirm}) =>{
        if(!content) return <NoContenttUI message={'loading...'}/>
        
        if(content.length === 0) return <NoContenttUI message={message}/>
        return(
            <>
            {file && <FileUI file={file} handleAdd={handleAdd} handleCancel={handleCancel} handleRemove={handleRemove} />}
            {show && <ShowUI show={show} replace={replace} handleConfirm={handleConfirm} handleReplace={handleReplace}/>}
            <div className=' grid grid-cols-3 gap-3'>
                {content.filter(elt => elt.category === category).map((elt, indx) => <CardUI key={indx} link={elt.link} handleShow={handleShow}/>)}
            </div>
            </>
        )
    
}

const UploadButton = ({handleFile}) => { 
    return(
        <>
        <div className=' float-right'>
            <input id='file' className=' hidden'  type='file' onChange={handleFile}/>
           <label htmlFor='file'> <p className=' rounded-full p-2 bg-black text-[21px]'><AttachFileIcon className=' text-white'/></p></label>
        </div>
        </>
    )
}
function AdminMedia() {
    const [currDomain, setCurrDomain] = useState(0)
    const [content, setContent] = useState(undefined)
    const [file, setFile] = useState(undefined)
    const domain = ['placoplatre', 'decoration', 'peinture']
    const [show, setShow] = useState('')
    const [replace, setReplace] = useState(undefined)
    useEffect(()=>{
        try {
            fetch(fetchLink(''))
            .then(value =>value.json())
            .then(value => setContent(value))
        } catch (error) {
            console.error(error.response.data)
        }
    },[])
    const handleFile = (e) => {
        setFile(e.target.files)
    }
    const handleRemove = (indx) =>{
        const newFiles = file.filter((elt, index) => index !== indx )
        setFile(newFiles)
    }
    const handleCancel = () =>{
        setFile(undefined)
    }
    const handleAdd = async() => {

        let newFiles = []
        for(var i = 0; i<file.length; i++){
            newFiles = [...newFiles, URL.createObjectURL(file[i])]
        }

        const formData = new FormData()
        formData.append('file', file)
        formData.append('category', domain[currDomain])
        try {
            await fetch(fetchLink(''),{body:formData})
            .then(value => value.json())
            .then(value =>console.log(value))
            setFile(undefined)
            setContent([...content, ...newFiles])
        } catch (error) {
           console.error(error.response.data) 
        }
    }
    const handleShow = (link) => setShow(link)

    const handleConfirm = async(link) => {
        const formData = new FormData()
        try {
            await fetch(fetchLink(''), {body:formData})
            .then(value => value.json())
            .then(value => console.log(value))
            setShow(undefined)
            const newContent = content.filter(elt => elt !== link) 
            setContent(newContent)
        } catch (error) {
            console.error(error.response.data)
        }
    }

  return (
   <FramePage>
    <div className=' flex justify-center gap-2'>
        <Options value={'PLACOPLATRE'} current={currDomain === 0} handleClick={()=>setCurrDomain(0)}/>
        <Options value={'DECORATION INTERIEURE'} current={currDomain === 1} handleClick={()=>setCurrDomain(1)}/>
        <Options value={'PEINTURE'} current={currDomain === 2} handleClick={()=>setCurrDomain(2)}/>
    </div>
    <UploadButton handleFile={handleFile} />
    {currDomain === 0 && <DomainUI content={content} message={'Pas de devis, placoplatre'} category={'placoplatre'} file={file} handleRemove={handleRemove} handleCancel={handleCancel} handleAdd={handleAdd} handleShow={handleShow} show={show} replace={replace} handleReplace={(e)=> setReplace(e.target.value)} handleConfirm={handleConfirm}/>}
    {currDomain === 1 && <DomainUI content={content} message={'Pas de devis,decoration interieure'} category={'decoration'} file={file} handleRemove={handleRemove} handleCancel={handleCancel} handleAdd={handleAdd} handleShow={handleShow} show={show}/>}
    {currDomain === 2 && <DomainUI content={content} message={'Pas de devis, peinture'} category={'peinture'} file={file} handleRemove={handleRemove} handleCancel={handleCancel} handleAdd={handleAdd} handleShow={handleShow} show={show}/>}
   </FramePage>
  )
}

export default AdminMedia