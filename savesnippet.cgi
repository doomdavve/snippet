#!/usr/bin/python

import cgi
import os
import hashlib
import json
import sys

print "Content-type: application/json"
print "\n\n"

form = cgi.FieldStorage()
snippet = form.getvalue('snippet')

m = hashlib.md5()
m.update(snippet)

filename = m.hexdigest()[0:6]

f = open(os.path.join("snippets", filename), "w")
f.write(snippet)
f.close()

json.dump([filename], sys.stdout)
    
