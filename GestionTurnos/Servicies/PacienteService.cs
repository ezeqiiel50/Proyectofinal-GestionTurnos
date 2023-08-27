using GestionTurnos.Constantes;
using GestionTurnos.Contexto;
using GestionTurnos.Models;
using Serilog;

namespace GestionTurnos.Servicies
{
    public class PacienteService
    {
        public static async Task<Pacientes> Get_list(Context context, string? search)
        {
            var result = new Pacientes { Valido = false,Codigo = Errores.Otros, list = new List<RequestPaciente>() };
            try
            {
                var list = new List<RequestPaciente>();

                if (string.IsNullOrEmpty(search))
                {
                    list = context.Pacientes.Select(s => new RequestPaciente
                    {
                        Id = s.Id,
                        Documento = s.Documento,
                        ApellidoNombre = s.ApellidoNombre,
                        Telefono = s.Telefono,
                        Direccion = s.Direccion,
                        GeneroId = s.GeneroId,
                        GeneroDescripcion = s.Genero.Descripcion,
                        Activo = s.Activo,
                    }).ToList();

                }
                else
                {
                    list = context.Pacientes.Where(x => x.Documento == search)
                    .Select(s => new RequestPaciente
                    {
                        Id = s.Id,
                        Documento = s.Documento,
                        ApellidoNombre = s.ApellidoNombre,
                        Telefono = s.Telefono,
                        Direccion = s.Direccion,
                        GeneroId = s.GeneroId,
                        GeneroDescripcion = s.Genero.Descripcion,
                        Activo = s.Activo,
                    }).ToList();
                }

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
                Log.Error("Paciente list " + ex.Message);
                result.Valido = false;
                result.Codigo = Errores.Otros;
            }
            return result;
        }
        public static async Task<RequestResult> Insert_registro(Context context, RequestPaciente nuevo, int user)
        {
            var result = new Usuarios { Valido = false };
            try
            {
                var existe = context.Pacientes.FirstOrDefault(x => x.Documento == nuevo.Documento);
                if (existe == null)
                {
                    var new_registro = new Paciente
                    {
                        Documento = nuevo.Documento,
                        ApellidoNombre = nuevo.ApellidoNombre,
                        Telefono = nuevo.Telefono,
                        Direccion = nuevo.Direccion,
                        GeneroId = nuevo.GeneroId,
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
                Log.Error("Paciente insert" + ex.Message);
                result.Valido = false;
                result.Codigo = Errores.Otros;
            }
            return result;
        }
        public static async Task<RequestResult> Modificar_registro(Context context, RequestPaciente nuevo, int user)
        {
            var result = new RequestResult { Valido = false };
            try
            {
                var noMio = context.Pacientes.FirstOrDefault(x => x.Documento == nuevo.Documento);
                var esMio = context.Pacientes.FirstOrDefault(x => x.Id == nuevo.Id && x.Documento == nuevo.Documento);

                var validar = noMio == esMio ? true : false;

                var registro = context.Pacientes.FirstOrDefault(x => x.Id == nuevo.Id);
                if (registro != null && validar)
                {
                    registro.Documento = nuevo.Documento;
                    registro.ApellidoNombre = nuevo.ApellidoNombre;
                    registro.Telefono = nuevo.Telefono;
                    registro.Direccion = nuevo.Direccion;
                    registro.GeneroId = nuevo.GeneroId;
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
                Log.Error("Paciente update" + ex.Message);
                result.Valido = false;
                result.Codigo = Errores.Otros;
            }
            return result;
        }
    }
}
