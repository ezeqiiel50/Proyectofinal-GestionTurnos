using System.ComponentModel.DataAnnotations;

namespace GestionTurnos.Models
{
    public class RequestGenero
    {
        public int? Id { get; set; }
        [Required]
        [StringLength(30)]
        public string Descripcion { get; set; }
        [Required]
        public bool Activo { get; set; }
    }
    public class Generos:RequestResult
    {
        public List<RequestGenero> list { get; set; }
    }

}
