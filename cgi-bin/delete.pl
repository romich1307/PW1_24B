#!/usr/bin/perl
use DBI;
use CGI;
use strict;
use warnings;

my $q = CGI->new;
my $owner = $q->param('usuario');
my $titulo = $q->param('titulo');

my $user = 'alumno';
my $password = 'pweb1';
my $dsn = "DBI:MariaDB:database=pweb1;host=db";
my $dbh = DBI->connect($dsn, $user, $password) or die("No se pudo conectar!");

# Obtener el ID del usuario
my $sth = $dbh->prepare("SELECT id FROM Users WHERE username=?");
$sth->execute($owner);
my ($owner_id) = $sth->fetchrow_array;
$sth->finish;

print $q->header('text/XML');
print "<?xml version='1.0' encoding='utf-8'?>\n";

if ($owner_id) {
    $sth = $dbh->prepare("DELETE FROM Articles WHERE owner=? AND title=?");
    if ($sth->execute($owner_id, $titulo)) {
        print "<success>true</success>\n";
    } else {
        print "<error>Error al eliminar</error>\n";
    }
} else {
    print "<error>Usuario no encontrado</error>\n";
}

$dbh->disconnect;