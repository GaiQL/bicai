import os
import sys
import build_tool
from smb.SMBConnection import SMBConnection
from smb.smb_structs import OperationFailure

bankId = sys.argv[1]
envType = sys.argv[2]
h5PathArr = build_tool.splitPath( envType )
root_path = "./" + bankId
fileNum = 0
uploadNum = 0
dirList = list()

def deleteFile( path,h5Path ):
    try:
        for fileContent in connect.listPath( h5Path['shareFolderName'],path ):
            #if len(fileContent.filename) > 3: （会返回一些.的文件，需要过滤）
                if fileContent.filename[0] != '.':
                    if '.' in fileContent.filename:
                        connect.deleteFiles( h5Path['shareFolderName'],path + '/' + fileContent.filename )
                    else:
                        dirPath = path + '/' + fileContent.filename
                        dirList.append( dirPath )
                        deleteFile( dirPath,h5Path )
    except PermissionError:
        pass

def deleteDir( dirList,h5Path ):
    for dir in reversed(dirList):
        connect.deleteDirectory(h5Path['shareFolderName'],dir)

def uploadFile( root_path,h5Path ):

    dir_or_files = os.listdir(root_path)
    currentDir = root_path[2:].replace( '\\','/' ) + '/'
    global uploadNum
    for dir_file in dir_or_files:

        dir_file_path = os.path.join(root_path,dir_file)

        if os.path.isdir(dir_file_path):

            connect.createDirectory( h5Path['shareFolderName'], h5Path['path'] + currentDir + dir_file )
            uploadFile( dir_file_path,h5Path )

        else:

            f = open('./' + currentDir + dir_file,'rb')
            connect.storeFile(h5Path['shareFolderName'],h5Path['path'] + currentDir + dir_file,f)
            uploadNum = uploadNum + 1
            bar.update( uploadNum )
            f.close()

def visitDir( path ):
    global fileNum
    for lists in os.listdir(path):
        sub_path = os.path.join(path, lists)
        if os.path.isfile(sub_path):
            fileNum = fileNum + 1
        elif os.path.isdir(sub_path):
            visitDir(sub_path)

visitDir( root_path )
for h5Path in h5PathArr:

    connect = SMBConnection(h5Path['userName'], h5Path['passWord'], '', '', use_ntlm_v2=True)
    connect.connect(h5Path['ip'], 139)

    print( h5Path['ip'] + '/' + h5Path['shareFolderName'] )
    try:
        connect.createDirectory( h5Path['shareFolderName'],h5Path['path']+bankId )
    except OperationFailure:
        pass

    bar = build_tool.progress_bar( fileNum )
    uploadNum = 0

    deleteFile( h5Path['path']+bankId,h5Path )
    deleteDir( dirList,h5Path )
    uploadFile( root_path,h5Path )









