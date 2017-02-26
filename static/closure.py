#!/usr/bin/python2.7

import os, sys, time

def compile(source, destination):
    command = "java -jar " + static_path + "/closure-compiler-v20161024.jar --js " + source + " --js_output_file " + destination
    os.system(command)

static_path = os.path.realpath(os.path.dirname(sys.argv[0]))


def closured( path ):
	if os.path.isdir(path):
		list = os.listdir(path)
		for f in list:
			if (f == ".svn" or f == '.' or f == '..' or f.find(".json") != -1):
				continue
			if( f.find(".min") != -1):
				continue
			some_list_file_ignone = ['angular.js','angular-mocks.js','angular-ui-router.js','jpg.js','dmuploader.js','Jcrop.js', 'jquery.js','moment.js','ui-grid.js','angular-messages.js','html2canvas.js','Vibrant.js','angular-resource.js','angular-translate.js','color-thief.js','ngSanitize.js']
			if any(f in s for s in some_list_file_ignone):
				continue
			source = path + '/' + f
			if(os.path.isdir(source)):
				closured(source)
			if( f.find(".js") != -1):
				ftime = os.stat(source).st_mtime
				mtime = time.time()
				f_min = f.replace(".",".min.")
				destination = source.replace(f, f_min)
				if(ftime > mtime - 432099999999):
					compile(source, destination)
					print ('Closured:' + destination)
f_path = static_path + "/js"
closured( f_path )




