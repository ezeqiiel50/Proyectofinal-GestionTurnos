import "bootstrap/dist/css/bootstrap.min.css"
import Login from "./components/Login/Login"
import Princiapl  from "./components/Principal/Principal";
import {UserProvider} from './components/Context/UserProvider'
import { AuthenticatedTemplate,UnauthenticatedTemplate} from "@azure/msal-react";

function App() {
    return (
        <>
            <UnauthenticatedTemplate>
                <Login/>
            </UnauthenticatedTemplate>
            <AuthenticatedTemplate>
                <UserProvider>
                   <Princiapl/>
                </UserProvider>
            </AuthenticatedTemplate>
        </>
    )
}
export default App;