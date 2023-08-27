using GestionTurnos.Constantes;
using GestionTurnos.Contexto;
using GestionTurnos.Models;
using Newtonsoft.Json;
using Serilog;
using System.Net;
using System.Text;

namespace GestionTurnos.Servicies
{
    public class UtilServicio
    {
        public static async Task<int> BuscarUsuarioLogeado(Context context,string EmailUser)
        {
            var result = 0;
            try
            {
                var aux = context.Usuarios.FirstOrDefault(x => x.EmailUser == EmailUser).Id;
                if (aux != null)
                {
                    result = aux;
                }
            }
            catch (Exception ex)
            {
                Log.Error("BuscarUsuarioLogeado " + ex.Message);
            }
            return result;
        }
        public static async Task<bool> EnviarWhastapp(string tel,string templateName,Componentes data)
        {
            var result = false;
            try
            {
                var comp = new List<Component>();

                foreach (var item in data.list)
                {
                    comp.Add(new Component { type = item.Type,parameters = item.param});
                }

                var lang = new Language() { code="en"};
                var template = new Template()
                {
                    name = templateName,
                    language = lang,
                    components = comp
                };
                var wp = new Whastapp()
                {
                    messaging_product = "whatsapp",
                    to = tel,
                    type = "template",
                    template = template
                };

                var body = JsonConvert.SerializeObject(wp);
                var uri = EnviromentVariables.URLWhastapp();
                var token = EnviromentVariables.Token();

                var client = new HttpClient();
                var httpRequestMessage = new HttpRequestMessage 
                {
                    Method = HttpMethod.Post,
                    RequestUri = new Uri(uri),
                    Content = new StringContent(body, Encoding.UTF8,"application/json"),
                    Headers =
                    {
                        {HttpRequestHeader.Accept.ToString(),"application/json"},
                        {HttpRequestHeader.Authorization.ToString(),"Bearer " + token }
                    }
                };
                var response = client.SendAsync(httpRequestMessage).Result;
                if (response.IsSuccessStatusCode)
                {
                    result = true;
                }
            }
            catch (Exception ex)
            {
                Log.Error("EnviarWhastapp " + ex.Message);
            }
            return result;
        }
    }
}
