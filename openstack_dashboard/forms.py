import logging
import commands

from django.conf import settings
from django.contrib.auth import authenticate, login
from django.contrib.auth import forms as django_auth_forms
from django import forms
from django.utils.translation import ugettext_lazy as _
from django.views.decorators.debug import sensitive_variables
import openstack_dashboard.models as fogbow_models
from openstack_auth import exceptions

LOG = logging.getLogger(__name__)

FEDERATION_TYPE_FORM = '_federation'    

class AllForm(django_auth_forms.AuthenticationForm):        
    listFields = {}
    
    def __init__(self, *args, **kwargs):
        super(AllForm, self).__init__(*args, **kwargs)            
        
        federationAuthType = settings.FOGBOW_FEDERATION_AUTH_TYPE
        federationFields = getFieldsPerFormType(federationAuthType, FEDERATION_TYPE_FORM)                                               
        
        self.listFields = federationFields.getFields(True) 
        
        listOr = []
        listOr.extend(federationFields.getOrderFields())
        
        for key in self.listFields.keys():
            self.fields[key] = self.listFields[key]
          
        self.fields.keyOrder = listOr
        
    @sensitive_variables()
    def clean(self):
        federationCrendentials = {}
         
        for key in self.listFields.keys():
            if FEDERATION_TYPE_FORM in key:
                federationCrendentials[key.replace(FEDERATION_TYPE_FORM, '')] = self.cleaned_data.get(key)    
        
        self.user_cache = authenticate(request=self.request, federationCredentials=federationCrendentials)        
        
        if self.user_cache.errors == True:
            throwErrorMessage(self, _(self.user_cache.typeError))
        LOG.info('Successful login')
        
        return self.cleaned_data

class KeystoneFields():    
    type = None
    
    def __init__(self, type):
        self = self        
        self.username = 'username' + type
        self.password = 'password' + type
        self.tenantName = 'tenantName' + type
            
    def getFields(self, required):
        listFields = {}
        listFields[self.username] = forms.CharField(label=_("Username"), required=required)
        listFields[self.password] = forms.CharField(label=_("Password"),
                               widget=forms.PasswordInput(render_value=False), required=required)
        listFields[self.tenantName] = forms.CharField(label=_("Tenant Name"), required=required)
        return listFields
    
    def getOrderFields(self):
        return [self.username, self.password, self.tenantName]
    
class VOMSFields():    
    type = None
    
    def __init__(self, type):
        self = self
        self.voms = 'voms' + type  
            
    def getFields(self, required):
        listFields = {} 
        listFields[self.voms] = forms.CharField( label=_("Proxy certificate"), 
                            widget=forms.Textarea, required=required)
        return listFields

    def getOrderFields(self):
        return [self.voms]    
    
class OpennebulaFields():    
    type = None
    
    def __init__(self, type):
        self = self  
        self.username = 'username' + type
        self.password = 'password' + type
            
    def getFields(self, required):
        listFields = {}
        listFields[self.username] = forms.CharField(label=_("Username"),
            widget=forms.TextInput(attrs={"autofocus": "autofocus"}), required=required)
        listFields[self.password] = forms.CharField(label=_("Password"),
                                   widget=forms.PasswordInput(render_value=False),
                                   required=False)
        return listFields
    
    def getOrderFields(self):
        return [self.username, self.password]
    
class LdapFields():
    type = None
    
    def __init__(self, type):
        self = self  
        self.username = 'username' + type
        self.password = 'password' + type
            
    def getFields(self, required):
        listFields = {}
        listFields[self.username] = forms.CharField(label=_("Username"),
            widget=forms.TextInput(attrs={"autofocus": "autofocus"}), required=required)
        listFields[self.password] = forms.CharField(label=_("Password"),
                                   widget=forms.PasswordInput(render_value=False),
                                   required=False)
        return listFields
    
    def getOrderFields(self):
        return [self.username, self.password]        
    
class TokenFields():    
    type = None
    
    def __init__(self, type):
        self = self
        self.token = 'token' + type  
            
    def getFields(self, required):
        listFields = {} 
        listFields[self.token] = forms.CharField( label=_("Token"), 
                            widget=forms.Textarea, required=required)
        return listFields
    
    def getOrderFields(self):
        return [self.token]
    
class RawKeystoneFields():    
    type = None
    
    def __init__(self, type):
        self = self
        self.raw_keystone = 'raw_keystone' + type  
            
    def getFields(self, required):
        listFields = {} 
        listFields[self.raw_keystone] = forms.CharField( label=_("Raw Keystone"), 
                            widget=forms.Textarea, required=required)
        return listFields
    
    def getOrderFields(self):
        return [self.raw_keystone]    
    
class RawOpennebulaFields():    
    type = None
    
    def __init__(self, type):
        self = self
        self.raw_opennebula = 'raw_opennebula' + type  
            
    def getFields(self, required):
        listFields = {} 
        listFields[self.raw_opennebula] = forms.CharField( label=_("Raw Opennebula"), 
                            widget=forms.Textarea, required=required)
        return listFields
    
    def getOrderFields(self):
        return [self.raw_opennebula]        
    
def throwErrorMessage(self, message):
    self.error_messages.update({'invalid_login_fogbow':_(message)})
    LOG.warning('Invalid Login.')
    raise forms.ValidationError(self.error_messages['invalid_login_fogbow'])

def getFieldsPerFormType(valueAuthType, authType):
    fields = KeystoneFields(authType)                                                
    if valueAuthType == fogbow_models.IdentityPluginConstants.AUTH_KEYSTONE:
        fields = KeystoneFields(authType)
    elif valueAuthType == fogbow_models.IdentityPluginConstants.AUTH_VOMS:
        fields = VOMSFields(authType)   
    elif valueAuthType == fogbow_models.IdentityPluginConstants.AUTH_TOKEN:
        fields = TokenFields(authType)
    elif valueAuthType == fogbow_models.IdentityPluginConstants.AUTH_OPENNEBULA:
        fields = OpennebulaFields(authType)
    elif valueAuthType == fogbow_models.IdentityPluginConstants.AUTH_RAW_KEYSTONE:
        fields = RawKeystoneFields(authType)         
    elif valueAuthType == fogbow_models.IdentityPluginConstants.AUTH_RAW_OPENNEBULA:
        fields = RawOpennebulaFields(authType)         
    elif valueAuthType == fogbow_models.IdentityPluginConstants.AUTH_LDAP:
        fields = LdapFields(authType)

    return fields
        
