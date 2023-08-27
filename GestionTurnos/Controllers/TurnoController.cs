using GestionTurnos.Contexto;
using GestionTurnos.Models;
using GestionTurnos.Servicies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace GestionTurnos.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TurnoController : ControllerBase
    {
        private readonly Context _dbContext;
        public TurnoController(Context context)
        {
            _dbContext = context;
        }
        [HttpGet]
        [Route("listDoctores")]
        public async Task<IActionResult> ListTurnos()
        {
            var result = await TurnoServicio.ListDoctores(_dbContext);
            if (result.Valido)
            {
                return Ok(result);
            }
            return BadRequest();
        }

        [HttpGet]
        [Route("list")]
        public async Task<IActionResult> ListTurnos([FromQuery(Name = "id")] int id,[FromQuery(Name = "fecha")] string? fecha)
        {
            var result = await TurnoServicio.ListTurnos(_dbContext, fecha,id);
            if (result.Valido)
            {
                return Ok(result);
            }
            return BadRequest();
        }

        [HttpGet]
        [Route("turnosAsignados")]
        public async Task<IActionResult> ListTurnosOcupados([FromQuery(Name = "paciente")] string paciente)
        {
            var result = await TurnoServicio.ListTurnosOcupados(_dbContext, paciente);
            if (result.Valido)
            {
                return Ok(result);
            }
            return BadRequest();
        }

        [HttpPost]
        [Route("insert")]
        public async Task<IActionResult> insert_Turno([FromBody] RequestTurno data)
        {
            var user = await UtilServicio.BuscarUsuarioLogeado(_dbContext, HttpContext.User.Identity.Name);
            var result = await TurnoServicio.InsertTurno(_dbContext, data, user);
            if (result.Valido)
            {
                return Ok(result.Codigo);
            }
            return BadRequest();
        }
        [HttpPost]
        [Route("delete")]
        public async Task<IActionResult> BorrarTurno([FromBody] ModeloAux data)
        {
            var result = await TurnoServicio.Borrar(_dbContext, data);
            if (result.Valido)
            {
                return Ok(result.Codigo);
            }
            return BadRequest();
        }
        [HttpPut]
        [Route("update")]
        public async Task<IActionResult> updateTurno([FromBody] TurnoUpdate data)
        {
            var user = await UtilServicio.BuscarUsuarioLogeado(_dbContext, HttpContext.User.Identity.Name);
            var result = await TurnoServicio.Modificar(_dbContext, data,user);
            if (result.Valido)
            {
                return Ok(result.Codigo);
            }
            return BadRequest();
        }
    }
}
