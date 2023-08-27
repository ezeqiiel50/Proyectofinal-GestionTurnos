namespace GestionTurnos.Models
{
    public class ResponseTurnos: RequestResult
    {
        public breve paciente { get; set; }

        public List<TurnosOcupados> Turnos { get; set; }
    }
    public class breve
    {
        public int PacientId { get; set; }
        public string ApellidoNombre { get; set; }
    }
    public class TurnosOcupados
    {
        public int Id { get; set; }
        public string Motivo { get; set; }
        public string FechaTurno { get; set; }
        public string HoraTurno { get; set; }
        public int ProfesionalId { get; set; }
        public string ApellidoProfesion { get; set; }
    }
}
