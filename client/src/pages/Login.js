import React, { useState } from 'react'
import { LeftNav } from '../ComponentsReno/Nav'
import { fetchLink } from '../Ttools'
import FramePage from '../ComponentsAdmin/FramePage'


function Login() {
  const [user, setUser] = useState('')
  const [password, setPassword] = useState('')
  const handleSubmit = async(e) =>{
    e.preventDefault()
    const formData = new FormData()
    formData.append('usernameOrEmail', user)
    formData.append('password', password)
    try{
      await fetch(fetchLink('login'), {body:formData})
      .then((value) =>value.json())
      .then(value =>{
        localStorage.setItem('token', value.token)
      })
    }
    catch(error){
      console.error(error.response.data)
    }

  }
  return (
        <FramePage>
          <h2 className=' text-center'>Bienvenue dans RenoluxAdmin</h2>
          <p className=' text-center my-3'> Connectez-vous pour continuer</p>
          <div className=' flex justify-center'>
          <form className=' flex flex-col gap-2 mb-2' onSubmit={e =>handleSubmit(e)}>
              <input value={user} onChange={e =>setUser(e.target.value)} type='text' className=' p-2 w-3/4 focus:border-blue-600  outline-none border border-black' placeholder="Nom d'utilisateur ou email"/>
              <input value={password} onChange={e =>setPassword(e.target.value)} type='password' className=' p-2 w-3/4 focus:border-blue-600  outline-none border border-black' placeholder='Mot de passe' />
              <button type='submit' className=' bg-blue-600 text-white p-1'>Connexion</button>
          </form>

          <p>Mot de passe oublie? cliquez <span className=' text-blue-600 underline'>ici</span></p>
          <p className=' my-1'>Vous n'avez pas de compte? creer en un <span className=' text-blue-600 underline'>ici</span></p>

          </div>
        </FramePage>
  )
}

export default Login