import openstack_dashboard.models as fogbow_models
from horizon import views
from django.utils.translation import ugettext_lazy as _

REQUEST_TERM = fogbow_models.FogbowConstants.REQUEST_TERM_WITH_VERBOSE
FULFILLED_STATUS_REQUEST = 'FULFILLED'
OPEN_STATUS_REQUEST = 'OPEN'
CLOSED_STATUS_REQUEST = 'CLOSED'
DELETED_STATUS_REQUEST = 'DELETED'
PENDING_STATUS_REQUEST = 'PENDING'
SPAWNING_STATUS_REQUEST = 'SPAWNING'
TOTAL = 'TOTAL'

class IndexView(views.APIView):
    template_name = 'fogbow/overview/index.html'

    def get_data(self, request, context, *args, **kwargs):                        
        response = fogbow_models.doRequest('get', REQUEST_TERM, None, request)
                                          
        return self.getContextOverview(response, context)
    
    def getContextOverview(self, response, context):
        context['text_description_fogbow'] = _('Federation, opportunism and greenness in private infrastructure-as-a-service clouds through the barter of wares')
        
        if response == None:
            context['requestsFullfield'] = 0
            context['requestsOpen'] = 0
            context['requestsClosed'] = 0
            context['requestsDeleted'] = 0
            context['requestsPending'] = 0
            context['requestsSpawning'] = 0
            context['requestsTotal'] = 0
            context['requestsOpenPercent'] = 0
            context['requestsClosedPercent'] = 0
            context['requestsPendingPercent'] = 0        
            context['requestsDeletedPercent'] = 0
            context['requestsSpawningPercent'] = 0
            context['requestsFullfieldPercent'] = 0     
                        
            return context
        
        responseStr = response.text
        
        mapCountRequests = getMapCountRequests(responseStr)    
        context['requestsFullfield'] = mapCountRequests[FULFILLED_STATUS_REQUEST]
        context['requestsOpen'] = mapCountRequests[OPEN_STATUS_REQUEST]
        context['requestsClosed'] = mapCountRequests[CLOSED_STATUS_REQUEST]
        context['requestsDeleted'] = mapCountRequests[DELETED_STATUS_REQUEST]        
        context['requestsSpawning'] = mapCountRequests[SPAWNING_STATUS_REQUEST]
        context['requestsPending'] = mapCountRequests[PENDING_STATUS_REQUEST]
        context['requestsTotal'] = mapCountRequests[TOTAL]        
        context['requestsOpenPercent'] = fogbow_models.calculatePercent(mapCountRequests[OPEN_STATUS_REQUEST],
                                                           mapCountRequests[TOTAL])
        context['requestsClosedPercent'] = fogbow_models.calculatePercent(mapCountRequests[CLOSED_STATUS_REQUEST],
                                                           mapCountRequests[TOTAL])    
        context['requestsDeletedPercent'] = fogbow_models.calculatePercent(mapCountRequests[DELETED_STATUS_REQUEST], 
                                                           mapCountRequests[TOTAL])
        context['requestsFullfieldPercent'] = fogbow_models.calculatePercent(mapCountRequests[FULFILLED_STATUS_REQUEST],
                                                           mapCountRequests[TOTAL])
        context['requestsSpawningPercent'] = fogbow_models.calculatePercent(mapCountRequests[SPAWNING_STATUS_REQUEST],
                                                           mapCountRequests[TOTAL])
        context['requestsPendingPercent'] = fogbow_models.calculatePercent(mapCountRequests[PENDING_STATUS_REQUEST],
                                                           mapCountRequests[TOTAL])              
        
        print context
        
        return context
       
def getMapCountRequests(responseStr):
    requests = responseStr.split('\n')
    requestsFullfield, requestsOpen, requestsClosed, requestsDeleted ,requestsPending, requestsSpawning = 0, 0, 0, 0, 0, 0
    for request in requests:
        if FULFILLED_STATUS_REQUEST in request:
            requestsFullfield += 1
        elif OPEN_STATUS_REQUEST in request:
            requestsOpen += 1
        elif CLOSED_STATUS_REQUEST in request:
            requestsClosed += 1
        elif DELETED_STATUS_REQUEST in request:
            requestsDeleted += 1
        elif PENDING_STATUS_REQUEST in request:
            requestsPending += 1
        elif SPAWNING_STATUS_REQUEST in request:
            requestsSpawning += 1            
            
    totalRequest = requestsFullfield + requestsOpen + requestsClosed + requestsDeleted + requestsPending + requestsSpawning
    
    return {FULFILLED_STATUS_REQUEST: requestsFullfield, OPEN_STATUS_REQUEST: requestsOpen,
            CLOSED_STATUS_REQUEST: requestsClosed, DELETED_STATUS_REQUEST: requestsDeleted,
            PENDING_STATUS_REQUEST: requestsPending,SPAWNING_STATUS_REQUEST: requestsSpawning, TOTAL: totalRequest}
    