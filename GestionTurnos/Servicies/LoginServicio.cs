using GestionTurnos.Constantes;
using GestionTurnos.Contexto;
using GestionTurnos.Models;
using Serilog;

namespace GestionTurnos.Servicies
{
    public class LoginServicio
    {
        public static async Task<UserInfo> UserData(Context context, string user)
        {
            var result = new UserInfo { Valido = false, Codigo = Errores.Otros, RolName = null };
            try
            {
               var usuario = context.Usuarios.FirstOrDefault(x => x.EmailUser == user);
                if (usuario != null)
                {
                    var aux = usuario.PerfilId;
                    switch (aux)
                    {
                        case 1:
                            result.RolName = "ADMIN";
                            break;
                        case 2:
                            result.RolName = "SECRE";
                            break;
                        case 13:
                            result.RolName = "DOCTOR";
                            break;
                        default:
                            result.RolName = "OTROS";
                            break;
                    }
                    result.Valido = true;
                }
                else
                {
                    result.Codigo = Errores.NoEncontrado;
                }
            }
            catch (Exception ex)
            {
                Log.Error("User Data " + ex.Message);
                result.Codigo = Errores.Otros;
                result.Valido = false;
            }
            return result;
        }
    }
}
