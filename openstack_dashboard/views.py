import os
import django
import horizon
import logging
 
from horizon import forms
from django import shortcuts
from django.http import Http404
from django.shortcuts import render
from django.views.decorators import vary
from openstack_dashboard.models import User
from openstack_dashboard.models import Token
from openstack_dashboard.models import IdentityPluginConstants as IPConstants
from django.contrib.auth.decorators import login_required
from django.contrib.auth import views as django_auth_views
from django.http import HttpResponseRedirect, HttpResponse
from openstack_dashboard import forms
from django.utils import functional
from openstack_dashboard.forms import AllForm
from django.contrib import auth
from openstack_dashboard import models as auth_user
from openstack_auth import views
from openstack_auth import forms
from django.contrib.auth import authenticate, login
from django.conf import settings
from urlparse import urlparse, parse_qs
import openstack_dashboard.models as fogbow_models
from base64 import b64encode, b64decode 
import requests
import urllib
import time
import random

LOG = logging.getLogger(__name__)

def get_user_home(user):
    return horizon.get_dashboard('fogbow').get_absolute_url()

@vary.vary_on_cookie
def splash(request):
    if request.user.is_authenticated():
        return shortcuts.redirect(get_user_home(request.user))
    form = KeystoneFogbow()
    request.session.clear()
    request.session.set_test_cookie()
    
    return shortcuts.render(request, 'splash.html', {'form': form})

# TODO review this code
@vary.vary_on_cookie
def splash_fogbow(request):             
    if request.user.is_authenticated():
        return shortcuts.redirect(get_user_home(request.user))     
  
    if settings.FOGBOW_FEDERATION_AUTH_TYPE == fogbow_models.IdentityPluginConstants.AUTH_NAF:
        try: 
            token = urllib.unquote(getQueryAttr(request, 'tokenEncrypted=')).strip()
            secretKeyEncrypted = urllib.unquote(getQueryAttr(request, 'secretKeyEncrypted=')).strip()
            secretKeySignature = urllib.unquote(getQueryAttr(request, 'secretKeySignature=')).strip()
            nonce = urllib.unquote(getQueryAttr(request, 'nonce=')).strip()
            nonceSignature = urllib.unquote(getQueryAttr(request, 'nonceSignature=')).strip()
            nafUtil = fogbow_models.NafUtil();
                        
            # Decrypt secret key
            secretKey = nafUtil.decrypt(secretKeyEncrypted)
            if secretKey == None:
                return HttpResponse('Unauthorized. Invalid secret key decrypt.', status=401)         
                        
            # Verify secretKeyEncrypted signature
            if nafUtil.verify(secretKeyEncrypted, secretKeySignature) == False:
                return HttpResponse('Unauthorized. Invalid secretKeyEncrypted signature.', status=401)
            
            # Verify nonce signature
            if nafUtil.verify(nonce, nonceSignature) == False:
                return HttpResponse('Unauthorized. Invalid nonce signature.', status=401)            
 
            # Decrypt 
            token = nafUtil.decryptAES(token, secretKey)
            if token == None:
                return HttpResponse('Unauthorized. Invalid token decrypt.', status=401)

            
            # Check nonce
            if checkNonce(nonce) == False:
                return HttpResponse('Unauthorized. Invalid nonce.', status=401)
            LOG.info('Nonce Ok')
           
            token = str(token)            
            finalToken = '%s!#!%s' % (token, nafUtil.createCredentials(token))
            finalToken = b64encode(finalToken)
            LOG.info(finalToken)   
            credentials = {fogbow_models.IdentityPluginConstants.AUTH_NAF: finalToken}
            user = authenticate(request=request, federationCredentials=credentials, federationEndpoint=settings.FOGBOW_FEDERATION_AUTH_ENDPOINT)  
            login(request, user)
            return shortcuts.redirect(get_user_home(request.user))
        except Exception as e:
            LOG.error(e)
            return HttpResponse('Unauthorized. Invalid token.', status=401)
  
#   TODO review - Simple Token
    try:
        httpHost = request.META['HTTP_REFERER']
    except:
        httpHost = None
    if settings.FOGBOW_FEDERATION_AUTH_TYPE == fogbow_models.IdentityPluginConstants.AUTH_SIMPLE_TOKEN and (httpHost != None and settings.FOGBOW_FEDERATION_SIMPLETOKEN_HOST in httpHost):
        try:
            token = request.META['QUERY_STRING'].split('token=')[1]
            credentials = {fogbow_models.IdentityPluginConstants.AUTH_SIMPLE_TOKEN: token}
            user = authenticate(request=request,federationCredentials=credentials, federationEndpoint=None)
            login(request, user)
            return shortcuts.redirect(get_user_home(request.user))
        except:
            print("Error")

#   TODO review - Shiboleth ...
    shibsessionExists = False
    for x in request.COOKIES:
        if x.startswith('_shibsession_'):
            shibsessionExists = True
            break


    if shibsessionExists and settings.FOGBOW_FEDERATION_AUTH_TYPE == fogbow_models.IdentityPluginConstants.AUTH_SHIBBOLETH:
        assertion_url = urlparse(request.META['HTTP_SHIB_ASSERTION'])
        _key = parse_qs(assertion_url.query)['key'][0]
        _id = parse_qs(assertion_url.query)['ID'][0]
            
        credentials = {'assertionKey': _key, 'assertionId': _id}
        user = authenticate(request=request,federationCredentials=credentials,
                                        federationEndpoint=None)           
        login(request, user)     
        return shortcuts.redirect(get_user_home(request.user))
    
    request.session.clear()
    request.session.set_test_cookie()

    return shortcuts.render(request, 'fogbow_splash.html', getContextForm())

def fogbow_Login(request, template_name=None, extra_context=None, **kwargs):
    formChosen = ''
    formReference = AllForm
    
    initial = {}
    if formChosen == IPConstants.AUTH_KEYSTONE:
        if (request.user.is_authenticated() and
            auth.REDIRECT_FIELD_NAME not in request.GET and
            auth.REDIRECT_FIELD_NAME not in request.POST):
            return shortcuts.redirect(settings.LOGIN_REDIRECT_URL)
    
        current_region = request.session.get('region_endpoint', None)
        requested_region = request.GET.get('region', None)
        regions = dict(getattr(settings, 'AVAILABLE_REGIONS', []))
        if requested_region in regions and requested_region != current_region:
            initial.update({'region': requested_region})
    
    if request.method == "POST":                
        if django.VERSION >= (1, 6):
            form = functional.curry(formReference)
        else:
            form = functional.curry(formReference, request)
    else:
        form = functional.curry(formReference, initial=initial)
        
    if not template_name:
        if request.is_ajax():
            template_name = 'auth/fogbow_login.html'
            extra_context['hide'] = True
        else:
            template_name = 'auth/fogbowlogin.html'
            
    if extra_context is None:
        extra_context = {'redirect_field_name': auth.REDIRECT_FIELD_NAME}
        
    extra_context.update(getContextForm())
    del extra_context['form']               

    res = django_auth_views.login(request,
                                  template_name=template_name,
                                  authentication_form=form,
                                  extra_context=extra_context,
                                  **kwargs)
    
    if request.user.is_authenticated():
        if formChosen == IPConstants.AUTH_KEYSTONE:
            auth_user.set_session_from_user(request, request.user)
            regions = dict(forms.Login.get_region_choices())
            region = request.user.endpoint
            region_name = regions.get(region)
            request.session['region_endpoint'] = region
            request.session['region_name'] = region_name        
        else:  
            request._cached_user = request.user
            request.user = request.user
                    
    return res


def getContextForm():    
    return {'form': AllForm(), 'federationForm' : fogbow_models.getTitle(settings.FOGBOW_FEDERATION_AUTH_TYPE)}

def getQueryAttr(request, attribute):
    attributes = request.META['QUERY_STRING'].split('&')
    for attr in attributes:
        if attribute in attr:
            return attr.split(attribute)[1]    
    return None

# Nonce Utils
values = {}

def getNonce(request):
    value = str(random.random())
    values[value] = int(round(time.time() * 1000))
    return HttpResponse(value)

def checkNonce(nonce):
    try:
        print values
        for key in values.keys():
            if int(round(time.time() * 1000)) - values[key] > 10000:
                values.pop(key, None)
            if str(key) == str(nonce):
                removed = values.pop(str(nonce), None)
                return True
        return False
    except Exception as e:
        print str(e)
        return False
