namespace GestionTurnos.Models
{
    public class RequestTurno
    {
        public int? Id { get; set; }
        public int PacienteId { get; set; }
        public string? PacienteNombre { get; set; }
        public string Motivo { get; set; }
        public string FechaTurno { get; set; }
        public string  HoraTurno { get; set; }
        public int ProfesionalId { get; set; }
        public string? ProfesionalNombre { get; set; }
        public bool? Estado { get; set; }
        public DateTime? Creado_el { get; set; }
        public string? Creado_por { get; set; }
        public string? Modificado_por { get; set; }
        public DateTime? Modificado_el { get; set; }
    }
    public class Trunos:RequestResult
    {
        public List<RequestTurno> list { get; set; }
    }
}
