namespace GestionTurnos.Models
{
    public class RequestArchivo
    {
        public int? Id { get; set; }
        public string NombreTipo { get; set; }
        public string Archivo { get; set; }
        public int HistorilId { get; set; }
    }
    public class Archivos:RequestResult
    {
        public List<RequestArchivo> list { get; set; }
    }
}
