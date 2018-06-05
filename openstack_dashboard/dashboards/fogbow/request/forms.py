import netaddr
import requests
import openstack_dashboard.models as fogbow_models
import base64

from django.core.validators import RegexValidator
from django.core.urlresolvers import reverse 
from django.core import validators
from django.utils.translation import ugettext_lazy as _  
from horizon import exceptions
from horizon import forms
from horizon import messages
from horizon.utils import fields
from django.core.urlresolvers import reverse_lazy
from horizon import messages
from django import shortcuts
from openstack_dashboard.dashboards.fogbow.members.views import IndexView as member_views
from openstack_dashboard.dashboards.fogbow.network.views import IndexView as network_views

RESOURCE_TERM = fogbow_models.FogbowConstants.RESOURCE_TERM
MEMBER_TERM = fogbow_models.FogbowConstants.MEMBER_TERM
REQUEST_TERM = fogbow_models.FogbowConstants.REQUEST_TERM
STORAGE_TERM = fogbow_models.FogbowConstants.STORAGE_TERM
NETWORK_TERM = fogbow_models.FogbowConstants.NETWORK_TERM
ORDER_TERM_CATEGORY = 'order'
REQUEST_TERM_CATEGORY = ORDER_TERM_CATEGORY
REQUEST_SCHEME = fogbow_models.FogbowConstants.REQUEST_SCHEME
ORDER_SCHEME = fogbow_models.FogbowConstants.ORDER_SCHEME
SCHEME_FLAVOR_TERM = 'http://schemas.fogbowcloud.org/template/resource#'
SCHEME_IMAGE_TERM = 'http://schemas.fogbowcloud.org/template/os#'
FOGBOW_RESOURCE_KIND_TERM = fogbow_models.FogbowConstants.FOGBOW_RESOURCE_KIND_TERM
SIZE_OCCI = fogbow_models.FogbowConstants.SIZE_OCCI
STORAGE_SCHEME = fogbow_models.FogbowConstants.STORAGE_SCHEME

class CreateRequest(forms.SelfHandlingForm):
    TYPE_REQUEST = (('one-time', 'one-time'), ('persistent', 'persistent'))
    TYPE_RESOURCE_KIND = (('compute', 'compute'), ('storage', 'storage'), ('network', 'network'))
    
    success_url = reverse_lazy("horizon:fogbow:request:index")
    
    count = forms.CharField(label=_('Number of orders'),
                           error_messages={
                               'required': _('This field is required.'),
                               'invalid': _('The string may only contain'
                                            ' ASCII characters and numbers.')},
                           validators=[validators.validate_slug],
                           initial='1')
    
    resourceKind = forms.ChoiceField(label=_('Resource kind'),
                               help_text=_('Resource kind'),
                               choices=TYPE_RESOURCE_KIND)

    cird = forms.CharField(label=_('CIDR'), initial='192.168.0.0/24',
                          widget=forms.TextInput(),
                          required=False)

    gateway = forms.CharField(label=_('Gateway'), initial='',
                          widget=forms.TextInput(),
                          required=False)
    
    allocation = forms.ChoiceField(label=_('Allocation'), help_text=_('Allocation'), required=False)  

    sizeStorage = forms.CharField(label=_('Volume size (in GB)'), initial=1,
                          widget=forms.TextInput(),
                          required=False)
    
    cpu = forms.CharField(label=_('Minimal number of vCPUs'), initial=1,
                          widget=forms.TextInput(),
                          required=False)
    mem = forms.CharField(label=_('Minimal amount of RAM in MB'), initial=1024,
                          widget=forms.TextInput(),
                          required=False)
    
    members = forms.ChoiceField(label=_('Members'), help_text=_('Members'), required=False)
        
    advanced_requirements = forms.CharField(label=_('Advanced requirements'),
                           error_messages={'invalid': _('The string may only contain'
                                            ' ASCII characters and numbers.')},
                           required=False, widget=forms.Textarea)
    
    image = forms.CharField(label=_('Image'), required=False, initial='fogbow-ubuntu',
                           error_messages={
                               'invalid': _('The string may only contain'
                                            ' ASCII characters and numbers.')})
    
    network_id = forms.ChoiceField(label=_('Network id'), help_text=_('Network id'), required=False)    
    
    type = forms.ChoiceField(label=_('Type'),
                               help_text=_('Type Order'),
                               choices=TYPE_REQUEST)
    
    data_user = forms.FileField(label=_('Extra user data file'), required=False)
    
    data_user_type = forms.ChoiceField(label=_('Extra user data file type'),
                           help_text=_('Data user type'),
                           required=False)
    
    publicKey = forms.CharField(label=_('Public key'),
                           error_messages={'invalid': _('The string may only contain'
                                            ' ASCII characters and numbers.')},
                           required=False, widget=forms.Textarea)
    
    data_user_file = forms.CharField(label=_('hidden'), required=False, widget=forms.Textarea)            

    def __init__(self, request, *args, **kwargs):
        super(CreateRequest, self).__init__(request, *args, **kwargs)
        
        response = fogbow_models.doRequest('get', RESOURCE_TERM, None, request)
        
        membersChoices = []
        membersChoices.append(('', 'Try first local, then any'))
        try:
            membersResponseStr = fogbow_models.doRequest('get', MEMBER_TERM, None, request).text
            members = member_views().getMembersList(fogbow_models.doRequest('get', MEMBER_TERM, None, request).text)
            for m in members:
                membersChoices.append((m.get('idMember'), m.get('idMember')))
        except Exception as error: 
            pass        

        self.fields['members'].choices = membersChoices

        dataUserTypeChoices = []
        dataUserTypeChoices.append(('text/x-shellscript', 'text/x-shellscript'))
        dataUserTypeChoices.append(('text/x-include-once-url', 'text/x-include-once-url'))
        dataUserTypeChoices.append(('text/x-include-url', 'text/x-include-url'))
        dataUserTypeChoices.append(('text/cloud-config-archive', 'text/cloud-config-archive'))
        dataUserTypeChoices.append(('text/upstart-job', 'text/upstart-job'))
        dataUserTypeChoices.append(('text/cloud-config', 'text/cloud-config'))        
        dataUserTypeChoices.append(('text/cloud-boothook', 'text/cloud-boothook'))
        self.fields['data_user_type'].choices = dataUserTypeChoices
        
        networksChoices = []
        networksChoices.append(('', 'Network default'))
        print 'Aqui'
        try:
            print 'Aqui 2'
            networks = network_views().getInstances(fogbow_models.doRequest('get', NETWORK_TERM, None, request).text)
            print networks
            for network in networks:
                networksChoices.append((network.get('id'), network.get('id')))
        except Exception as error: 
            print error
            pass    
        
        self.fields['network_id'].choices = networksChoices
        
        dataAllocation = []
        dataAllocation.append(('dynamic', 'Dynamic'))
        dataAllocation.append(('static', 'Static'))
        self.fields['allocation'].choices = dataAllocation
        

    def normalizeNameResource(self, resource):
        return resource.split(';')[0].replace('Category: ', '')

    def normalizeValueHeader(self, value):
        try:
            return value.replace('\n','').replace('\r','')
        except Exception:
            return ''

    def normalizeUserData(self, value):
        try:
            return base64.b64encode(value.replace('\n', '[[\\n]]').replace('\r', ''))
        except Exception:
            return ''

    def handle(self, request, data):
        try:
            if self.checkAllAttributes(data, request) == False:
                return None
            
            resourceKind = data['resourceKind']
            
            advancedRequirements = ''
            if data['advanced_requirements'] != '':
                advancedRequirements = ',org.fogbowcloud.order.requirements=%s' % (data['advanced_requirements'])
                advancedRequirements = self.normalizeValueHeader(advancedRequirements)
            else:
                advancedRequirements = ''
            
            headers = {}
            if resourceKind == 'compute':
                publicKeyCategory, publicKeyAttribute = '',''             
                if data['publicKey'].strip() is not None and data['publicKey'].strip(): 
                    publicKeyCategory = ',fogbow_public_key; scheme="http://schemas.fogbowcloud/credentials#"; class="mixin"'                
                    publicKeyAttribute = ',org.fogbowcloud.credentials.publickey.data=%s' % (data['publicKey'].strip())
                
                
                userDataAttribute = ''
                dataUserFile = data['data_user_file']
                if dataUserFile != None and dataUserFile != '':
                    normalizedUserDataFile = self.normalizeUserData(dataUserFile)
                    userDataAttribute = ',%s="%s",%s="%s"' % ('org.fogbowcloud.order.extra-user-data', normalizedUserDataFile,
                                                          'org.fogbowcloud.order.extra-user-data-content-type', data['data_user_type'])
                
                networkId = data['network_id']
                headerLink = ''
                if networkId is not None and networkId is not '':
                    headerLink = '</network/%s> ;%s;%s;' % (networkId,'rel="http://schemas.ogf.org/occi/infrastructure#network"','category="http://schemas.ogf.org/occi/infrastructure#networkinterface"')
                
                headers = {'Category' : '%s; %s; class="kind"%s,%s; scheme="http://schemas.fogbowcloud.org/template/os#"; class="mixin"%s'    
                            % (REQUEST_TERM_CATEGORY , REQUEST_SCHEME, '', data['image'].strip(), publicKeyCategory),
                           'X-OCCI-Attribute' : 'org.fogbowcloud.order.instance-count=%s,org.fogbowcloud.order.type=%s%s%s%s' % (data['count'].strip(), data['type'].strip(), publicKeyAttribute, advancedRequirements, userDataAttribute),
                           'Link' : '%s;' % (headerLink)}
            elif resourceKind == 'storage':
                sizeStorage = data['sizeStorage']
                
                headers = {'Category' : '%s; %s; class="kind"' % (REQUEST_TERM_CATEGORY, REQUEST_SCHEME), 'X-OCCI-Attribute' : '%s=%s' % (SIZE_OCCI, sizeStorage)}
            elif resourceKind == 'network':
                attrCIRD, attrGateway, attrAllocation = '', '', ''
                cird = data['cird']
                gateway = data['gateway']
                allocation = data['allocation']
                if cird is not None and cird is not '':
                    attrGateway = '%s=%s,' % ('occi.network.address', cird)
                if gateway is not None and gateway is not '':
                    attrCIRD = '%s=%s,' % ('occi.network.gateway', gateway)
                if allocation is not None and allocation is not '':
                    attrAllocation = '%s=%s' % ('occi.network.allocation', allocation)                            
                
                headers = {'Category' : '%s; %s; class="kind"' % (REQUEST_TERM_CATEGORY, REQUEST_SCHEME), 'X-OCCI-Attribute' : '%s%s%s' % (attrCIRD, attrGateway, attrAllocation)}

            addHeader = headers.get('X-OCCI-Attribute')
            headers.update({'X-OCCI-Attribute': addHeader + ', %s=%s' % (FOGBOW_RESOURCE_KIND_TERM, resourceKind)})
            if advancedRequirements != '':
                addHeader = headers.get('X-OCCI-Attribute')
                headers.update({'X-OCCI-Attribute': addHeader + '%s' % (advancedRequirements)})                                

            print '<@@>'
            print headers

            response = fogbow_models.doRequest('post', REQUEST_TERM, headers, request)
            
            if response != None and fogbow_models.isResponseOk(response.text) == True: 
                messages.success(request, _('Orders created'))
            
            return shortcuts.redirect(reverse("horizon:fogbow:request:index"))    
        except Exception:
            redirect = reverse("horizon:fogbow:request:index")
            exceptions.handle(request,
                              _('Unable to create orders.'),
                              redirect=redirect) 
            
    def returnFormatResponse(self, responseStr):      
        responseFormated = ''
        requests = responseStr.split('\n')
        for request in requests:
            if fogbow_models.FogbowConstants.REQUEST_TERM in request:
                responseFormated += request.split(fogbow_models.FogbowConstants.REQUEST_TERM)[1]
                if requests[-1] != request:
                    responseFormated += ' , '
        return responseFormated
    
    def checkAllAttributes(self, data, request):
        value = None;
        if self.existsBreakline(str(data['resourceKind']).strip()) == True:
            value = 'resource kind'
        if self.existsBreakline(str(data['publicKey']).strip())== True:
            value = 'public key'
        if self.existsBreakline(str(data['count']).strip())== True:
            value = 'count'
        if self.existsBreakline(str(data['sizeStorage']).strip())== True:
            value = 'size storage'
        
        if value is not None:
            messages.error(request, _('Wrong sintax. There is a breakline in the %s field.' % (value)))
            return False
        return True   
                
    def existsBreakline(self, attribute):
        auxList = {'att': attribute}
        if '\n' in auxList['att'] or '\r\n' in auxList['att']:
            return True
        return False
