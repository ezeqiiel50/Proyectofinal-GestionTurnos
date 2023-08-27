using System.ComponentModel.DataAnnotations;

namespace GestionTurnos.Models
{
    public class ResponsePaciente
    {
        public int Id { get; set; }
        public string Documento { get; set; }
        public string ApellidoNombre { get; set; }
        public bool Activo { get; set; }
    }
    public class ResponseHistorial
    {
        public int Id { get; set; }
        public string Motivo { get; set; }
        public string DescripcionCaso { get; set; }
        public DateTime CreadoEl { get; set; }
        public string CreadoPor { get; set; }
        public string Especialidad { get; set; }
        public int pacienteId { get; set; }
    }
    public class ResponsePacientes : RequestResult
    {
        public ResponsePaciente paciente { get; set; }
        public List<ResponseHistorial> list { get; set; }
    }
}
