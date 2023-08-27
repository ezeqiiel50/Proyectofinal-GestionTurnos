using GestionTurnos.Constantes;
using GestionTurnos.Contexto;
using GestionTurnos.Models;
using Serilog;

namespace GestionTurnos.Servicies
{
    public class HistorialServicie
    {
        public static async Task<ResponsePacientes> Get_list(Context context, string? search)
        {
            var result = new ResponsePacientes { Valido = false, list = new List<ResponseHistorial>(), 
                paciente = new ResponsePaciente() };
            try
            {
                var pct = context.Pacientes.FirstOrDefault(x=> x.Documento == search);
                if (pct != null)
                {
                    result.paciente = new ResponsePaciente { 
                        Id = pct.Id,
                        Activo = pct.Activo,
                        Documento = pct.Documento,
                        ApellidoNombre = pct.ApellidoNombre
                    };

                    var list = context.Historials.Where(x => x.PacienteId == pct.Id).Select(s => new ResponseHistorial
                    {
                        Id = s.Id,
                        Motivo = s.Motivo,
                        DescripcionCaso = s.DescripcionCaso,
                        pacienteId = s.PacienteId,
                        CreadoEl = s.CreadoEl,
                        CreadoPor = context.Usuarios.FirstOrDefault(u => u.Id == s.CreadoPor).ApellidoNombre.ToString(),
                        Especialidad = context.Usuarios.FirstOrDefault(u => u.Id == s.CreadoPor).Especializacion.Descripcion.ToString(),

                    }).OrderByDescending(c => c.CreadoEl).ToList();

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
                else
                {
                    result.Valido = true;
                    result.Codigo = Errores.NoEncontrado;
                }
            }
            catch (Exception ex)
            {
                Log.Error("Historial list " + ex.Message);
                result.Codigo = Errores.Otros;
                result.Valido = false;
            }
            return result;
        }
        public static async Task<RequestResult> Insert_registro(Context context, RequestHistorial nuevo, int user)
        {
            var result = new RequestResult { Valido = false };
            try
            {
                var existe = context.Historials.FirstOrDefault(x => x.Id == nuevo.Id);
                if (existe == null)
                {
                    var new_registro = new Historial
                    {
                        Motivo = nuevo.Motivo,
                        DescripcionCaso = nuevo.DescripcionCaso,
                        PacienteId = nuevo.PacienteId,
                        Activo = true,
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
                Log.Error("Historial list " + ex.Message);
                result.Codigo = Errores.Otros;
                result.Valido = false;
            }
            return result;
        }
        public static async Task<RequestResult> Modificar_registro(Context context, RequestHistorial nuevo, int user)
        {
            var result = new RequestResult { Valido = false };
            try
            {
                var registro = context.Historials.FirstOrDefault(x => x.Id == nuevo.Id);
                if (registro != null)
                {
                    registro.Motivo = nuevo.Motivo;
                    registro.DescripcionCaso = nuevo.DescripcionCaso;
                    registro.PacienteId = nuevo.PacienteId;
                    registro.Activo = true;
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
                Log.Error("Historial list " + ex.Message);
                result.Codigo = Errores.Otros;
                result.Valido = false;
            }
            return result;
        }
    }
}
