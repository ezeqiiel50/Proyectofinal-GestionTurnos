using GestionTurnos.Constantes;
using GestionTurnos.Contexto;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Identity.Web;
using Microsoft.IdentityModel.Logging;
using Serilog;

var builder = WebApplication.CreateBuilder(args);

Log.Logger = new LoggerConfiguration()
    .WriteTo.File(".\\Log\\log.txt", rollingInterval: RollingInterval.Day)
    .WriteTo.Console()
    .CreateLogger();


builder.Services.AddControllersWithViews();

builder.Services.AddDbContext<Context>(option => 
    option.UseSqlServer(EnviromentVariables.CadenaConexion()));

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddMicrosoftIdentityWebApi(builder.Configuration.GetSection("AzureAd"));

var app = builder.Build();
if (!app.Environment.IsDevelopment())
{
    IdentityModelEventSource.ShowPII = true;
    app.UseHsts();
}
app.UseAuthentication();
app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();

app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller}/{action=Index}/{id?}");

app.MapFallbackToFile("index.html"); ;

app.Run();
