import unittest
from django.http import HttpRequest
from django.http import HttpResponse
import requests

from django.test import TestCase
from mock import MagicMock

import openstack_dashboard.models as main_models
import openstack_dashboard.views as main_views

from openstack_dashboard.forms import TokenForm
from openstack_dashboard.forms import OpennebulaForm
from openstack_dashboard.forms import VomsForm
from openstack_dashboard.forms import KeystoneFogbow

class TestMainViewMethod(unittest.TestCase):

    def setUp(self):
        print 'Set Up %s' % (self)

    def testGetContextFormAndFormFeatures(self):
        formName = {main_models.IdentityPluginConstants.AUTH_KEYSTONE,
                    main_models.IdentityPluginConstants.AUTH_TOKEN, 
                    main_models.IdentityPluginConstants.AUTH_OPENNEBULA,
                    main_models.IdentityPluginConstants.AUTH_VOMS}
        
        for name in formName:
            form = main_views.getContextForm(name)    
            self.assertTrue(form['formChosen'] is name)
            self.assertTrue(name in form['listForm'])

class TestMainModels(unittest.TestCase):

    def setUp(self):
        print 'Set Up %s' % (self)

    def testCheckUserAuthenticated(self):
        print ''
        
    def testDoRequest(self):
        print ''
        
    def testIsResponseOk(self):
        reponseStr = 'True'
        response = main_models.isResponseOk(reponseStr)
        self.assertTrue(response)
        
        reponseStr = 'Unauthorized'
        response = main_models.isResponseOk(reponseStr)
        self.assertFalse(response)
                    
    def testCalculatePercentage(self):        
        value = main_models.calculatePercent(10, 100)
        self.assertEquals(10 , value) 

from openstack_dashboard.dashboards.fogbow.members.views import IndexView as viewsMember 
        
class TestPanelMembersFogbowDashboard(unittest.TestCase):

    def setUp(self):
        print 'Set Up %s' % (self)

    def testConvertMbToGb(self):
        numberOfGb = 5
        value = viewsMember.convertMbToGb(viewsMember(), 5 * 1024)
        self.assertEquals(numberOfGb , value)    
        
    def testGetMembersList(self):
        value = 4
        responseStr = generateManagerResponseMember(value)
        list = viewsMember.getMembersList(viewsMember(), responseStr)
        self.assertEquals(value , len(list)) 
    
def generateManagerResponseMember(value):
    response = ''
    for x in range(0, value):
       response = response + 'id=1;cpuIdle=1;cpuInUse=1;memIdle=1;memInUse=1 \n'                      
    return response.strip()

from openstack_dashboard.dashboards.fogbow.overview import views as viewsOverview

class TestPanelOverviewFogbowDashboard(unittest.TestCase):

    def setUp(self):
        print 'Set Up %s' % (self)
        
    def testGetMapWithCountOfRequests(self):
        value = 3
        responseStr = generateResponseRequestsWithVerbose(value)
        mapRequests = viewsOverview.getMapCountRequests(responseStr)        
        self.assertEquals(value , mapRequests[viewsOverview.FULFILLED_STATUS_REQUEST])
        self.assertEquals(value , mapRequests[viewsOverview.OPEN_STATUS_REQUEST])
        self.assertEquals(value , mapRequests[viewsOverview.CLOSED_STATUS_REQUEST])
        self.assertEquals(value , mapRequests[viewsOverview.FAILED_STATUS_REQUEST])
        self.assertEquals(value , mapRequests[viewsOverview.DELETED_STATUS_REQUEST])
        self.assertEquals(value * 5 , mapRequests[viewsOverview.TOTAL]) 
        
def generateResponseRequestsWithVerbose(value):
    count, response = 1, ''
    while count <= value:
        response += 'FULFILLED \n OPEN \n CLOSED \n DELETED \n FAILED\n'
        count += 1
    
    return response

from openstack_dashboard.dashboards.fogbow.instance import views as viewsInstance 

class TestPanelInstanceFogbowDashboard(unittest.TestCase):

    def setUp(self):
        print 'Set Up %s' % (self)

    def testAreThereInstance(self):
        responseStr = viewsInstance.THERE_ARE_NOT_INSTANCE
        self.assertFalse(viewsInstance.areThereInstance(responseStr))
        
    def testNormalizeAttribute(self):
        value = '123'
        propertie = '%s%s' % (viewsInstance.X_OCCI_LOCATION, value)
        valuePropertie = viewsInstance.IndexView().normalizeAttribute( propertie)
        self.assertEquals(value , valuePropertie) 
        
    def test(self):
        print 'No'
                
def generateResponseGetAllInstances(value):
    response = ''
    for x in range(0, value):
        response += '%s/%s="test";%s="test";%s="test"; \n' % (
                                        main_models.FogbowConstants.REQUEST_TERM_WITH_VERBOSE,
                                        main_models.FogbowConstants.INSTANCE_ID_TERM,
                                        main_models.FogbowConstants.TYPE_TERM,
                                        main_models.FogbowConstants.STATE_TERM)
        
    return response.strip()  

from openstack_dashboard.dashboards.fogbow.request.views import IndexView as viewsRequest 

class TestPanelRequestFogbowDashboard(unittest.TestCase):

    def setUp(self):
        print 'Set Up %s' % (self)

    def testGetRequestsList(self):
        value = 3
        responseStr = generateResponseGetAllRequests(value)
        list = viewsRequest.getRequestsList(viewsRequest(), responseStr)    
        
        self.assertEquals(value, len(list)) 
        
    def testNormalizeAttributes(self):
        term, value = 'term', 'value'
        str = '%s="%s"' % (term, value)
        strNormalized = viewsRequest.normalizeAttributes(viewsRequest(), str, term)
        self.assertEquals(value, strNormalized) 

def generateResponseGetAllRequests(value):
    response = ''
    for x in range(0, value):
        response += '%s/%s="test";%s="test";%s="test"; \n' % (
                                        main_models.FogbowConstants.REQUEST_TERM_WITH_VERBOSE,
                                        main_models.FogbowConstants.FOGBOW_INSTANCE_ID_TERM,
                                        main_models.FogbowConstants.FOGBOW_TYPE_TERM,
                                        main_models.FogbowConstants.FOGBOW_STATE_TERM)
        
    return response.strip()

#     def test(self):
#         request = requests.Session()
#         response = HttpResponse('Neto', content_type='text/plain')
#         request.get = MagicMock(return_value=response)    
#         
# #         print '||||||||||||'
# #         print response.text
#         
#         response = main_models.checkUserAuthenticated(main_models.Token('id'))
# #         response = main_models.checkUserAuthenticated(request, main_models.Token('id'))        
#         
#         print '>>>>>>>>>>>>>'
#         print response
#                         
#         self.assertTrue(response)
#         
                                    
#     
# def axu():    
#     responseStr = generateResponseRequestsWithVerbose(4)
#     requests = responseStr.split('\n')
#     requestsFullfield, requestsOpen, requestsClosed, requestsDeleted ,requestsFailed = 0, 0, 0, 0, 0
#     for request in requests:
#         if 'FULFILLED' in request:
#             requestsFullfield += 1
#         elif 'OPEN' in request:
#             requestsOpen += 1
#         elif 'CLOSED' in request:
#             requestsClosed += 1
#         elif 'DELETED' in request:
#             requestsDeleted += 1
#         elif 'FAILED' in request:
#             requestsFailed += 1
# 
#     totalRequest = requestsFullfield + requestsOpen + requestsClosed + requestsDeleted + requestsFailed
#     
#     return True