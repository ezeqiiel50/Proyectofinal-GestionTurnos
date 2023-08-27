using System.ComponentModel.DataAnnotations;

namespace GestionTurnos.Models
{
    public class RequestUsuario
    {
        public int? Id { get; set; }
        [Required]
        [StringLength(11)]
        public string Documento { get; set; }
        [Required]
        [StringLength(100)]
        public string ApellidoNombre { get; set; }
        [Required]
        [StringLength(int.MaxValue)]
        public string Direccion { get; set; }
        [Required]
        [StringLength(15)]
        public string Telefono { get; set; }
        [StringLength(100)]
        public string? emailUser { get; set; }
        [Required]
        public bool Activo { get; set; }
        [Required]
        public int PerfilId { get; set; }
        public string? PerfilDescripcion { get; set; }
        [Required]
        public int EspecializacionId { get; set; }
        public string? EspecDescripcion { get; set; }
        [Required]
        public int GeneroId { get; set; }
        public string? GeneroDescripcion { get; set; }
    }
    public class Usuarios:RequestResult
    {
        public List<RequestUsuario> list {get; set; }
    }
}
