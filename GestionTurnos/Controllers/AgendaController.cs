using GestionTurnos.Contexto;
using GestionTurnos.Models;
using GestionTurnos.Servicies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace GestionTurnos.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class agendaController : ControllerBase
    {
        private readonly Context _dbContext;
        public agendaController(Context context)
        {
            _dbContext = context;
        }
        [HttpGet]
        [Route("list")]
        public async Task<IActionResult> Get([FromQuery(Name = "fecha")] string fecha)
        {
            var user = await UtilServicio.BuscarUsuarioLogeado(_dbContext, HttpContext.User.Identity.Name);
            var result = await ServicioAgenda.ListAgenda(_dbContext,fecha, user);
            if (result.Valido)
            {
                return Ok(result);
            }
            return BadRequest();
        }
        [HttpPost]
        [Route("update")]
        public async Task<IActionResult> guardar([FromBody] AuxAgenda data)
        {
            var user = await UtilServicio.BuscarUsuarioLogeado(_dbContext, HttpContext.User.Identity.Name);
            var result = await ServicioAgenda.Modificar(_dbContext, data, user);
            if (result.Valido)
            {
                return Ok(result.Codigo);
            }
            return BadRequest();
        }
    }
}
