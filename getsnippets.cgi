#!/usr/bin/python

import sys
import json
import os
import time

sys.stdout.write("Content-type: application/json\n\n")
dirs = os.listdir("snippets")
data = [ (x,time.ctime(os.path.getctime(os.path.join("snippets", x)))) for x in dirs ]
data.sort(key=lambda x: x[1], reverse=True)

json.dump(data, sys.stdout)
