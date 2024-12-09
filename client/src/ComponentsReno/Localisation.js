import React from 'react'
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import YouTubeIcon from '@mui/icons-material/YouTube';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import {fetchLink} from '../Ttools'

const LinkMedia = ({borderColor, icon, socialNetwork, url}) => {
    return(
        <div onClick={()=>window.open(url, '_blank')} style={{border:'2px', borderColor:borderColor, }} className=' p-2 w-3/4 flex gap-2'>
            <button>{icon}</button>
            <div className=' flex items-center'>
                <p>Nous suivre sur {socialNetwork}</p>
            </div>
        </div>
    )
}

const LinkPhone = () =>{
    return(
        <div style={{border:'2px', borderColor:'rgba(57, 55, 55, 1)' }} className=' p-2 w-3/4 flex gap-2'>
            <button>{<LocalPhoneIcon/>}</button>
            <div className=' flex items-center'>
                <p>Nous Joindre par telephone</p>
            </div>
        </div>
    )
}

const SocialMedia = () =>{
    const col = ['rgba(75, 77, 199, 1)', 'rgba(108, 83, 157, 1)', 'rgba(158, 121, 121, 1)']
    const socialN = ['Facebook', 'Instagram', 'Youtube']
    const link =['https://www.facebook.com/profile.php?id=100084170042632&mibextid=ZbWKwL', 'https://www.instagram.com/renolux_cameroun?igsh=d2FrZjJmZG1yNTd6', '']
    const socialLink = [<FacebookIcon/>,<InstagramIcon/>, <YouTubeIcon/>].map((elt, indx) => <LinkMedia icon={elt} borderColor={col[indx]} url={link[indx]} socialNetwork={socialN[indx]}/>)
    const socialLinks = [...socialLink, <LinkPhone/>]
    return(
        <div className=' col-span-4 flex flex-col gap-1'>
            {socialLinks}
        </div>
    )
}

function Localisation() {
  return (
    <div className=' px-2 py-3 grid grid-cols-9 gap-1'>
        <SocialMedia/>
        <div className=' col-span-2 w-full h-full p-2'>
            <img className=' object-cover' src = {fetchLink('clientSatisfaits')} alt='Clients satisfaits'/>
        </div>
        <div className=' col-span-3 flex items-center'>
            <p>
            Avec plus de 15 projets réalisés nous
            mettons toujours nos clients en accord
            avec notre professionnalismeet notre
            dévouement
            </p>
            <br/>
            <p style={{color:'rgba(12, 140, 233, 1)'}}>Parcourrir le catalogue {' '}<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#0c8ce9"><path d="M647-440H160v-80h487L423-744l57-56 320 320-320 320-57-56 224-224Z"/></svg></p>
        </div>
    </div>
  )
}

export default Localisation