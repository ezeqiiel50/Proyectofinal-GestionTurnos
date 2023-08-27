using System;
using System.Collections.Generic;

namespace GestionTurnos.Contexto;

public partial class Historial
{
    public int Id { get; set; }

    public string Motivo { get; set; } = null!;

    public string DescripcionCaso { get; set; } = null!;

    public int PacienteId { get; set; }

    public bool Activo { get; set; }

    public DateTime CreadoEl { get; set; }

    public int CreadoPor { get; set; }

    public DateTime ModificadoEl { get; set; }

    public int ModificadoPor { get; set; }

    public virtual ICollection<Archivo> Archivos { get; set; } = new List<Archivo>();

    public virtual Paciente Paciente { get; set; } = null!;
}
