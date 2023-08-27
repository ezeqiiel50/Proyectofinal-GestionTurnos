using System.ComponentModel.DataAnnotations;

namespace GestionTurnos.Models
{
    public class RequestPerfil
    {
        public int? Id { get; set; }
        [Required]
        [StringLength(30)]
        public string Descripcion { get; set; }
        [Required]
        public bool Activo { get; set; }
    }
    public class Perfiles:RequestResult
    {
        public List<RequestPerfil> list { get; set; }

    }
}
