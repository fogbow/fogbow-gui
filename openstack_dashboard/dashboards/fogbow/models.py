import requests
import logging
import json
from django.conf import settings

import openstack_dashboard.models as fogbow_models
from openstack_dashboard.models import FogbowConstants
from openstack_dashboard.models import RequestConstants
from openstack_dashboard.models import DashboardConstants

from openstack_dashboard.dashboards.fogbow.federatednetwork.models import FederatedNetwork
from openstack_dashboard.dashboards.fogbow.network.models import Network
from openstack_dashboard.dashboards.fogbow.storage.models import Volume
from openstack_dashboard.dashboards.fogbow.instance.models import Compute
from openstack_dashboard.dashboards.fogbow.attachment.models import Attachment

LOG = logging.getLogger(__name__)

class MemberUtil:
     
    @staticmethod
    def get_members(federation_token_value):
        LOG.debug("Gettings members")
        response = RequestUtil.do_request_membership(RequestConstants.GET_METHOD, FogbowConstants.MEMBERS_ACTION_REQUEST_MERBERSHIP)
        RequestUtil.check_success_request(response) 
        
        response_json = response.text
        return MemberUtil.get_members_from_json(response_json)
        
    @staticmethod
    def get_members_from_json(response_json):
        members = []
        json_data = json.loads(response_json)
        for member in json_data:
            members.append((member, member))
            
        members = sorted(members)

        return members

class QuotaUtil:
    
    @staticmethod
    def get_compute_quota_response(member_id, federation_token_value):
        LOG.debug("Gettings compute quota")
        endpoint = '{compute_endpoint}/{member_id}'.format(compute_endpoint=FogbowConstants.COMPUTE_QUOTA_ACTION_REQUEST_MANAGER, member_id=member_id)
        response = RequestUtil.do_request_manager(RequestConstants.GET_METHOD, endpoint, federation_token_value)
        RequestUtil.check_success_request(response) 
        
        return response.text

    @staticmethod
    def get_compute_allocation_response(member_id, federation_token_value):
        LOG.debug("Gettings compute allocation")
        endpoint = '{compute_endpoint}/{member_id}'.format(compute_endpoint=FogbowConstants.COMPUTE_ALLOCATION_ACTION_REQUEST_MANAGER, member_id=member_id)
        response = RequestUtil.do_request_manager(RequestConstants.GET_METHOD, endpoint, federation_token_value)
        RequestUtil.check_success_request(response)
        
        return response.text

class FederatedNetworkUtil:

    @staticmethod
    def get_federated_networks(federation_token_value):
        LOG.debug("Gettings  federated networks")
        endpoint = "{action_request_manager}{status_sufix}".format(action_request_manager=FogbowConstants.FEDERATED_NETWORKS_ACTION_REQUEST_MANAGER, \
                                                                        status_sufix=FogbowConstants.STATUS_SUFIX_REQUEST_MANAGER)
        response = RequestUtil.do_request_manager(RequestConstants.GET_METHOD, endpoint, federation_token_value)
        RequestUtil.check_success_request(response)

        response_json = response.text
        return FederatedNetworkUtil.__get_federated_networks_from_json(response_json)

    @staticmethod
    def create_federated_network(label, cird, allowed_members, federation_token_value):
        LOG.debug("Trying to create federated network")

        data = {}
        data[FogbowConstants.LABEL_ORDER_FEDERATED_NETWORK_KEY] = label
        data[FogbowConstants.CIRD_ORDER_FEDERATED_NETWORK_KEY] = cird
        data[FogbowConstants.ALLOWED_MEMBERS_FEDERATED_NETWORK_KEY] = allowed_members

        json_data = json.dumps(data)

        response = RequestUtil.do_request_manager(RequestConstants.POST_METHOD, FogbowConstants.FEDERATED_NETWORKS_ACTION_REQUEST_MANAGER, federation_token_value, json_data=json_data)
        RequestUtil.check_success_request(response)

    @staticmethod 
    def delete_federated_network(federated_network_id, federation_token_value):
        LOG.debug("Trying to delete fedareted network: {federated_network_id}".format(federated_network_id=federated_network_id))
        endpoint = "{action_request_manager}/{federated_network_id}".format(action_request_manager=FogbowConstants.FEDERATED_NETWORKS_ACTION_REQUEST_MANAGER, federated_network_id=federated_network_id)
        response = RequestUtil.do_request_manager(RequestConstants.DELETE_METHOD, endpoint, federation_token_value)
        RequestUtil.check_success_request(response)

    @staticmethod
    def get_federated_network(federated_network_id, federation_token_value):
        LOG.debug("Getting federated network: {federated_network_id}".format(federated_network_id=federated_network_id))
        endpoint = "{action_request_manager}/{federated_network_id}".format(action_request_manager=FogbowConstants.FEDERATED_NETWORKS_ACTION_REQUEST_MANAGER, federated_network_id=federated_network_id)
        response = RequestUtil.do_request_manager(RequestConstants.GET_METHOD, endpoint, federation_token_value)
        RequestUtil.check_success_request(response)

        response_json = response.text        
        return FederatedNetworkUtil.__get_federated_network_from_json(response_json) 

    @staticmethod
    def __get_federated_networks_from_json(response_json):
        federated_networks = []

        data = json.loads(response_json)

        for federated_network in data:
            federated_networks.append(FederatedNetwork({'id': federated_network.get('instanceId'), 
            'federatednetwork_id': federated_network.get('instanceId'), 'state': federated_network.get('state')}))

        return federated_networks

    @staticmethod
    def __get_federated_network_from_json(response_json):
        federated_network = json.loads(response_json)

        # TODO to use contants
        id = federated_network.get('id', '-')
        cird = federated_network.get('cidrNotation', '-')
        label = federated_network.get('label', '-')
        allowed_members = federated_network.get('allowedMembers', '-')
        state = federated_network.get('state', '-')

        # TODO to use contants
        return {"id" :id, "state": state, "label": label, "cird": cird, "allowed_members": allowed_members }


class NetworkUtil:

    @staticmethod
    def get_networks(federation_token_value):
        LOG.debug("Gettings networks")
        endpoint = "{action_request_manager}{status_sufix}".format(action_request_manager=FogbowConstants.NETWORKS_ACTION_REQUEST_MANAGER, \
                     status_sufix=FogbowConstants.STATUS_SUFIX_REQUEST_MANAGER)
        response = RequestUtil.do_request_manager(RequestConstants.GET_METHOD, endpoint, federation_token_value)
        RequestUtil.check_success_request(response)

        response_json = response.text
        return NetworkUtil.__get_networks_from_json(response_json)
     
    @staticmethod 
    def delete_network(network_id, federation_token_value):
        LOG.debug("Trying to delete network: {network_id}".format(network_id=network_id))
        endpoint = "{action_request_manager}/{network_id}".format(action_request_manager=FogbowConstants.NETWORKS_ACTION_REQUEST_MANAGER, network_id=network_id)
        response = RequestUtil.do_request_manager(RequestConstants.DELETE_METHOD, endpoint, federation_token_value)
        RequestUtil.check_success_request(response)

    # TODO use object in attrs
    @staticmethod
    def create_network(address ,gateway, allocation, member, federation_token_value):
        LOG.debug("Trying to create network")

        data = {}
        data[FogbowConstants.GATEWAY_ORDER_NETWORK_KEY] = gateway
        data[FogbowConstants.ADDRESS_ORDER_COMPUTE_KEY] = address
        data[FogbowConstants.ALLOCATION_ID_ORDER_COMPUTE_KEY] = allocation
        data[FogbowConstants.PROVIDING_MEMBER_ORDER_KEY] = member

        json_data = json.dumps(data)

        response = RequestUtil.do_request_manager(RequestConstants.POST_METHOD, FogbowConstants.NETWORKS_ACTION_REQUEST_MANAGER, federation_token_value, json_data=json_data)
        RequestUtil.check_success_request(response)

    @staticmethod
    def get_network(network_id, federation_token_value):
        LOG.debug("Getting network: {network_id}".format(network_id=network_id))
        endpoint = "{action_request_manager}/{network_id}".format(action_request_manager=FogbowConstants.NETWORKS_ACTION_REQUEST_MANAGER, network_id=network_id)
        response = RequestUtil.do_request_manager(RequestConstants.GET_METHOD, endpoint, federation_token_value)
        RequestUtil.check_success_request(response)

        response_json = response.text        
        return NetworkUtil.__get_network_from_json(response_json) 

    # TODO reuse this method in __get_networks_from_json
    @staticmethod
    def __get_network_from_json(response_json):
        network = json.loads(response_json)

        # TODO to use contants
        id = network.get('id', '-')
        state = network.get('state', '-')
        label = network.get('label', '-')
        address = network.get('address', '-')
        gateway = network.get('gateway', '-')
        network_interface = network.get('networkInterface', '-')
        mac_inferface = network.get('MACInterface', '-')

        # TODO to use contants
        return {"id" :id, "network_id": id, "state": state, "label": label, "address": address, "gateway": gateway, \
                    "network_interface": network_interface, "mac_inferface": mac_inferface}

    @staticmethod
    def __get_networks_from_json(response_json):
        networks = []

        data = json.loads(response_json)
        for network in data:
            networks.append(Network({'id': network.get('instanceId', '-'), 
            'network_id': network.get('instanceId', '-'), 'state': network.get('state', '-'), 'provider': network.get('provider', '-')}))

        return networks
        
class ComputeUtil:

    @staticmethod
    def get_computes_json_response(federation_token_value):
        endpoint = "{action_request_manager}{status_sufix}".format(action_request_manager=FogbowConstants.COMPUTES_ACTION_REQUEST_MANAGER, status_sufix=FogbowConstants.STATUS_SUFIX_REQUEST_MANAGER)
        response = RequestUtil.do_request_manager(RequestConstants.GET_METHOD, endpoint, federation_token_value)
        RequestUtil.check_success_request(response)

        return response.text        

    @staticmethod
    def get_computes(federation_token_value):
        response_json = ComputeUtil.get_computes_json_response(federation_token_value)
        return ComputeUtil.__get_compute_ids_from_json(response_json)


    @staticmethod
    def delete_compute(compute_id, federation_token_value):
        LOG.debug("Trying to delete compute: {compute_id}".format(compute_id=compute_id))
        endpoint = "{action_request_manager}/{compute_id}".format(action_request_manager=FogbowConstants.COMPUTES_ACTION_REQUEST_MANAGER, compute_id=compute_id)
        response = RequestUtil.do_request_manager(RequestConstants.DELETE_METHOD, endpoint, federation_token_value)
        RequestUtil.check_success_request(response)

    # TODO use object in attrs
    @staticmethod
    def create_compute(vcpu, memory, member, image_id, network_id, extra_user_data, extra_user_data_type, public_key, federated_network_id, federation_token_value):
        LOG.debug("Trying to create compute")

        data = {}
        data[FogbowConstants.VCPU_ORDER_COMPUTE_KEY] = vcpu
        data[FogbowConstants.MEMORY_ORDER_COMPUTE_KEY] = memory
        data[FogbowConstants.PUBLIC_KEY_ORDER_COMPUTE_KEY] = public_key
        data[FogbowConstants.IMAGE_ID_ORDER_COMPUTE_KEY] = image_id
        data[FogbowConstants.PROVIDING_MEMBER_ORDER_KEY] = member

        if network_id:
            data[FogbowConstants.NETWORK_ID_ORDER_COMPUTE_KEY] = [ network_id ]

        if extra_user_data:
            data_userdata = {}
            data_userdata[FogbowConstants.EXTRA_USER_DATA_CONTENT_ORDER_COMPUTE_KEY] = extra_user_data
            data_userdata[FogbowConstants.EXTRA_USER_DATA_TYPE_ORDER_COMPUTE_KEY] = extra_user_data_type

            data[FogbowConstants.EXTRA_USER_DATA_ORDER_COMPUTE_KEY] = data_userdata

        if federated_network_id and settings.FEDERATED_NETWORK_EXTENSION:
            data[FogbowConstants.FED_NET_ID_ORDER_COMPUTE_TO_FEDERATED_NETWORK_KEY] = federated_network_id

        json_data = json.dumps(data)        

        # TODO to use contants
        extra_headers = {"Content-Type": "application/json"}

        response = RequestUtil.do_request_manager(RequestConstants.POST_METHOD, FogbowConstants.COMPUTES_ACTION_REQUEST_MANAGER, \
                     federation_token_value, json_data=json_data, extra_headers=extra_headers)
        RequestUtil.check_success_request(response)

    @staticmethod
    def get_compute(compute_id, federation_token_value):
        LOG.debug("Getting compute: {compute_id}".format(compute_id=compute_id))
        endpoint = "{action_request_manager}/{compute_id}".format(action_request_manager=FogbowConstants.COMPUTES_ACTION_REQUEST_MANAGER, compute_id=compute_id)
        response = RequestUtil.do_request_manager(RequestConstants.GET_METHOD, endpoint, federation_token_value)
        RequestUtil.check_success_request(response)

        response_json = response.text        

        return ComputeUtil.__get_compute_from_json(response_json)    

    # TODO reuse this method in __get_compute_ids_from_json
    @staticmethod
    def __get_compute_from_json(response_json):
        compute = json.loads(response_json)
        
        # TODO to use contants
        id = compute.get('id', '-')
        state = compute.get('state', '-')
        host_name = compute.get('hostName', '-')
        ssh_tunnel_con_data = compute.get('sshTunnelConnectionData', '-')
        ssh_public_address, ssh_user_name, ssh_extra_ports = '-', '-', '-'
        if ssh_tunnel_con_data != '-' and ssh_tunnel_con_data is not None:
            ssh_public_address = ssh_tunnel_con_data.get('sshPublicAddress', '-')
            ssh_user_name = ssh_tunnel_con_data.get('sshUserName', '-')
            ssh_extra_ports = ssh_tunnel_con_data.get('sshExtraPorts', '-')
        v_cpu = compute.get('vCPU', '-')
        ram = compute.get('ram', '-')
        local_ip_address = compute.get('localIpAddress', '-')
        federated_ip = compute.get('federatedIp', '-')

        # TODO to use contants
        return {"id" :id, "compute_id": id, "state": state, "host_name": host_name, "v_cpu": v_cpu, \
                    "ram": ram, "local_ip_address": local_ip_address, "ssh_public_address": ssh_public_address, \
                    "ssh_user_name": ssh_user_name, "ssh_extra_ports": ssh_extra_ports, "federated_ip": federated_ip }

    @staticmethod
    def __get_compute_ids_from_json(response_json):    
        computes = []

        data = json.loads(response_json)
        for compute in data:
            # TODO to use contants
            id = compute.get('instanceId', '-')
            state = compute.get('state', '-')
            provider = compute.get('provider', '-')

            # TODO to use contants
            computes.append(Compute({"id" :id, "compute_id": id, "state": state, "provider": provider }))
        return computes        


class VolumeUtil:

    @staticmethod
    def get_volumes_json_response(federation_token_value):
        LOG.debug("Gettings volumes")
        endpoint = "{action_request_manager}{status_sufix}".format(action_request_manager=FogbowConstants.VOLUMES_ACTION_REQUEST_MANAGER, \
                     status_sufix=FogbowConstants.STATUS_SUFIX_REQUEST_MANAGER)
        response = RequestUtil.do_request_manager(RequestConstants.GET_METHOD, endpoint, federation_token_value)
        RequestUtil.check_success_request(response)
        return response.text        
        return VolumeUtil.__get_volumes_from_json(response_json)
    
    @staticmethod
    def get_volumes(federation_token_value):
        response_json = VolumeUtil.get_volumes_json_response(federation_token_value)
        return VolumeUtil.__get_volumes_from_json(response_json)

    @staticmethod
    def delete_volume(volume_id, federation_token_value):
        LOG.debug("Trying to delete volume: {volume_id}".format(volume_id=volume_id))
        endpoint = "{action_request_manager}/{volume_id}".format(action_request_manager=FogbowConstants.VOLUMES_ACTION_REQUEST_MANAGER, volume_id=volume_id)
        response = RequestUtil.do_request_manager(RequestConstants.DELETE_METHOD, endpoint, federation_token_value)
        RequestUtil.check_success_request(response)

    # TODO use object in attrs
    @staticmethod
    def create_volume(size, member, federation_token_value):
        LOG.debug("Trying to create volume")

        data = {}
        data[FogbowConstants.SIZE_ORDER_VOLUME_KEY] = size
        data[FogbowConstants.PROVIDING_MEMBER_ORDER_KEY] = member
        json_data = json.dumps(data)

        response = RequestUtil.do_request_manager(RequestConstants.POST_METHOD, FogbowConstants.VOLUMES_ACTION_REQUEST_MANAGER, federation_token_value, json_data=json_data)
        RequestUtil.check_success_request(response)

    @staticmethod
    def get_volume(volume_id, federation_token_value):
        LOG.debug("Getting volume: {volume_id}".format(volume_id=volume_id))
        endpoint = "{action_request_manager}/{volume_id}".format(action_request_manager=FogbowConstants.VOLUMES_ACTION_REQUEST_MANAGER, volume_id=volume_id)
        response = RequestUtil.do_request_manager(RequestConstants.GET_METHOD, endpoint, federation_token_value)
        RequestUtil.check_success_request(response)      

        response_json = response.text

        return VolumeUtil.__get_volume_from_json(response_json)

    # TODO reuse this method in __get_volumes_from_json
    @staticmethod
    def __get_volume_from_json(response_json):
        volume = json.loads(response_json)

        # TODO to use contants
        id = volume.get('id', '-')
        state = volume.get('state', '-')
        name = volume.get('name', '-')
        size = volume.get('size', '-')        

        # TODO to use contants
        return {"id" :id, "volume_id": id, "state": state, "name": name, "size": size}

    @staticmethod
    def __get_volumes_from_json(response_json):
        volumes = []

        data = json.loads(response_json)
        for volume in data:
            # TODO to use contants
            id = volume.get('instanceId', '-')
            state = volume.get('state', '-')
            provider = volume.get('provider', '-')            

            # TODO to use contants
            volumes.append(Volume({"id" :id, "volume_id": id, "state": state, "provider": provider}))

        return volumes

class AttachmentUtil:

    @staticmethod
    def get_attachments(federation_token_value):
        LOG.debug("Gettings attachments")
        endpoint = "{action_request_manager}{status_sufix}".format(action_request_manager=FogbowConstants.ATTACHMENTS_ACTION_REQUEST_MANAGER, \
                     status_sufix=FogbowConstants.STATUS_SUFIX_REQUEST_MANAGER)        
        response = RequestUtil.do_request_manager(RequestConstants.GET_METHOD, endpoint, federation_token_value)
        RequestUtil.check_success_request(response)

        response_json = response.text        
        return AttachmentUtil.__get_attachments_from_json(response_json)

    @staticmethod
    def delete_attachment(attachment_id, federation_token_value):
        LOG.debug("Trying to delete attachment: {attachment_id}".format(attachment_id=attachment_id))
        endpoint = "{action_request_manager}/{attachment_id}".format(action_request_manager=FogbowConstants.ATTACHMENTS_ACTION_REQUEST_MANAGER, attachment_id=attachment_id)
        response = RequestUtil.do_request_manager(RequestConstants.DELETE_METHOD, endpoint, federation_token_value)
        RequestUtil.check_success_request(response)

    # TODO use object in attrs
    @staticmethod
    def create_attachment(target, source, federation_token_value):
        LOG.debug("Trying to create attachment")

        data = {}
        data[FogbowConstants.DEVICE_ORDER_ATTACHMENT] = ""
        data[FogbowConstants.TARGET_ORDER_ATTACHMENT] = target
        data[FogbowConstants.SOURCE_ORDER_ATTACHMENT] = source
        json_data = json.dumps(data)

        response = RequestUtil.do_request_manager(RequestConstants.POST_METHOD, FogbowConstants.ATTACHMENTS_ACTION_REQUEST_MANAGER, federation_token_value, json_data=json_data)
        RequestUtil.check_success_request(response)

    @staticmethod
    def get_attachment(attachment_id, federation_token_value):
        LOG.debug("Getting attachment: {attachment_id}".format(attachment_id=attachment_id))
        endpoint = "{action_request_manager}/{attachment_id}".format(action_request_manager=FogbowConstants.ATTACHMENTS_ACTION_REQUEST_MANAGER, attachment_id=attachment_id)
        response = RequestUtil.do_request_manager(RequestConstants.GET_METHOD, endpoint, federation_token_value)
        RequestUtil.check_success_request(response)      

        response_json = response.text        

        return AttachmentUtil.__get_attachment_from_json(response_json)        

    @staticmethod
    def __get_attachments_from_json(response_json):
        attachments = []

        data = json.loads(response_json)
        for attachment in data:
            # TODO to use contants
            id = attachment.get('instanceId', '-')
            state = attachment.get('state', '-')
            provider = attachment.get('provider', '-')     

            # TODO to use contants
            attachments.append(Attachment({"id" :id, "attachment_id": id, "state": state, "provider": provider}))

        return attachments    

    @staticmethod
    def __get_attachment_from_json(response_json):
        attachment = json.loads(response_json)

        # TODO to use contants
        id = attachment.get('id', '-')
        state = attachment.get('state', '-')
        device = attachment.get('device', '-')
        server_id = attachment.get('serverId', '-')
        volume_id = attachment.get('volumeId', '-')

        # TODO to use contants
        return {"id" :id, "attachment_id": id, "state": state, "device": device, "server_id": server_id, "volume_id": volume_id}

class ImageUtil:

    @staticmethod
    def get_images_response(member_id, federation_token_value):
        # TODO: Use contansts
        extra_headers = {"memberId": member_id}
        
        response = RequestUtil.do_request_manager(RequestConstants.GET_METHOD, FogbowConstants.IMAGES_ACTION_REQUEST_MANAGER, federation_token_value, extra_headers=extra_headers)
        RequestUtil.check_success_request(response)
        return response

class RequestUtil:
    
    @staticmethod
    def check_success_request(response):
        if response == None:
            raise Exception("Response is null")

        status_code = response.status_code
        if status_code != RequestConstants.OK_STATUS_CODE and status_code != RequestConstants.CREATED_STATUS_CODE and status_code != RequestConstants.OK_NO_CONTENT_STATUS_CODE:
            raise Exception("Response is not ok. Status code is {code}".format(code=response.status_code))

    @staticmethod
    def do_request_membership(method_request, action_enpoint):
        timeout_get = settings.TIMEOUT_POST
    
        endpoint = settings.FOGBOW_MEMBERSHIP_ENDPOINT + action_enpoint
        LOG.debug("Requisting to membership in the endpoint: {endpoint}".format(endpoint=endpoint))
        try:
            if method_request == RequestConstants.GET_METHOD:
                response = requests.get(endpoint, timeout=timeout_get)
        except Exception as e:
            msg = "Error while requesting membership: {error}".format(error=str(e))
            LOG.error(msg)
            raise Exception(msg)
            
        return response
    
    @staticmethod
    def do_request_manager(method_request, action_enpoint, federation_token_value, json_data=None, extra_headers=None):
        timeout_post = settings.TIMEOUT_POST
        if timeout_post is None or not timeout_post:
            timeout_post = DashboardConstants.DEFAULT_POST_TIMEOUT
        timeout_delete = settings.TIMEOUT_DELETE
        if timeout_delete is None or not timeout_delete:
            timeout_delete = DashboardConstants.DEFAULT_DELETE_TIMEOUT    
        timeout_get = settings.TIMEOUT_GET
        if timeout_get is None or not timeout_get:
            timeout_get = DashboardConstants.DEFAULT_GET_TIMEOUT
    
        headers = {RequestConstants.CONTENT_TYPE_HEADER: RequestConstants.JSON_APPLIVATION_VALUE_HEADER,
                    FogbowConstants.FEDERATION_TOKEN_VALUE : federation_token_value}

        if extra_headers:
            for key, value in extra_headers.items():
                headers[key] = value

        try:
            if method_request == RequestConstants.GET_METHOD:
                response = requests.get(settings.FOGBOW_MANAGER_CORE_ENDPOINT + action_enpoint, headers=headers, timeout=timeout_get)
            elif method_request == RequestConstants.DELETE_METHOD:
                response = requests.delete(settings.FOGBOW_MANAGER_CORE_ENDPOINT + action_enpoint, headers=headers, timeout=timeout_delete)
            elif method_request == RequestConstants.POST_METHOD:
                response = requests.post(settings.FOGBOW_MANAGER_CORE_ENDPOINT + action_enpoint, headers=headers, timeout=timeout_post, data=json_data)
        except Exception as e:
            msg = "Error while requesting membership: {error}".format(error=str(e))
            LOG.error(msg)
            raise Exception(msg)
            
        return response    
        