export function Rurl(id){
    return 'http://localhost:3000/' + id
}

export function Rimg({url, className, alt }){
    return(
        <div className={className}><img src={url} alt={alt} className=" object-cover"/></div>
    )
}

export function Rbutton({handleClick, value, className}){
    return(
        <button className={className} onClick={handleClick}>{value}</button>
    )
}