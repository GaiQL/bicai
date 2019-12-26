import os
import sys
import build_tool
from smb.SMBConnection import SMBConnection
from smb.smb_structs import OperationFailure

bankId = sys.argv[1]
envType = sys.argv[2]

h5Path = build_tool.splitPath( envType )[0]

connect = SMBConnection(h5Path['userName'], h5Path['passWord'], '', '', use_ntlm_v2=True)
connect.connect(h5Path['ip'], 139)

file_obj = open( sys.path[0] + '/appConfig.json', 'wb')
jsonPath = h5Path['path'] + bankId + '/appConfig.json'
try:
    fileContent = connect.retrieveFile( h5Path['shareFolderName'],jsonPath,file_obj )
except BaseException:
    pass
file_obj.close()


    
