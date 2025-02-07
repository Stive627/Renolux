import React, { useEffect, useState } from 'react'
import { LeftNav } from '../ComponentsReno/Nav'
import { PasswordUI, validateEmail, VerificationCode } from './Register'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { useNavigate } from 'react-router-dom';
import { fetchLink } from '../Ttools';
import FramePage from '../ComponentsAdmin/FramePage';

const EmailUI = ({value, onchange, handleEmail}) =>{
    return(
        <>
        <h3>Saissisez votre email</h3>
        <input type='text' value={value} onChange={onchange} className=' p-1 border focus:border-blue-600 my-3' placeholder='Enter your email' />
        <button className=' p-2 bg-blue-600 text-white text-[21px] border border-b-blue-800' onClick={handleEmail}>Connexion</button>
        </>
    )
}
const VerificationComplete = ({handleFunc}) =>{
    useEffect(()=>{
        const timeoutId = setTimeout(handleFunc(), 2000);
        return () => clearTimeout(timeoutId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])
    return(
    <p className=' text-[21px]'>Verification complete <CheckCircleOutlineIcon className=' text-blue-700'/></p>
    )
}

function RecoverPage() {
    const [email, setEmail] = useState('')
    const [step, setStep] = useState(0)
    const [code, setCode] = useState(null)
    const [password1, setPassword1] = useState(0)
    const [password2, setPassword2] = useState(0)
    const navigate = useNavigate()
    const handleEmail = async() =>{
        if(validateEmail(email)){
            try{
                await fetch(email)
                .then(value => value.json())
                .then(value =>setCode(value))
                setStep(step + 1)
            }
            catch(error){
                console.error(error.response.data)
            }
        }
    }
    const handlelFunc = () =>{
        setStep(step + 1)
    }
    const handlePassword = async() =>{
        try {
            const formData = new FormData()
            formData.append('newPassword', password1)
           await fetch(fetchLink(''),{body:formData})
           .then((value) =>value.json())
           .then((value) =>console.log(value))
           navigate('/login')
        } catch (error) {
            console.error(error.response.data)
        }
    }

  return (
    <FramePage>
        <div className=' w-full h-full flex justify-center items-center'>
        {step === 0 && <EmailUI value={email} onchange={e =>setEmail(e.target.value)} handleEmail={handleEmail}/>}
        {step === 1 && <VerificationCode email={email} code={code} handleFunc={handlelFunc}/>}
        {step === 2 && <VerificationComplete handleFunc={handlelFunc}/>}
        {step === 3 && <PasswordUI password1={password1} password2={password2} valuePassword1={(value)=>setPassword1(value)} valuePassword2={(value)=>setPassword2(value)} value={'Terminer'} handleVerification={handlePassword}/>}
        </div>
    </FramePage>
  )
}

export default RecoverPage