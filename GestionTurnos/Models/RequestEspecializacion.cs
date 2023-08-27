using System.ComponentModel.DataAnnotations;

namespace GestionTurnos.Models
{
    public class RequestEspecializacion
    {
        public int? Id { get; set; }
        [Required]
        [StringLength(30)]
        public string Descripcion { get; set; }
        [Required]
        public bool Activo { get; set; }
    }
    public class Especializaciones:RequestResult
    {
        public List<RequestEspecializacion> list { get; set; }

    }
}
