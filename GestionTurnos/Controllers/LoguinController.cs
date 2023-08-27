using GestionTurnos.Contexto;
using GestionTurnos.Servicies;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace GestionTurnos.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoguinController : ControllerBase
    {
        private readonly Context _dbContext;
        public LoguinController(Context context)
        {
            _dbContext = context;
        }
        [HttpGet]
        [Route("getdatauser")]
        public async Task<IActionResult> GetDataUser()
       {
            var userEmail = HttpContext.User.Identity.Name;
            var result = await LoginServicio.UserData(_dbContext,userEmail);
            if (result.Valido)
            {
                return Ok(result);
            }
            return BadRequest();
        }
    }
}
