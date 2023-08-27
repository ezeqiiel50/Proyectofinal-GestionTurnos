import { useState,useEffect } from "react";
import { useMsal } from "@azure/msal-react";
import { InteractionStatus, InteractionRequiredAuthError } from "@azure/msal-browser";
import { protectedResources } from "../../authConfig";
import { UserContext } from './UserContext';
import axios from "axios";

export const UserProvider = ({ children }) => {
    const { instance, inProgress, accounts } = useMsal();
    const [token, setToken] = useState();
    const [userData ,setUserData] = useState();
    const [pending ,setPending] = useState(false);
    const [error ,setError] = useState(false);
 
    useEffect(() => {
      if (inProgress === InteractionStatus.None) {
        const accessTokenRequest = {
          scopes: protectedResources.apiturno.scopes.read,
          account: accounts[0],
        };
        instance
          .acquireTokenSilent(accessTokenRequest)
          .then((accessTokenResponse) => {
            let accessToken = accessTokenResponse.accessToken;
            if(accessToken){
              setToken(accessToken);
            }
          })
          .then((response) => {
            instance
              .acquireTokenByRefreshToken({
                scopes: protectedResources.apiturno.scopes.read,
                refreshToken: response.refreshToken,
              })
              .then((response) => {
                  setToken(response.accessToken);
              });
          })
          .catch((error) => {
            if (error instanceof InteractionRequiredAuthError) {
              instance
                .acquireTokenPopup(accessTokenRequest)
                .then(function (accessTokenResponse) {
                  let accessToken = accessTokenResponse.accessToken;
                })
                .catch(function (error) {
                  console.log(error);
                });
            }
          });
      }
    }, [instance, accounts, inProgress]);

  const CallDataUser = async () => {
    setPending(true)
    if (token) {
      let config = {
        headers: {
          'Authorization': 'Bearer ' + token
        },
      }
      try {
        const { data } = await axios.get("api/Loguin/getdatauser", config);
        setUserData(data);
        setPending(false)
      } catch {
        setError(true)
        setPending(false)
      }
    }
  };

  useEffect(() => {
    if(userData === undefined){
      CallDataUser();
    }
  }, [token,userData]);
    return (<UserContext.Provider value={{token,userData,pending,error}}>{ children }</UserContext.Provider>);
};