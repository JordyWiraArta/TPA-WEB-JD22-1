import { useContext } from "react"
import { Audio } from "react-loader-spinner"
import { ThemeContext } from "../App"

export const LoadingText: React.FC<{}> = ({})=>{

    const {currTheme} = useContext(ThemeContext);

    return <div className={""+currTheme} id="container">
    <p className="text" id="title">loading</p>
    <Audio
    height="80"
    width="80"
    color={currTheme === "light" ? "black" : "white"}
    ariaLabel="loading"
    />
</div>
}