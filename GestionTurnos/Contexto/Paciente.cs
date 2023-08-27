using System;
using System.Collections.Generic;

namespace GestionTurnos.Contexto;

public partial class Paciente
{
    public int Id { get; set; }

    public string Documento { get; set; } = null!;

    public string ApellidoNombre { get; set; } = null!;

    public string Telefono { get; set; } = null!;

    public string Direccion { get; set; } = null!;
    public int GeneroId { get; set; }

    public bool Activo { get; set; }

    public DateTime CreadoEl { get; set; }

    public int CreadoPor { get; set; }

    public DateTime ModificadoEl { get; set; }

    public int ModificadoPor { get; set; }
    public virtual Genero Genero { get; set; } = null!;
    public virtual ICollection<Historial> Historials { get; set; } = new List<Historial>();
}
