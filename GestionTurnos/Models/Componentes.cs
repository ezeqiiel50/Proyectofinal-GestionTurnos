namespace GestionTurnos.Models
{
    public class Componentes
    {
        public List<Cuerpo> list { get; set; }
    }
    public class Cuerpo
    {
        public string Type { get; set; }
        public List<Parameter> param { get; set; }
    }
}
