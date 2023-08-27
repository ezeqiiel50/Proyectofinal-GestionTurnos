using System;
using System.Collections.Generic;

namespace GestionTurnos.Contexto;

public partial class Turno
{
    public int Id { get; set; }

    public int PacienteId { get; set; }

    public string Motivo { get; set; } = null!;

    public DateTime FechaTurno { get; set; }

    public TimeSpan Horaturno { get; set; }

    public int ProfesionalId { get; set; }

    public bool Estado { get; set; }

    public DateTime CreadoEl { get; set; }

    public int CreadoPor { get; set; }

    public DateTime ModificadoEl { get; set; }

    public int ModificadoPor { get; set; }

    public virtual Usuario Profesional { get; set; } = null!;
}
