#!/usr/bin/perl

use DBI;
use CGI;
use strict;
use warnings;

my $q = CGI->new;
my $nombres = $q->param('Nombre');
my $apellidos = $q->param('Apellido');
my $nombreUsuario = $q->param('usuario');
my $contra = $q->param('password');

# conectamos con la base de datos
my $user = 'alumno';
my $password = 'pweb1';
my $dsn = "DBI:MariaDB:database=pweb1;host=db";
my $dbh = DBI->connect($dsn, $user, $password) or die("No se puede conectar: " . $DBI::errstr);

# Verificar si el usuario ya existe
my $sth = $dbh->prepare("SELECT id FROM Users WHERE username=?");
$sth->execute($nombreUsuario);
my @row = $sth->fetchrow_array;
$sth->finish;

print $q->header('text/XML');
print "<?xml version='1.0' encoding='utf-8'?>\n";

if (@row == 0) {
    # si no existe el usuario en la base de datos...
    eval {
        $sth = $dbh->prepare("INSERT INTO Users (username, password, firstName, lastName) VALUES (?, ?, ?, ?)");
        $sth->execute($nombreUsuario, $contra, $nombres, $apellidos);
        
        # Obtener el ID del usuario recién insertado
        my $user_id = $dbh->last_insert_id(undef, undef, 'Users', 'id');
        
        print "<user>\n";
        print "<owner>$user_id</owner>\n";
        print "<firstName>$nombres</firstName>\n";
        print "<lastName>$apellidos</lastName>\n";
        print "</user>\n";
    };
    if ($@) {
        print "<user>\n";
        print "<owner></owner>\n";
        print "<firstName></firstName>\n";
        print "<lastName></lastName>\n";
        print "</user>\n";
        warn "Error en la inserción: $@";
    }
} else {
    print "<user>\n";
    print "<owner></owner>\n";
    print "<firstName></firstName>\n";
    print "<lastName></lastName>\n";
    print "</user>\n";
}

$dbh->disconnect;