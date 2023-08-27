namespace GestionTurnos.Constantes
{
    public class EnviromentVariables
    {
        private static IConfiguration config = new ConfigurationBuilder().AddJsonFile("appsettings.json").AddEnvironmentVariables().Build();
        
        public static string CadenaConexion()
        {
            return "";
        }
        public static string Domain()
        {
            return config.GetValue<string>("AzureAd:Domain").ToString();
        }
        public static string tenant_id()
        {
            return config.GetValue<string>("AzureAd:TenantId").ToString();
        }
        public static string client_id()
        {
            return config.GetValue<string>("AzureAd:ClientId").ToString();
        }
        public static string client_secret()
        {
            return config.GetValue<string>("Graph:clientsecret");
        }
        public static string Graph_URL()
        {
            return config.GetValue<string>("Graph:urlGraph").ToString();
        }
        public static string URL()
        {
            return config.GetValue<string>("Graph:url").ToString();
        }
        public static string grant_type()
        {
            return config.GetValue<string>("Graph:grant_type").ToString();
        }
        public static string URLWhastapp()
        {
            return config.GetValue<string>("Data:urlWhastapp").ToString();
        }
        public static string Token()
        {
            return config.GetValue<string>("Data:Token").ToString();
        }

    }
}
