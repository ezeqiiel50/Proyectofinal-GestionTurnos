using GestionTurnos.Constantes;
using GestionTurnos.Contexto;
using GestionTurnos.Models;
using Microsoft.Win32;
using Serilog;

namespace GestionTurnos.Servicies
{
    public class TurnoServicio
    {
        public static async Task<ResponseDoctores> ListDoctores(Context context)
        {
            var result = new ResponseDoctores { Valido = false, Codigo = Errores.Otros, list = new List<Doctor>() };
            try
            {
                var doctores = context.Usuarios.Where(x => x.PerfilId != 1 && x.PerfilId != 2 && x.Activo == true).Select(s => new Doctor
                {
                    Id = s.Id,
                    Nombre = s.ApellidoNombre,
                    Especialidad = s.Especializacion.Descripcion
                }).ToList();

                if(doctores.Count > 0)
                {
                    result.list = doctores;
                    result.Valido = true;
                }
                else
                {
                    result.Codigo = Errores.Fallo;
                    result.Valido = true;
                }
            }
            catch (Exception ex)
            {
                Log.Error("Turno list Doctores " + ex.Message);
                result.Codigo = Errores.Otros;
                result.Valido = false;
            }
            return result;
        }
        public static async Task<TurnosDisponible> ListTurnos(Context context, string? fecha,int id)
        {
            var result = new TurnosDisponible { Valido = false, Codigo = Errores.Otros, Horarios = new List<TimeSpan>() };
            try
            {
                var doctor = context.Usuarios.FirstOrDefault(x => x.Id == id && x.Activo == true);
                if(doctor != null)
                {
                    var horarios = new List<TimeSpan>(){
                    new TimeSpan(8,00,0),
                    new TimeSpan(8,30,0),
                    new TimeSpan(9,00,0),
                    new TimeSpan(9,30,0),
                    new TimeSpan(10,00,0),
                    new TimeSpan(10,30,0),
                    new TimeSpan(11,00,0),
                    new TimeSpan(11,30,0),
                    new TimeSpan(12,30,0),
                    new TimeSpan(13,00,0),
                };
                    result.NombreDoctor = doctor.ApellidoNombre;
                    result.Especialidad = context.Especializacions.FirstOrDefault(x => x.Id == doctor.EspecializacionId).Descripcion;

                    var fechaAux = string.IsNullOrEmpty(fecha) ? DateTime.Now.Date : Convert.ToDateTime(fecha);

                    var ListOcupados = context.Turnos.Where(x => x.FechaTurno == fechaAux && x.ProfesionalId == id).ToList();
                    foreach (var ocupados in ListOcupados)
                    {
                        if (horarios.Contains(ocupados.Horaturno))
                        {
                            horarios.Remove(ocupados.Horaturno);
                        }
                    }
                    if (horarios.Count > 0)
                    {
                        result.Horarios.AddRange(horarios);
                        result.Valido = true;
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
                Log.Error("Turno list " + ex.Message);
                result.Codigo = Errores.Otros;
                result.Valido = false;
            }
            return result;
        }
        public static async Task<ResponseTurnos> ListTurnosOcupados(Context context, string paciente)
        {
            var result = new ResponseTurnos { Valido = false, Codigo = Errores.Otros, Turnos = new List<TurnosOcupados>(), 
                paciente = new breve()};
            try
            {
                var pct = context.Pacientes.FirstOrDefault(x => x.Documento == paciente);
                if (pct != null)
                {
                    var aux = context.Turnos.Where(x => x.PacienteId == pct.Id).Select(s => new TurnosOcupados
                    {
                        Id = s.Id,
                        Motivo = s.Motivo,
                        FechaTurno = s.FechaTurno.ToString(),
                        HoraTurno = s.Horaturno.ToString(),
                        ApellidoProfesion = s.Profesional.ApellidoNombre +" " +s.Profesional.Especializacion.Descripcion,
                        ProfesionalId = s.ProfesionalId,
                    }).OrderByDescending(c => c.FechaTurno).ToList();

                    if (aux.Count > 0)
                    {

                        result.paciente = new breve() { PacientId = pct.Id, ApellidoNombre = pct.ApellidoNombre };
                        result.Turnos = aux;
                        result.Valido = true;
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
                Log.Error("Turno list " + ex.Message);
                result.Codigo = Errores.Otros;
                result.Valido = false;
            }
            return result;
        }
        public static async Task<RequestResult> InsertTurno(Context context, RequestTurno nuevo, int user)
        {
            var result = new RequestResult { Valido = false };
            try
            {
                var fecha = Convert.ToDateTime(nuevo.FechaTurno);
                var existe = context.Turnos.FirstOrDefault(x => x.PacienteId == nuevo.PacienteId && 
                (x.FechaTurno == fecha && x.Horaturno == TimeSpan.Parse(nuevo.HoraTurno) && x.ProfesionalId == nuevo.ProfesionalId));

                if (existe == null)
                {
                    var paciente = context.Pacientes.FirstOrDefault(x=> x.Documento == nuevo.PacienteId.ToString());
                    var activo = string.IsNullOrEmpty(nuevo.Estado.ToString()) ? false:true;
                    var new_registro = new Turno
                    {
                        PacienteId = paciente.Id,
                        Motivo = nuevo.Motivo,
                        FechaTurno = fecha,
                        Horaturno = TimeSpan.Parse(nuevo.HoraTurno),
                        ProfesionalId = nuevo.ProfesionalId,
                        Estado = activo,
                        CreadoEl = DateTime.Now,
                        CreadoPor = user,
                        ModificadoEl = DateTime.Now,
                        ModificadoPor = user,
                    };
                    await context.AddAsync(new_registro);
                    await context.SaveChangesAsync();

                    var auxFecha = fecha.Day +"/"+ fecha.Month.ToString();

                    var nombreDocto = context.Usuarios.FirstOrDefault(x => x.Id == nuevo.ProfesionalId).ApellidoNombre;
                    var auxHora = nuevo.HoraTurno.Split(":")[0] +":"+ nuevo.HoraTurno.Split(":")[1];

                    var listH = new List<Parameter>
                        { new Parameter() { type = "text", text = paciente.ApellidoNombre } };
                    var listB = new List<Parameter>
                        {
                            new Parameter() { type = "text", text = auxFecha },
                            new Parameter() { type = "text", text = auxHora },
                            new Parameter() { type = "text", text = nombreDocto },
                        };
                    var data = new Componentes
                    {
                        list = new List<Cuerpo>
                        {
                            new Cuerpo() { Type = "header", param = listH },
                            new Cuerpo() { Type = "body", param = listB },
                        }
                    };


                    result.Valido = await UtilServicio.EnviarWhastapp("", "confirmacionturno", data);
                }
                else
                {
                    result.Valido = true;
                    result.Codigo = Errores.YaExiste;
                }
            }
            catch (Exception ex)
            {
                Log.Error("Turno insert" + ex.Message);
                result.Codigo = Errores.Otros;
                result.Valido = false;
            }
            return result;
        }
        public static async Task<RequestResult> Borrar(Context context, ModeloAux id)
        {
            var result = new RequestResult { Valido = false };
            try
            {
                var turno = context.Turnos.FirstOrDefault(x=>x.Id == id.Id);
                context.Remove(turno);
                context.SaveChanges();
                result.Valido = true;
            }
            catch (Exception ex)
            {
                Log.Error("Turno Borrar" + ex.Message);
                result.Codigo = Errores.Otros;
                result.Valido = false;
            }
            return result;
        }
        public static async Task<RequestResult> Modificar(Context context, TurnoUpdate data,int user)
        {
            var result = new RequestResult { Valido = false };
            try
            {
                var turno = context.Turnos.FirstOrDefault(x => x.Id == data.Id);
                if (turno != null)
                {
                    var fechaOld = turno.FechaTurno;
                    var horaOld = turno.Horaturno;

                    turno.FechaTurno = Convert.ToDateTime(data.FechaTurno);
                    turno.Horaturno = TimeSpan.Parse(data.HoraTurno);
                    turno.Motivo = data.Motivo;
                    turno.CreadoEl = turno.CreadoEl;
                    turno.CreadoPor = turno.CreadoPor;
                    turno.ModificadoEl = DateTime.Now;
                    turno.ModificadoPor = user;
                    context.SaveChanges();


                    if ( fechaOld != turno.FechaTurno || horaOld != turno.Horaturno) 
                    {
                        var auxFecha = turno.FechaTurno.Day +"/"+ turno.FechaTurno.Month.ToString();

                        var nombreDocto = context.Usuarios.FirstOrDefault(x => x.Id == turno.ProfesionalId).ApellidoNombre;
                        var nombrePaciente  = context.Pacientes.FirstOrDefault(x => x.Id == turno.PacienteId).ApellidoNombre;
                        var auxHora = data.HoraTurno.Split(":")[0] + ":" + data.HoraTurno.Split(":")[1];

                        var listH = new List<Parameter>
                        { new Parameter() { type = "text", text = nombrePaciente } };

                        var listB = new List<Parameter>
                        {
                            new Parameter() { type = "text", text = auxFecha },
                            new Parameter() { type = "text", text = auxHora },
                            new Parameter() { type = "text", text = nombreDocto },
                        };
                        var dataW = new Componentes { list = new List<Cuerpo> {
                            new Cuerpo() { Type = "header", param = listH },
                            new Cuerpo() { Type = "body", param = listB },
                        }};
                        result.Valido = await UtilServicio.EnviarWhastapp("", "confirmacionturno", dataW);
                    }
                    else
                    {
                        result.Valido = true;
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
                Log.Error("Turno Borrar" + ex.Message);
                result.Codigo = Errores.Otros;
                result.Valido = false;
            }
            return result;
        }
    }
}
