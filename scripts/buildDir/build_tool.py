import json
import time
import sys
import os

class progress_bar():

    def __init__(self,total):
        self.total = total

    def update(self,percent=0):
        width = 50
        left = width * percent // self.total
        right = width - left
        print('\r[', '#' * left, ' ' * right, ']',
            f' {percent}/{self.total}',
            sep='', end='', flush=True)


def splitPath( envType ):

    buildPathFile = open(sys.path[0] + '/buildPath.json',encoding='utf-8')
    h5PathArr = json.load(buildPathFile)[ envType ]['sharedFoldersAddress']

    for i in range(0, len(h5PathArr)):
        # smb://apph5:apph5@39.105.28.240/app-test4/app-h5-api/banks/
        pathA = h5PathArr[i].split('//',2)[1].split('@')[0]
        pathB = h5PathArr[i].split('//',2)[1].split('@')[1]
        h5PathArr[i] = {
            'userName':pathA.split(':')[0],
            'passWord':pathA.split(':')[1],
            'ip':pathB.split('/')[0],
            'shareFolderName':pathB.split('/')[1],
            'path':pathB.split('/',2)[2],
        }

    return h5PathArr
