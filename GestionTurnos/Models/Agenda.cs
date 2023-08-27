namespace GestionTurnos.Models
{
    public class Agenda
    {
        public int Id { get; set; }
        public int PacienteId { get; set; }
        public string Documento { get; set; }
        public string ApellidoNombre { get; set; }
        public string Motivo { get; set; }
        public string FechaTurno { get; set; }
        public string HoraTurno { get; set; }
        public bool Activo { get; set; }

    }
    public class ResponseAgenda:RequestResult
    {
        public List<Agenda> list { get; set; }
    } 
}
