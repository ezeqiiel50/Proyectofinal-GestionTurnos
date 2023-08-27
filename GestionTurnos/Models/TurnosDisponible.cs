namespace GestionTurnos.Models
{
    public class TurnosDisponible:RequestResult
    {
        public string NombreDoctor { get; set; }
        public string Especialidad { get; set; }
        public List<TimeSpan> Horarios { get; set; }
    }
}
