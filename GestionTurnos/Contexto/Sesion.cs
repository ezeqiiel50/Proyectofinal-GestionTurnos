using System;
using System.Collections.Generic;

namespace GestionTurnos.Contexto;

public partial class Sesion
{
    public int Id { get; set; }

    public int UsuarioId { get; set; }

    public string TokenHash { get; set; } = null!;

    public bool Expiro { get; set; }

    public DateTime LogeadoEl { get; set; }

    public DateTime DeslogeadoEl { get; set; }

    public virtual Usuario Usuario { get; set; } = null!;
}
