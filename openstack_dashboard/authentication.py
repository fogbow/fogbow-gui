import commands

from django.conf import settings

FOGBOW_CLI_JAVA_COMMAND = 'java -cp fogbow-cli-core-0.0.1-SNAPSHOT-jar-with-dependencies.jar org.fogbowcloud.cli.Main $@'

def checkUserAuthenticated(token, type):
    command = '%s check-token --conf-path %s --type %s --federation-token-value %s ' % (
        FOGBOW_CLI_JAVA_COMMAND, settings.FOGBOW_AUTHENTICATION_CONF_FILES_DIR, type, token.id)
    
    responseStr = commands.getoutput(command) 
 
    if 'Unauthorized' in responseStr:
        return False    
    return True
