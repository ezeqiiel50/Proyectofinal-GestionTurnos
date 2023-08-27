using GestionTurnos.Constantes;
using GestionTurnos.Contexto;
using GestionTurnos.Models;
using Microsoft.Win32;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Serilog;
using System;
using System.Net;
using System.Text;
using System.Text.Json.Serialization;

namespace GestionTurnos.Servicies
{
    public class UsuarioService
    {
        public static async Task<Usuarios> Get_list(Context context, string? search)
        {
            var result = new Usuarios { Valido = false, list = new List<RequestUsuario>() };
            try
            {
                search = string.IsNullOrEmpty(search) ? string.Empty : search;

                var list = context.Usuarios.Where(x => x.ApellidoNombre.Contains(search))
                    .Select(s => new RequestUsuario
                    {
                        Id = s.Id,
                        Documento = s.Documento,
                        ApellidoNombre = s.ApellidoNombre,
                        Direccion = s.Direccion,
                        Telefono = s.Telefono,
                        PerfilId = s.PerfilId,
                        emailUser = s.EmailUser,
                        PerfilDescripcion = s.Perfil.Descripcion,
                        EspecializacionId = s.EspecializacionId,
                        EspecDescripcion = s.Especializacion.Descripcion,
                        GeneroId = s.GeneroId,
                        GeneroDescripcion = s.Genero.Descripcion,
                        Activo = s.Activo,
                    }).ToList();

                if (list.Count > 0)
                {
                    result.list = list;
                    result.Valido = true;
                }else
                {
                    result.Valido = true;
                    result.Codigo = Errores.SinRegistrosCargados;
                }
            }
            catch (Exception ex)
            {
                Log.Error("Usuario list" + ex.Message);
                result.Codigo = Errores.Otros;
                result.Valido = false;
            }
            return result;
        }
        public static async Task<RequestResult> Insert_registro(Context context, RequestUsuario nuevo, int user)
        {
            var result = new RequestResult { Valido = false,Codigo = Errores.Otros };
            try
            {
                var existe = context.Usuarios.FirstOrDefault(x => x.Documento == nuevo.Documento);
                if (existe == null)
                {
                    var new_registro = new Usuario
                    {
                        Documento = nuevo.Documento,
                        ApellidoNombre = nuevo.ApellidoNombre,
                        Direccion = nuevo.Direccion,
                        Telefono = nuevo.Telefono,
                        PerfilId = nuevo.PerfilId,
                        EspecializacionId = nuevo.EspecializacionId,
                        GeneroId = nuevo.GeneroId,
                        Activo = nuevo.Activo,
                        CreadoEl = DateTime.Now,
                        CreadoPor = user,
                        ModificadoEl = DateTime.Now,
                        ModificadoPor = user,
                    };
                    await context.AddAsync(new_registro);
                    await context.SaveChangesAsync();
                    
                    nuevo.Id = new_registro.Id;
                    nuevo.emailUser = nuevo.ApellidoNombre.Split(" ")[0].ToLower() + "." + new_registro.Id+"@" + EnviromentVariables.Domain();

                    var aux = await CrearUserAzure(nuevo);
                    if (aux.Valido)
                    {
                        result.Valido = true;
                        var registro = context.Usuarios.FirstOrDefault(x => x.Id == nuevo.Id);
                        registro.EmailUser = nuevo.emailUser;
                        context.SaveChanges();

                        var pass = nuevo.ApellidoNombre.Substring(0, 1).ToUpper() + nuevo.Documento + "$$";

                        var listH = new List<Parameter>
                        { new Parameter() { type = "text", text = nuevo.ApellidoNombre } };
                        var listB = new List<Parameter>
                        { 
                            new Parameter() { type = "text", text = nuevo.emailUser },
                            new Parameter() { type = "text", text = pass },
                        };
                        var data = new Componentes { list = new List<Cuerpo>
                        { 
                            new Cuerpo() { Type = "header", param = listH },
                            new Cuerpo() { Type = "body", param = listB },
                        }};
                        

                        result.Valido = await UtilServicio.EnviarWhastapp("", "confirmacionaltauser",data);
                    }
                    else
                    {
                        result.Valido = true; 
                        result.Codigo = Errores.Fallo;
                        var registro = context.Usuarios.FirstOrDefault(x => x.Id == nuevo.Id);
                        context.Remove(registro);
                        context.SaveChanges();
                    }
                }
                else
                {
                    result.Valido = true;
                    result.Codigo = Errores.YaExiste;
                }
            }
            catch (Exception ex)
            {
                Log.Error("Usuario Insert" + ex.Message);
                result.Codigo = Errores.Otros;
                result.Valido = false;
            }
            return result;
        }
        public static async Task<RequestResult> Modificar_registro(Context context, RequestUsuario nuevo, int user)
        {
            var result = new RequestResult { Valido = false };
            try
            {
                var noMio = context.Usuarios.FirstOrDefault(x => x.Documento == nuevo.Documento);
                var esMio = context.Usuarios.FirstOrDefault(x => x.Id == nuevo.Id && x.Documento == nuevo.Documento);

                var validar = noMio == esMio ? true : false;

                var registro = context.Usuarios.FirstOrDefault(x => x.Id == nuevo.Id);
                var aux = registro.Activo;
                if (registro != null && validar)
                {
                    registro.Documento = nuevo.Documento;
                    registro.ApellidoNombre = nuevo.ApellidoNombre;
                    registro.Direccion = nuevo.Direccion;
                    registro.Telefono = nuevo.Telefono;
                    registro.PerfilId = nuevo.PerfilId;
                    registro.EspecializacionId = nuevo.EspecializacionId;
                    registro.GeneroId = nuevo.GeneroId;
                    registro.Activo = nuevo.Activo;
                    registro.CreadoEl = registro.CreadoEl;
                    registro.CreadoPor = registro.CreadoPor;
                    registro.ModificadoEl = DateTime.Now;
                    registro.ModificadoPor = user;

                    await context.SaveChangesAsync();
                    if (aux != nuevo.Activo)
                    {
                        await ModificarUserAzure(nuevo.Activo, registro.EmailUser.Split("@")[0]);
                    }
                    result.Valido = true;
                }
                else
                {
                    result.Valido = true;
                    result.Codigo = Errores.YaExiste;
                }
            }
            catch (Exception ex)
            {
                Log.Error("Usuario Update" + ex.Message);
                result.Codigo = Errores.Otros;
                result.Valido = false;
            }
            return result;
        }
        private static async Task<RequestResult> CrearUserAzure(RequestUsuario user)
        {
            var result = new RequestResult { Valido = false };
            try
            {
                var newUser = new AzureUser
                {
                    accountEnabled = user.Activo,
                    city = null,
                    country = "Argentina",
                    department = user.PerfilDescripcion,
                    displayName = user.ApellidoNombre,
                    givenName = user.ApellidoNombre.Split(" ")[1],
                    jobTitle = user.EspecDescripcion,
                    mailNickname = user.ApellidoNombre.Split(" ")[1].ToString(),
                    passwordPolicies = "DisablePasswordExpiration",
                    passwordProfile = new PasswordProfile
                    {
                        password =user.ApellidoNombre.Substring(0,1).ToUpper() + user.Documento+"$$",
                        forceChangePasswordNextSignIn = true,
                    },
                    officeLocation = null,
                    postalCode = null,
                    preferredLanguage = "es-ES",
                    state = null,
                    streetAddress = user.Direccion,
                    surname = user.ApellidoNombre.Split(" ")[0],
                    mobilePhone = user.Telefono,
                    usageLocation = "AR",
                    userPrincipalName = user.emailUser,
                };
                var token = await GetTokenAzureAd();
                var body = JsonConvert.SerializeObject(newUser);
                var client = new HttpClient();
                var httpRequestMessage = new HttpRequestMessage
                {
                    Method = HttpMethod.Post,
                    RequestUri = new Uri(EnviromentVariables.Graph_URL() + "/v1.0/users"),
                    Headers =
                    {
                        {HttpRequestHeader.Authorization.ToString(),"Bearer "+token}
                    },
                    Content = (HttpContent)new StringContent(body, Encoding.UTF8, "application/json"),
                };
                var response = client.SendAsync(httpRequestMessage).Result;
                if (response.IsSuccessStatusCode)
                {
                    result.Valido = true;
                }
            }
            catch (Exception ex)
            {
                Log.Error("CrearUserAzure " + ex.Message);
                result.Codigo = Errores.Otros;
                result.Valido = false;
            }
            return result;
        }
        private static async Task<RequestResult> ModificarUserAzure(bool account,string user)
        {
            var result = new RequestResult { Valido= false};
            try
            {
                var accountEnable = new Account { accountEnabled = account };
                var token = await GetTokenAzureAd();
                var id = await SearchUserAzureAd(user);
                var body = JsonConvert.SerializeObject(accountEnable);

                var client = new HttpClient();
                var httpRequestMessage = new HttpRequestMessage
                {
                    Method = HttpMethod.Patch,
                    RequestUri = new Uri(EnviromentVariables.Graph_URL() + "/v1.0/users/"+ id),
                    Headers =
                    {
                        {HttpRequestHeader.Authorization.ToString(),"Bearer "+token}
                    },
                    Content = (HttpContent)new StringContent(body, Encoding.UTF8, "application/json"),
                };
                var response = client.SendAsync(httpRequestMessage).Result;
                if (response.IsSuccessStatusCode)
                {
                    result.Valido = true;
                }
            }
            catch (Exception ex)
            {
                Log.Error("ModificarUserAzure " + ex.Message);
                result.Codigo = Errores.Otros;
                result.Valido = false;
            }
            return result;
        }
        private static async Task<string> SearchUserAzureAd(string searh)
        {
            var result = "";
            var token = await GetTokenAzureAd();
            try
            {
                var aux = new UserAzure();
                var client = new HttpClient();
                var httpRequestMessage = new HttpRequestMessage
                {
                    Method = HttpMethod.Get,
                    RequestUri = new Uri(EnviromentVariables.Graph_URL() + "/v1.0/users?" + "%24filter=startswith(userPrincipalName,'" + searh + "')"),
                    Headers =
                    {
                       {HttpRequestHeader.Authorization.ToString(),"Bearer "+ token}
                    },
                };
                var response = client.SendAsync(httpRequestMessage).Result;
                if (response.IsSuccessStatusCode)
                {
                    aux = JsonConvert.DeserializeObject<UserAzure>(response.Content.ReadAsStringAsync().Result.ToString());
                }
                if (aux != null) 
                {
                   result = aux.value[0].id.ToString();
                }
            }
            catch (Exception ex)
            {
                Log.Error("SearchUserAzureAd " + ex.Message);
                result = null;
            }
            return result;
        }
        private static async Task<string> GetTokenAzureAd()
        {
            var result = "";
            var data = new[]{
                new KeyValuePair<string, string>("client_id",EnviromentVariables.client_id()),
                new KeyValuePair<string, string>("client_secret", EnviromentVariables.client_secret()),
                new KeyValuePair<string, string>("scope", EnviromentVariables.Graph_URL()+"/.default"),
                new KeyValuePair<string, string>("grant_type", EnviromentVariables.grant_type()),
            };
            try
            {
                var client = new HttpClient();
                var httpRequestMessage = new HttpRequestMessage
                {
                    Method = HttpMethod.Post,
                    RequestUri = new Uri(EnviromentVariables.URL() + "/" + EnviromentVariables.tenant_id() + "/oauth2/v2.0/token"),
                    Content = new FormUrlEncodedContent(data),
                    Headers =
                    {
                        {HttpRequestHeader.ContentType.ToString(),"application/x-www-form-urlencoded"}
                     }
                };
                var response = client.SendAsync(httpRequestMessage).Result;
                if (response.IsSuccessStatusCode)
                {
                    var Responsetoken = JsonConvert.DeserializeObject<Auth>(response.Content.ReadAsStringAsync().Result);
                    result = Responsetoken.access_token;
                }

            }
            catch (Exception ex)
            {
                result = null;
                Log.Error("GetTokenAzureAd " + ex.Message);
            }
            return result;
        }

    }
}
