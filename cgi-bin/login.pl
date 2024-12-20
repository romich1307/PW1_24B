#!/usr/bin/perl
use DBI;
use CGI;
use strict;
use warnings;

my $q = CGI->new;
my $username = $q->param('usuario');
my $password = $q->param('password');

my $user = 'alumno';
my $dbpassword = 'pweb1';
my $dsn = "DBI:MariaDB:database=pweb1;host=db";
my $dbh = DBI->connect($dsn, $user, $dbpassword) or die("No se pudo conectar!");

my $sth = $dbh->prepare("SELECT id, firstName, lastName FROM Users WHERE username=? AND password=?");
$sth->execute($username, $password);

print $q->header('text/XML');
print "<?xml version='1.0' encoding='utf-8'?>\n";

my @row = $sth->fetchrow_array;
if (@row) {
    print "<user>\n";
    print "<owner>$row[0]</owner>\n";
    print "<firstName>$row[1]</firstName>\n";
    print "<lastName>$row[2]</lastName>\n";
    print "</user>\n";
} else {
    print "<user></user>\n";
}

$sth->finish;
$dbh->disconnect;