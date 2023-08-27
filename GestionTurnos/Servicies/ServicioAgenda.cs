using GestionTurnos.Constantes;
using GestionTurnos.Contexto;
using GestionTurnos.Models;
using Serilog;

namespace GestionTurnos.Servicies
{
    public class ServicioAgenda
    {
        public static async Task<ResponseAgenda> ListAgenda(Context context, string fecha,int id)
        {
            var result = new ResponseAgenda { Valido = false, Codigo = Errores.Otros, list = new List<Agenda>() };
            try
            {
                var auxFecha = Convert.ToDateTime(fecha);
                var agendas = context.Turnos.Where(x => x.ProfesionalId == id && x.FechaTurno == auxFecha)
                    .Select(s => new Agenda
                    {
                        Id = s.Id,
                        PacienteId = s.PacienteId,
                        Documento = context.Pacientes.FirstOrDefault(x => x.Id == s.PacienteId).Documento,
                        ApellidoNombre = context.Pacientes.FirstOrDefault(x => x.Id == s.PacienteId).ApellidoNombre,
                        Motivo = s.Motivo,
                        FechaTurno = s.FechaTurno.ToString(),
                        HoraTurno = s.Horaturno.ToString(),
                        Activo = s.Estado
                    }).OrderByDescending(o => o.HoraTurno).ToList();

                if (agendas.Count > 0)
                {
                    result.list = agendas;
                    result.Valido = true;
                }
                else
                {
                    result.Codigo = Errores.NoEncontrado;
                    result.Valido = true;
                }
            }
            catch (Exception ex)
            {
                Log.Error("Agenda list " + ex.Message);
                result.Codigo = Errores.Otros;
                result.Valido = false;
            }
            return result;
        }

        public static async Task<RequestResult> Modificar(Context context, AuxAgenda data, int user)
        {
            var result = new RequestResult { Valido = false, Codigo = Errores.Otros };
            try
            {
                var registro = context.Turnos.FirstOrDefault(x => x.Id == data.Id);
                if (registro != null)
                {
                    registro.Estado = data.Activo;
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
                Log.Error("Agenda update " + ex.Message);
                result.Valido = false;
                result.Codigo = Errores.Otros;
            }
            return result;
        }
    }
}
