import {Header} from "./Header"
import '../stylings/headers.scss'
import { useContext } from "react"
import { ThemeContext, widthContext } from "../App"
import {Light} from "../lib/symbols/Light"
import { Dark } from "../lib/symbols/Dark"

export default function IndexHeader(){
    const {logo} = useContext(ThemeContext);
    const {width, setWidth} = useContext(widthContext);
    const {currTheme, setCurrTheme} = useContext(ThemeContext);
    
    return <div className="flex justify-between">
        <Header logo={logo} width={width} theme={currTheme}/>
        <div>
         {currTheme === "light" ?<Light setTheme={setCurrTheme}/> : <Dark setTheme={setCurrTheme}/>}
        </div>
           
    </div>
}