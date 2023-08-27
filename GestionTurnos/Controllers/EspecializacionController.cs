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
    public class EspecializacionController : ControllerBase
    {
        private readonly Context _dbContext;
        public EspecializacionController(Context context)
        {
            _dbContext = context;
        }
        [HttpGet]
        [Route("list")]
        public async Task<IActionResult> GetList([FromQuery(Name = "search")] string? search)
        {
            var result = await EspecializacionService.Get_Especializacion(_dbContext, search);
            if (result.Valido)
            {
                return Ok(result);
            }
            return BadRequest();
        }
        [HttpPost]
        [Route("insert")]
        public async Task<IActionResult> guardar([FromBody] RequestEspecializacion data)
        {
            var user = await UtilServicio.BuscarUsuarioLogeado(_dbContext, HttpContext.User.Identity.Name);
            var result = await EspecializacionService.Insert_Especializacion(_dbContext, data, user);
            if (result.Valido)
            {
                return Ok(result.Codigo);
            }
            return BadRequest();
        }
        [HttpPut]
        [Route("update")]
        public async Task<IActionResult> modificar([FromBody] RequestEspecializacion data)
        {
            var user = await UtilServicio.BuscarUsuarioLogeado(_dbContext, HttpContext.User.Identity.Name);
            var result = await EspecializacionService.Modificar_Especializacion(_dbContext, data, user);
            if (result.Valido)
            {
                return Ok(result.Codigo);
            }
            return BadRequest();
        }
    }
}
