using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace GestionTurnos.Contexto;

public partial class Context : DbContext
{
    public Context()
    {
    }

    public Context(DbContextOptions<Context> options)
        : base(options)
    {
    }

    public virtual DbSet<Archivo> Archivos { get; set; }

    public virtual DbSet<Especializacion> Especializacions { get; set; }

    public virtual DbSet<Genero> Generos { get; set; }

    public virtual DbSet<Historial> Historials { get; set; }

    public virtual DbSet<Paciente> Pacientes { get; set; }

    public virtual DbSet<Perfil> Perfils { get; set; }

    public virtual DbSet<Sesion> Sesions { get; set; }

    public virtual DbSet<Turno> Turnos { get; set; }

    public virtual DbSet<Usuario> Usuarios { get; set; }

//    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
//#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see http://go.microsoft.com/fwlink/?LinkId=723263.
//        => optionsBuilder.UseSqlServer("Data Source=DEV-ECORONEL;Initial Catalog=SistemaGestionTurnos;Integrated Security=True;Connect Timeout=30;Encrypt=False;TrustServerCertificate=False;ApplicationIntent=ReadWrite;MultiSubnetFailover=False");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Archivo>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Archivo__3214EC070D967C53");

            entity.ToTable("Archivo");

            entity.Property(e => e.Archivo1).HasColumnName("Archivo");
            entity.Property(e => e.CreadoEl)
                .HasColumnType("datetime")
                .HasColumnName("Creado_el");
            entity.Property(e => e.CreadoPor).HasColumnName("Creado_por");
            entity.Property(e => e.ModificadoEl)
                .HasColumnType("datetime")
                .HasColumnName("Modificado_el");
            entity.Property(e => e.ModificadoPor).HasColumnName("Modificado_por");

            entity.Property(e => e.NombreTipo)
                .HasMaxLength(200)
                .IsUnicode(false);

            entity.HasOne(d => d.Historial).WithMany(p => p.Archivos)
                .HasForeignKey(d => d.HistorialId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Archivo__Histori__49C3F6B7");
        });

        modelBuilder.Entity<Especializacion>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Especial__3214EC074583BE02");

            entity.ToTable("Especializacion");

            entity.Property(e => e.CreadoEl)
                .HasColumnType("datetime")
                .HasColumnName("Creado_el");
            entity.Property(e => e.CreadoPor).HasColumnName("Creado_por");
            entity.Property(e => e.Descripcion)
                .HasMaxLength(30)
                .IsUnicode(false);
            entity.Property(e => e.ModificadoEl)
                .HasColumnType("datetime")
                .HasColumnName("Modificado_el");
            entity.Property(e => e.ModificadoPor).HasColumnName("Modificado_por");
        });

        modelBuilder.Entity<Genero>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Genero__3214EC070EBA4BCA");

            entity.ToTable("Genero");

            entity.Property(e => e.CreadoEl)
                .HasColumnType("datetime")
                .HasColumnName("Creado_el");
            entity.Property(e => e.CreadoPor).HasColumnName("Creado_por");
            entity.Property(e => e.Descripcion)
                .HasMaxLength(30)
                .IsUnicode(false);
            entity.Property(e => e.ModificadoEl)
                .HasColumnType("datetime")
                .HasColumnName("Modificado_el");
            entity.Property(e => e.ModificadoPor).HasColumnName("Modificado_por");
        });

        modelBuilder.Entity<Historial>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Historia__3214EC07428D783E");

            entity.ToTable("Historial");

            entity.Property(e => e.CreadoEl)
                .HasColumnType("datetime")
                .HasColumnName("Creado_el");
            entity.Property(e => e.CreadoPor).HasColumnName("Creado_por");
            entity.Property(e => e.DescripcionCaso).IsUnicode(false);
            entity.Property(e => e.ModificadoEl)
                .HasColumnType("datetime")
                .HasColumnName("Modificado_el");
            entity.Property(e => e.ModificadoPor).HasColumnName("Modificado_por");
            entity.Property(e => e.Motivo)
                .HasMaxLength(200)
                .IsUnicode(false);

            entity.HasOne(d => d.Paciente).WithMany(p => p.Historials)
                .HasForeignKey(d => d.PacienteId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Historial__Pacie__46E78A0C");
        });

        modelBuilder.Entity<Paciente>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Paciente__3214EC077C0215F1");

            entity.ToTable("Paciente");

            entity.Property(e => e.ApellidoNombre)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.CreadoEl)
                .HasColumnType("datetime")
                .HasColumnName("Creado_el");
            entity.Property(e => e.CreadoPor).HasColumnName("Creado_por");
            entity.Property(e => e.Direccion)
                .HasMaxLength(60)
                .IsUnicode(false);
            entity.Property(e => e.Documento)
                .HasMaxLength(20)
                .IsUnicode(false);
            entity.Property(e => e.ModificadoEl)
                .HasColumnType("datetime")
                .HasColumnName("Modificado_el");
            entity.Property(e => e.ModificadoPor).HasColumnName("Modificado_por");
            entity.Property(e => e.Telefono)
                .HasMaxLength(50)
                .IsUnicode(false);

            entity.HasOne(d => d.Genero).WithMany(p => p.Paciente)
                .HasForeignKey(d => d.GeneroId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Paciente_Genero");
        });

        modelBuilder.Entity<Perfil>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Perfil__3214EC072D69FD47");

            entity.ToTable("Perfil");

            entity.Property(e => e.CreadoEl)
                .HasColumnType("datetime")
                .HasColumnName("Creado_el");
            entity.Property(e => e.CreadoPor).HasColumnName("Creado_por");
            entity.Property(e => e.Descripcion)
                .HasMaxLength(30)
                .IsUnicode(false);
            entity.Property(e => e.ModificadoEl)
                .HasColumnType("datetime")
                .HasColumnName("Modificado_el");
            entity.Property(e => e.ModificadoPor).HasColumnName("Modificado_por");
        });

        modelBuilder.Entity<Sesion>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Sesion__3214EC077F242630");

            entity.ToTable("Sesion");

            entity.Property(e => e.DeslogeadoEl)
                .HasColumnType("datetime")
                .HasColumnName("Deslogeado_el");
            entity.Property(e => e.LogeadoEl)
                .HasColumnType("datetime")
                .HasColumnName("Logeado_el");
            entity.Property(e => e.TokenHash).IsUnicode(false);

            entity.HasOne(d => d.Usuario).WithMany(p => p.Sesions)
                .HasForeignKey(d => d.UsuarioId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Sesion__UsuarioI__4222D4EF");
        });

        modelBuilder.Entity<Turno>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Turno__3214EC07536207E6");

            entity.ToTable("Turno");

            entity.Property(e => e.CreadoEl)
                .HasColumnType("datetime")
                .HasColumnName("Creado_el");
            entity.Property(e => e.CreadoPor).HasColumnName("Creado_por");
            entity.Property(e => e.FechaTurno).HasColumnType("datetime");
            entity.Property(e => e.ModificadoEl)
                .HasColumnType("datetime")
                .HasColumnName("Modificado_el");
            entity.Property(e => e.ModificadoPor).HasColumnName("Modificado_por");
            entity.Property(e => e.Motivo)
                .HasMaxLength(100)
                .IsUnicode(false);

            entity.HasOne(d => d.Profesional).WithMany(p => p.Turnos)
                .HasForeignKey(d => d.ProfesionalId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Turno__Profesion__4CA06362");
        });

        modelBuilder.Entity<Usuario>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Usuario__3214EC072D7A9873");

            entity.ToTable("Usuario");

            entity.Property(e => e.ApellidoNombre)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.CreadoEl)
                .HasColumnType("datetime")
                .HasColumnName("Creado_el");
            entity.Property(e => e.CreadoPor).HasColumnName("Creado_por");
            entity.Property(e => e.Direccion).IsUnicode(false);
            entity.Property(e => e.Documento)
                .HasMaxLength(30)
                .IsUnicode(false);
            entity.Property(e => e.ModificadoEl)
                .HasColumnType("datetime")
                .HasColumnName("Modificado_el");
            entity.Property(e => e.ModificadoPor).HasColumnName("Modificado_por");
            entity.Property(e => e.Telefono)
                .HasMaxLength(15)
                .IsUnicode(false);

            entity.HasOne(d => d.Especializacion).WithMany(p => p.Usuarios)
                .HasForeignKey(d => d.EspecializacionId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Usuario__Especia__3E52440B");

            entity.HasOne(d => d.Genero).WithMany(p => p.Usuarios)
                .HasForeignKey(d => d.GeneroId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Usuario__GeneroI__3F466844");

            entity.HasOne(d => d.Perfil).WithMany(p => p.Usuarios)
                .HasForeignKey(d => d.PerfilId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Usuario__PerfilI__3D5E1FD2");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
