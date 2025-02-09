import { useEffect, useState } from "react"


export function Timg({url, className, alt }){
    return(
        <div className={className}><img src={url} alt={alt} className=" object-cover"/></div>
    )
}

export const Tdelay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))


export function Rbutton({handleClick, value, className}){
    return(
        <button className={className} onClick={handleClick}>{value}</button>
    )
}


export const TypeWriterSingle = ({text, className, ms}) => {

    const [write, setWrite] = useState(['']) 
    const [len, setLen] = useState(0)

    const delay = (ts) => new Promise((resolve) => setTimeout(resolve, ts))
    const leng = text.length

    useEffect(()=>{

        const writerFunc = async() => {  
           if(len < leng - 1){
            setWrite([...write, text[len]])
            await delay(ms)
            setLen(len + 1)
           }
           else{
            setLen(0)
           }
        }
        writerFunc() 
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [len])


    return(
<p className={className}>{write.join('')}</p>    
)

}


// The typewriter of Tsoft company
export const TypeWriterArr = ({arr, className, ms}) =>{
    const [write, setWrite] = useState([""])
    const [len, setLen] = useState(0)
    const [foward, setFoward] = useState(false)
    const sentence = arr.join('|') + '|'
    const [indx, setIndx] = useState(0)
    const leng = sentence.length
    const delay = (ts) => new Promise((resolve) => setTimeout(resolve, ts))
    useEffect(()=>{
       const writerFunc = async() => {
        if(len < leng){
            setIndx(prev => prev + 1)
            if(sentence[len] === '|' || foward){
                setWrite(write.slice(0, len))
                await delay(20)
                if(write.slice(0, len).length === 1){
                    setFoward(false)
                    setLen(indx)
                }
                else{
                    setFoward(true)
                    setIndx(prev => prev - 1)
                    setLen(len - 1)
                }

            }
            else{
              
                setWrite([...write, sentence[len]])
                await delay(ms)
                setLen(len + 1)
            }
        }
        else{
            setIndx(0)
            setLen(0)
        }
       }
       writerFunc()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [len])
    return(
      
        <p className={className}>{write.join('')}| </p>
    )

}

// loader for Tsoft company

export const Loader = ({sizeContainer, sizeSpin}) =>{
    return(
        <div className={`${sizeContainer} flex justify-center items-center`}>
            <div className={`${sizeSpin}  border-2  border-white border-b-blue-500 animate-spin`}></div>
        </div>
    )
}

//fetch link for Tsoft company

export const fetchLink = (suffix) => 'http://localhost:3000/' + suffix 




export const checkValidForm = (condition) => condition ? 'bg-blue-500 text-white border border-blue-700' : 'bg-gray-500 text-black border border-gray-700'

export const Tspinner = ({className, content}) => <p className={`${className} animate-spin`}>{content} {' '}</p>