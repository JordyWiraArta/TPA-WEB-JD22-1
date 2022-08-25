import { useContext } from "react"

export const Header: React.FC<{logo:string, width:number, theme:string}> = ({logo, width, theme}) => {

    return <div className={theme}>
        {width > 800  && <img className="logo" src={logo} alt="" />}
        {width < 800 && width >500 && <img className="logo-md" src={logo} alt="" />}
        {width < 500 && <img className="logo-sm" src={logo} alt="" />}
    </div>
}