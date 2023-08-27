export const msalConfig = {
    auth: {
      clientId: "64bc672e-1efe-4b9a-963d-94e15bf439ff",
      authority: "https://login.microsoftonline.com/44962604-4809-48ba-bf6e-d1050d840cf2",
      redirectUri: "/",
      postLogoutRedirectUri: "/"
    },
    cache: {
      cacheLocation: "sessionStorage",
      storeAuthStateInCookie: false,
    }
  };
  
  export const loginRequest = {
   scopes: ["User.Read"]
  };
  
  export const graphConfig = {
      graphMeEndpoint: "Enter_the_Graph_Endpoint_Here/v1.0/me"
  };

  export const protectedResources = {
    apiturno: {
        endpoint: 'api/genero/list?search=',
        scopes: {
              read: ["api://52e5bb4a-55bd-438f-be62-42bbe3e6999f/turno.read"]
        }
    }
}