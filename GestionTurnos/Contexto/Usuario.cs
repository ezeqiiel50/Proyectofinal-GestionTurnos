using System;
using System.Collections.Generic;

namespace GestionTurnos.Contexto;

public partial class Usuario
{
    public int Id { get; set; }

    public string Documento { get; set; } = null!;

    public string ApellidoNombre { get; set; } = null!;

    public string Direccion { get; set; } = null!;

    public string Telefono { get; set; } = null!;

    public string? EmailUser { get; set; }

    public int PerfilId { get; set; }

    public int EspecializacionId { get; set; }

    public int GeneroId { get; set; }

    public bool Activo { get; set; }

    public DateTime CreadoEl { get; set; }

    public int CreadoPor { get; set; }

    public DateTime ModificadoEl { get; set; }

    public int ModificadoPor { get; set; }

    public virtual Especializacion Especializacion { get; set; } = null!;

    public virtual Genero Genero { get; set; } = null!;

    public virtual Perfil Perfil { get; set; } = null!;

    public virtual ICollection<Sesion> Sesions { get; set; } = new List<Sesion>();

    public virtual ICollection<Turno> Turnos { get; set; } = new List<Turno>();
}
