using System.ComponentModel.DataAnnotations;

namespace GestionTurnos.Models
{
    public class RequestHistorial
    {
        public int? Id { get; set; }
        [Required]
        [StringLength(200)]
        public string Motivo { get; set; }
        [Required]
        [StringLength(int.MaxValue)]
        public string DescripcionCaso { get; set; }
        [Required]
        public int PacienteId { get; set; }
    }
    public class Historiales:RequestResult
    {
        public List<RequestHistorial> list { get; set; }
    }
}
