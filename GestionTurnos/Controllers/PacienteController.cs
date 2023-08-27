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
    public class PacienteController : ControllerBase
    {
        private readonly Context _dbContext;
        public PacienteController(Context context)
        {
            _dbContext = context;
        }
        [HttpGet]
        [Route("list")]
        public async Task<IActionResult> Get([FromQuery(Name = "search")] string? search)
        {
            var result = await PacienteService.Get_list(_dbContext, search);
            if (result.Valido)
            {
                return Ok(result);
            }
            return BadRequest();
        }
        [HttpPost]
        [Route("insert")]
        public async Task<IActionResult> guardar([FromBody] RequestPaciente data)
        {
            var user = await UtilServicio.BuscarUsuarioLogeado(_dbContext, HttpContext.User.Identity.Name);
            var result = await PacienteService.Insert_registro(_dbContext, data, user);
            if (result.Valido)
            {
                return Ok(result.Codigo);
            }
            return BadRequest();
        }
        [HttpPut]
        [Route("update")]
        public async Task<IActionResult> modificar([FromBody] RequestPaciente data)
        {
            var user = await UtilServicio.BuscarUsuarioLogeado(_dbContext, HttpContext.User.Identity.Name);
            var result = await PacienteService.Modificar_registro(_dbContext, data, user);
            if (result.Valido)
            {
                return Ok(result.Codigo);
            }
            return BadRequest();
        }
    }
}
