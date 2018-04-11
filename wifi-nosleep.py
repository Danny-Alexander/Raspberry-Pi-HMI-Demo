#!/usr/bin/env python

import subprocess

cmd = ['iw', 'wlan0', 'get', 'power_save']
p = subprocess.check_output(cmd)
print p

if p.split()[2] == "on":
	cmd = ['sudo', 'iw', 'wlan0', 'set', 'power_save', 'off']
	subprocess.call(cmd)
	print "Disabling wifi power saving"
else:
	print "Power saving already disabled"

cmd = ['iw', 'wlan0', 'get', 'power_save']
p = subprocess.check_output(cmd)
print p

