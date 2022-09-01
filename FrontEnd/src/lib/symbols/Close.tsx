export const Close:React.FC<{setOpen:Function}> = ({setOpen})=>{
    return <svg onClick={()=> setOpen(false)} className="icon" id="close" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" >
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m-15 0l15 15" />
  </svg>
  
}