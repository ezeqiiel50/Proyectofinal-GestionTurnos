using System;
using System.Collections.Generic;

namespace GestionTurnos.Contexto;

public partial class Genero
{
    public int Id { get; set; }

    public string Descripcion { get; set; } = null!;

    public bool Activo { get; set; }

    public DateTime CreadoEl { get; set; }

    public int CreadoPor { get; set; }

    public DateTime ModificadoEl { get; set; }

    public int ModificadoPor { get; set; }

    public virtual ICollection<Usuario> Usuarios { get; set; } = new List<Usuario>();
    public virtual ICollection<Paciente> Paciente { get; set; } = new List<Paciente>();
}
