const express = require('express')
const axios = require('axios')
const router = express.Router()


const CLIENT_ID = '1014883783153-k8bld04l4j39guep66olsoseqdb7s959.apps.googleusercontent.com'
const CLIENT_SECRET = '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'
const REDIRECT_URI = 'http://localhost:3000/auth/google/callback'

router.get('/auth/google', (req, res)=>{
    const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=profile email`;
    res.redirect(url)
})

router.get('/auth/google/callback', async(req, res)=>{
    const {code} = req.query
    try{ 
    const {data} = await axios.post('https://oauth2.googleapis.com/token', {
        client_id:CLIENT_ID,
        client_secret:CLIENT_SECRET,
        code,
        redirect_uri:REDIRECT_URI,
        grant_type:'authorization_code'
    })
    const {access_token, id_token} = data
    const {data:profile} = await axios.get('https://www.googleapis.com/oauth2/v1/userinfo',{
        headers:{Authorization: `Bearer ${access_token}`}
    })
    console.log(profile)
    res.send(profile)
    
    
} catch(error){
console.error('Error:', error.response.data.error)
}
})


module.exports = router