create table Genero(
Id int Identity(1,1) not null,
Descripcion varchar(30) not null,
Activo bit not null,
Creado_el datetime not null,
Creado_por int not null,
Modificado_el datetime not null,
Modificado_por int not null,
primary key (Id))

Create table Especializacion(
Id int Identity(1,1) not null,
Descripcion varchar(30),
Activo bit not null,
Creado_el datetime not null,
Creado_por int not null,
Modificado_el datetime not null,
Modificado_por int not null,
primary key (Id))

create table Perfil(
Id int Identity(1,1)not null,
Descripcion varchar(30) not null,
Activo bit not null,
Creado_el datetime not null,
Creado_por int not null,
Modificado_el datetime not null,
Modificado_por int not null,
primary key (Id))

create table Usuario(
Id int Identity(1,1) not null,
Documento varchar(30) not null,
ApellidoNombre varchar(100) not null,
Direccion varchar(max) not null,
Telefono varchar(15) not null,
PerfilId int not null,
EspecializacionId int not null,
GeneroId int not null,
Activo bit not null,
Creado_el datetime not null,
Creado_por int not null,
Modificado_el datetime not null,
Modificado_por int not null,
primary key (Id),
foreign key (PerfilId) references Perfil,
foreign key (EspecializacionId) references Especializacion,
foreign key (GeneroId) references Genero)

create table Sesion(
Id int IDENTITY(1,1)not null,
UsuarioId int not null,
TokenHash varchar(max) not null,
Expiro bit not null,
Logeado_el datetime not null,
Deslogeado_el datetime not null,
primary key (Id),
foreign key(UsuarioId) references Usuario)

create table Paciente(
Id int Identity(1,1) not null,
Documento varchar(20) not null,
ApellidoNombre varchar(50) not null,
Telefono varchar(50) not null,
Direccion varchar(60) not null,
Activo bit not null,
Creado_el datetime not null,
Creado_por int not null,
Modificado_el datetime not null,
Modificado_por int not null,
primary key (Id))

create table Historial(
Id int Identity(1,1) not null,
Motivo varchar(200) not null,
DescripcionCaso varchar(max) not null,
PacienteId int not null,
Activo bit not null,
Creado_el datetime not null,
Creado_por int not null,
Modificado_el datetime not null,
Modificado_por int not null,
primary key (Id),
foreign key(PacienteId) references Paciente)

create table Archivo(
Id int Identity(1,1) not null,
NombreTipo varchar(200) not null,
Archivo varbinary(max)not null,
HistorialId int not null,
Creado_el datetime not null,
Creado_por int not null,
Modificado_el datetime not null,
Modificado_por int not null,
primary key (Id),
foreign key(HistorialId) references Historial)

create table Turno(
Id int identity(1,1) not null,
PacienteId int not null,
Motivo varchar(100) not null,
FechaTurno datetime not null,
Horaturno time(7) not null,
ProfesionalId int not null,
Estado bit not null,
Creado_el datetime not null,
Creado_por int not null,
Modificado_el datetime not null,
Modificado_por int not null,
primary key (Id),
foreign key (ProfesionalId) references Usuario)