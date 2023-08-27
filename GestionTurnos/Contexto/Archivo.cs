using System;
using System.Collections.Generic;

namespace GestionTurnos.Contexto;

public partial class Archivo
{
    public int Id { get; set; }

    public string NombreTipo { get; set; } = null!;

    public byte[] Archivo1 { get; set; } = null!;

    public int HistorialId { get; set; }

    public DateTime CreadoEl { get; set; }

    public int CreadoPor { get; set; }

    public DateTime ModificadoEl { get; set; }

    public int ModificadoPor { get; set; }

    public virtual Historial Historial { get; set; } = null!;
}
