#!/usr/bin/perl

use DBI;
use CGI;
use strict;
use warnings;

# recibimos parametros
my $q = CGI->new;
my $owner = $q->param("usuario");
my $titulo = $q->param("titulo");

#conectamos base de datos
my $user = 'alumno';
my $password = 'pweb1';
my $dsn = "DBI:MariaDB:database=pweb1;host=db";
my $dbh = DBI->connect($dsn, $user, $password) or die("No se pudo conectar!");

# Obtener el ID del usuario
my $sth = $dbh->prepare("SELECT id FROM Users WHERE username=?");
$sth->execute($owner);
my ($owner_id) = $sth->fetchrow_array;
$sth->finish;

if ($owner_id) {
    $sth = $dbh->prepare("SELECT markdown FROM Articles WHERE owner=? AND title=?");
    $sth->execute($owner_id, $titulo);
    my @row = $sth->fetchrow_array;

    print $q->header('text/XML');
    print "<?xml version='1.0' encoding='utf-8'?>\n";

    if (!(@row == 0)){
        # si existe una pagina con el usuario y titulo dado...
        $sth->finish;

        print "<article>";
        print "<owner>$owner</owner>";
        print "<title>$titulo</title>";
        print "<text>@row</text>";
        print "</article>";
    }
    else {
        print "<article>";
        print "<owner></owner>";
        print "<title></title>";
        print "<text></text>";
        print "</article>";
    }
} else {
    print $q->header('text/XML');
    print "<?xml version='1.0' encoding='utf-8'?>\n";
    print "<article>";
    print "<owner></owner>";
    print "<title></title>";
    print "<text></text>";
    print "</article>";
}

$dbh->disconnect;
