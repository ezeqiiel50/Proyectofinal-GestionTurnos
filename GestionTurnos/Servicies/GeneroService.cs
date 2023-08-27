﻿using GestionTurnos.Constantes;
using GestionTurnos.Contexto;
using GestionTurnos.Models;
using Serilog;
using System;
using System.Collections.Immutable;

namespace GestionTurnos.Servicies
{
    public class GeneroService
    {
        public static async Task<Generos> Get_listGenrto(Context context,string? search)
        {
            var result = new Generos { Valido = false,Codigo=Errores.Otros  , list = new List<RequestGenero>()};
            try
            {
                //Thread.Sleep(5000);
                search = string.IsNullOrEmpty(search) ? string.Empty : search;

                var list = context.Generos.Where(x => x.Descripcion.Contains(search))
                    .Select(s => new RequestGenero{
                        Id = s.Id,
                        Descripcion = s.Descripcion,
                        Activo = s.Activo,
                }).ToList();

                if (list.Count >= 0)
                {
                    result.list = list;
                    result.Valido = true;
                }
                else
                {
                    result.Valido = true;
                    result.Codigo = Errores.SinRegistrosCargados;
                }
            }
            catch (Exception ex)
            {
                Log.Error("Genero list " + ex.Message);
                result.Codigo = Errores.Otros;
                result.Valido = false;
            }
            return result;
        }
        public static async Task<RequestResult> Insert_Genero(Context context,RequestGenero nuevo,int user)
        {
            var result = new RequestResult { Valido = false,Codigo=Errores.Otros };
            try
            {
                var existe = context.Generos.FirstOrDefault(x => x.Descripcion == nuevo.Descripcion);
                if (existe == null)
                {
                    var new_registro = new Genero { 
                    Descripcion = nuevo.Descripcion,
                    Activo = nuevo.Activo,
                    CreadoEl = DateTime.Now,
                    CreadoPor = user,
                    ModificadoEl = DateTime.Now,
                    ModificadoPor = user,
                    };
                   await context.AddAsync(new_registro);
                   await context.SaveChangesAsync();
                    result.Valido = true;
                }
                else
                {
                    result.Valido = true;
                    result.Codigo = Errores.YaExiste;
                }
            }
            catch (Exception ex)
            {
                Log.Error("Genero insert " + ex.Message);
                result.Valido = false;
                result.Codigo = Errores.Otros;
            }
            return result;
        }
        public static async Task<RequestResult> Modificar_Genero(Context context, RequestGenero nuevo, int user)
        {
            var result = new RequestResult { Valido = false,Codigo = Errores.Otros };
            try
            {
                var noMio = context.Generos.FirstOrDefault(x => x.Descripcion == nuevo.Descripcion);
                var esMio = context.Generos.FirstOrDefault(x => x.Id == nuevo.Id && x.Descripcion == nuevo.Descripcion);

                var validar = noMio == esMio ? true : false ;

                var registro = context.Generos.FirstOrDefault(x => x.Id == nuevo.Id);
                if (registro != null && validar)
                {
                    registro.Descripcion = nuevo.Descripcion;
                    registro.Activo = nuevo.Activo;
                    registro.CreadoEl = registro.CreadoEl;
                    registro.CreadoPor = registro.CreadoPor;
                    registro.ModificadoEl = DateTime.Now;
                    registro.ModificadoPor = user;

                    await context.SaveChangesAsync();
                    result.Valido = true;
                }
                else
                {
                    result.Valido = true;
                    result.Codigo = Errores.YaExiste;
                }
            }
            catch (Exception ex)
            {
                Log.Error("Genero update " + ex.Message);
                result.Valido = false;
                result.Codigo = Errores.Otros;
            }
            return result;
        }
    }
}
