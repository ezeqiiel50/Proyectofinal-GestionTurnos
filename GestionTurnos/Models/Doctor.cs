namespace GestionTurnos.Models
{
    public class Doctor
    {
        public int Id { get; set; }

        public string Nombre { get; set; }
        public string Especialidad { get; set; }

    }
    public class ResponseDoctores:RequestResult
    {
        public List<Doctor> list { get; set; }
    }
}
