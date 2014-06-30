#!/usr/bin/python

import cgi
import os
import sys
import subprocess

form = cgi.FieldStorage()
name = form.getvalue('name')

try:
    filename = os.path.join("snippets", name)
    buffer = open(filename).read()
    mimetype = subprocess.check_output(['file', '-ib', filename]).strip()
    sys.stdout.write("Content-type: %s\n\n" % mimetype)
    sys.stdout.write(buffer)
except (IOError, subprocess.CalledProcessError) as e:
    sys.stdout.write("Content-type: application/json\n\n")
    sys.stdout.write("['No such snippet']")


