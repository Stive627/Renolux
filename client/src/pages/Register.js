import React, { useState } from 'react'
import CheckIcon from '@mui/icons-material/Check';
import google from '../../public/google.png'
import { LeftNav } from '../ComponentsReno/Nav';
import { fetchLink } from '../Ttools';
import { useNavigate } from 'react-router-dom';
import FramePage from '../ComponentsAdmin/FramePage';


export const InputAdmin = ({handleChange, placeholder,value, type}) =>{
    return(
        <input onChange={(e) =>handleChange(e)} placeholder={placeholder} value={value} className=' w-3/4 p-2 border border-black m-1' type={type}/>
    )
}


export const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };
  


export const ButtonAdmin = ({value, validation}) =>{
    return(
        <button type='submit' disabled={!validation} className={` w-1/3  p-2 text-white font-semibold`} style={{backgroundColor:'rgba(72, 149, 239, 1)'}}>{value}</button>
    )
}



const Recommendation = ({message}) => <p style={{color:'rgba(80, 74, 74, 1)', fontSize:12}}>{message}</p>



const FormAccueil = ({emailValue, passord1Value, password2Value, email, password1, password2, handleVerification, handleGoogle}) =>{
    const samePassword = password1 === password2
    const validPassword = password1.length > 5 && /\d/.test(password1) && /[A-Z]/.test(password1) && samePassword && validateEmail(email)
    const handleSubmit = (e) => {
        e.preventDefault()  
        handleVerification()
    }
    return(
        <>  
            <div className=' flex items-center justify-center h-full w-full'>
            <div className='mb-1'>
                <h2> Bienvenue dans RenoluxAdmin </h2>
                <p className=' mt-3'>Creer votre compte pour continuer</p>
            </div>
            <form onSubmit={(e) => handleSubmit(e)}>
                <InputAdmin type={'text'} value={email} handleChange={(e) =>emailValue(e.target.value)}  onblur={()=>{}}/>
                <InputAdmin type={'password'} value={password1} handleChange={(e) => passord1Value(e.target.value)}/>
                <InputAdmin  type={'password'} value={password2 } handleChange={(e) => password2Value(e.target.value)}/>
                <Recommendation message={'Le mot de passe doit contenir plus de 6 characters,un chiffre et une majuscule'}/>
                <ButtonAdmin validation={validPassword} value={'Continuer'}/>
            </form>
            <button onClick={()=>handleGoogle()} style={{borderColor:'linear-gradient(to right, rgba(255, 65, 49, 1), rgba(255, 189, 0, 1), rgba(0, 170, 75, 1), rgba(0, 134, 249, 1))'}}  className=' p-1'><img alt='logo google' src={google}/>{' '}Continuer avec google</button>
            <p className=' text-[16px]'>Vous avec un compte? connecter vous <span style={{color:'rgba(38, 103, 255, 1)'}}>ici</span></p>
            </div>
        </>
    )
}


export const VerificationCode = ({email, code, handleFunc}) =>{
    const [num, setNum] = useState(1)
    const [one, setOne] = useState(undefined)
    const [second, setSecond] = useState(undefined)
    const [three, setThree] = useState(undefined)
    const [four, setFour] = useState(undefined)
    const [five, setFive] = useState(undefined)
    const [six, setSix] = useState(undefined)
    const [err, setErr] = useState(false)

    const CaseS = ({indx, value, setValue }) => <div className={` p-2 border ${indx === num ? 'border-black':'border-blue-600'}`}><input type='number' value={value} autoFocus={indx === num} onChange={(e)=>setValue(e.target.value)} disabled={ indx !== num} className=' border-none text-[16px]'/></div>

    const handleCode = (lastValue) =>{
        const codeA = String(one)+String(second)+String(three) + String(four) + String(five) + String(lastValue)
        if(code === codeA){
            handleFunc()
        }
        else{
            setOne(undefined); setSecond(undefined); setThree(undefined);setFour(undefined);setFive(undefined);setSix(undefined)
            setErr(true)
        }
    }
    return(
        <div className=' flex justify-center items-center  w-full h-full '>
            <p className=' mb-3'>Saississez le code de 06 chiffres envoye a l'addresse <span className=' font-bold'>{email}</span></p>
            <div className=' flex flex-row gap-2'>
            <CaseS indx={1} value={one} setValue={(value) =>{setOne(value); setNum(num + 1)}}/>
            <CaseS indx={2} value={second} setValue={(value) =>{setSecond(value); setNum(num + 1)}}/>
            <CaseS indx={3} value={three} setValue={(value) =>{setThree(value); setNum(num + 1)}}/>
            <CaseS indx={4} value={four} setValue={(value) =>{setFour(value); setNum(num + 1)}}/>
            <CaseS indx={5} value={five} setValue={(value) =>{setFive(value); setNum(num + 1)}}/>
            <CaseS indx={6} value={six} setValue={(value) => handleCode(value)}/>
            </div>
            {err &&<p>Le code est  erroné</p>}
            <p className=' mt-4'> vous n'avez pas recu de code? cliquez <span style={{color:'rgba(38, 103, 255, 1)'}}>ici</span></p>
        </div>
    )
}



const UsernameUI = ({username, handleFinish})=>{
    const [user, setUser] = useState(username)
    return(
        <div>
            <p>Votre nom d'utilisateur</p>
            <input className=' p-1 border-blue-600' autoFocus={true} value={user} onChange={(e)=>setUser(e.target.value)}/>
            <button className=' bg-blue-600 text-white p-2' disabled={username.length <1} onClick={()=>handleFinish(user)}>Terminer</button>
        </div>
    )

}



const RoundStep = ({step, value}) => <div className={`${step? 'bg-blue-600 text-white':' bg-slate-500 text-black'} p-1 border border-none rounded-full`}><p>{value}</p></div>;



export const PasswordUI = ({password1, password2, valuePassword1, valuePassword2, handleVerification, value}) =>{
    const samePassword= password1 === password2
    const validPassword = password1.length > 5 && /\d/.test(password1) && /[A-Z]/.test(password1) && samePassword
    const handleSubmit = (e) =>{
        e.preventDefault()
        handleVerification()
    }
    return (
        <form onSubmit={e =>handleSubmit(e)}>
            <InputAdmin type={'password'} value={password1} handleChange={(e) => valuePassword1(e.target.value)}/>
            <InputAdmin type={'password'} value={password2 } handleChange={(e) => valuePassword2(e.target.value)}/>
            <Recommendation message={'Le mot de passe doit contenir plus de 6 characters,un chiffre et une majuscule'}/>
            <ButtonAdmin validation={validPassword} value={value}/>
        </form>

    )
}



function Register() {
    const [email, setEmail]= useState('')
    const [password1, setPassword1] = useState('')
    const [password2, setPassword2] = useState('')
    const [code, setCode] = useState(undefined)
    const [username, setUsername] = useState('')
    const [steps, setSteps] = useState({one:true, second:false})
    const [ui, setUI] = useState(0)
    const navigate = useNavigate()

    const checkUsername = () =>{
        return true 
    }
    const handleFinish = async(user) =>{
        const formData = new FormData()
        formData.append('username', user)
        formData.append('email', email)
        formData.append('password', password1)
        try{
           await fetch(fetchLink(''), {
                body:formData
            })
            .then(value =>value.json())
            .then(value =>console.log(value))
            navigate('/admin')
        }
        catch(error){
            console.error(error.response.data)
        }

    }
    const handleNext = () => setUI(ui + 1)
    //const handleBack = () => setUI(ui - 1)

    const handleGoogle = async() =>{
        try{
            await fetch(fetchLink('auth/google'))
            .then(value =>value.json())
            .then(value =>{
                setEmail(value.email)
                setUsername(value.given_name)
            })
            setUI(ui + 3)
        }
        catch(error){
            console.error(error.response.data)
        }
    }
  return (
   <>
    <FramePage>

   {ui === 0 && <FormAccueil email={email} password1={password1} password2={password2} emailValue={value => setEmail(value)} passord1Value={value => setPassword1(value)} password2Value={value =>setPassword2(value)} handleVerification={handleNext} handleGoogle={handleGoogle} />}
   {ui === 1 && <VerificationCode email={email} code={code} checkUsername={checkUsername} handleFunc={handleNext}/>}
   {ui === 2 && <UsernameUI username={/\w*/.exec(username)[0]} handleFinish={handleFinish}/>}

   <>
        <p>Creer votre compte pour continuer</p>
{ui > 2 &&<div className=' mt-2 flex flex-row gap-2'>
                <RoundStep  step ={steps.one} value = {'1'}/>
                <RoundStep step ={steps.two} value = {'2'}/>
            </div>}
        {ui === 3 && <PasswordUI handleVerification={()=>handleNext()} password1 = {password1} password2 = {password2} valuePassword1={value =>setPassword1(value)} valuePassword2={value =>setPassword2(value)} value={'Continuer'}/>}
        {ui === 4 && <UsernameUI username = {username} handleFinish = {handleFinish}/>}
   </>
   </FramePage>
   </>
  )
}

export default Register