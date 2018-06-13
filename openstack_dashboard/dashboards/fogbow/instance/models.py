# TODO check this class is used
class APIDictWrapper(object):
    
    def __init__(self, apidict):
        self._apidict = apidict

    def __getattr__(self, attr):
        try:
            return self._apidict[attr]
        except KeyError:
            msg = 'Unknown attribute "%(attr)s" on APIResource object ' \
                  'of type "%(cls)s"' % {'attr': attr, 'cls': self.__class__}
            raise AttributeError(msg)

    def __getitem__(self, item):
        try:
            return self.__getattr__(item)
        except AttributeError as e:
            raise KeyError(e)

    def get(self, item, default=None):
        try:
            return self.__getattr__(item)
        except AttributeError:
            return default

    def __repr__(self):
        return "<%s: %s>" % (self.__class__.__name__, self._apidict)

class Compute(APIDictWrapper):
    _attrs = ['id', 'compute_id', 'state', 'host_name', 'v_cpu', 'memory', 'local_ip_address', 'ssh_public_address', 'ssh_user_name', 'ssh_extra_ports']