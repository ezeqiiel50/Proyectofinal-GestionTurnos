using GestionTurnos.Constantes;
using GestionTurnos.Contexto;
using GestionTurnos.Models;
using Serilog;

namespace GestionTurnos.Servicies
{
    public class EspecializacionService
    {
        public static async Task<Especializaciones> Get_Especializacion(Context context, string? search)
        {
            var result = new Especializaciones { Valido = false, list = new List<RequestEspecializacion>() };
            try
            {
                search = string.IsNullOrEmpty(search) ? string.Empty : search;

                var list = context.Especializacions.Where(x => x.Descripcion.Contains(search))
                    .Select(s => new RequestEspecializacion
                    {
                        Id = s.Id,
                        Descripcion = s.Descripcion,
                        Activo = s.Activo,
                    }).ToList();

                if (list.Count > 0)
                {
                    result.list = list;
                    result.Valido = true;
                }
                else
                {
                    result.Valido = true;
                    result.Codigo = Errores.SinRegistrosCargados;
                }
            }
            catch (Exception ex)
            {
                Log.Error("Especializacion list " + ex.Message);
                result.Codigo = Errores.Otros;
                result.Valido = false;
            }
            return result;
        }
        public static async Task<RequestResult> Insert_Especializacion(Context context, RequestEspecializacion nuevo, int user)
        {
            var result = new RequestResult { Valido = false };
            try
            {
                var existe = context.Especializacions.FirstOrDefault(x => x.Descripcion == nuevo.Descripcion);
                if (existe == null)
                {
                    var new_registro = new Especializacion
                    {
                        Descripcion = nuevo.Descripcion,
                        Activo = nuevo.Activo,
                        CreadoEl = DateTime.Now,
                        CreadoPor = user,
                        ModificadoEl = DateTime.Now,
                        ModificadoPor = user,
                    };
                    await context.AddAsync(new_registro);
                    await context.SaveChangesAsync();
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
                Log.Error("Especializacion insert" + ex.Message);
                result.Codigo = Errores.Otros;
                result.Valido = false;
            }
            return result;
        }
        public static async Task<RequestResult> Modificar_Especializacion(Context context, RequestEspecializacion nuevo, int user)
        {
            var result = new RequestResult { Valido = false };
            try
            {
                var noMio = context.Especializacions.FirstOrDefault(x => x.Descripcion == nuevo.Descripcion);
                var esMio = context.Especializacions.FirstOrDefault(x => x.Id == nuevo.Id && x.Descripcion == nuevo.Descripcion);

                var validar = noMio == esMio ? true : false;

                var registro = context.Especializacions.FirstOrDefault(x => x.Id == nuevo.Id);
                if (registro != null && validar)
                {
                    registro.Descripcion = nuevo.Descripcion;
                    registro.Activo = nuevo.Activo;
                    registro.CreadoEl = registro.CreadoEl;
                    registro.CreadoPor = registro.CreadoPor;
                    registro.ModificadoEl = DateTime.Now;
                    registro.ModificadoPor = user;

                    await context.SaveChangesAsync();
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
                Log.Error("Especializacion update " + ex.Message);
                result.Codigo = Errores.Otros;
                result.Valido = false;
            }
            return result;
        }
    }
}
