using System.ComponentModel.DataAnnotations;

namespace GestionTurnos.Models
{
    public class RequestPaciente
    {
        public int? Id { get; set; }
        [Required]
        [StringLength(20)]
        public string Documento { get; set; }
        [Required]
        [StringLength(50)]
        public string ApellidoNombre { get; set; }
        [Required]
        [StringLength(50)]
        public string Telefono { get; set; }
        [Required]
        [StringLength(60)]
        public string Direccion { get; set; }
        [Required]
        public int GeneroId { get; set; }
        public string? GeneroDescripcion { get; set; }
        [Required]
        public bool Activo { get; set; }
    }
    public class Pacientes:RequestResult
    {
        public List<RequestPaciente> list { get; set; }
    }
}
