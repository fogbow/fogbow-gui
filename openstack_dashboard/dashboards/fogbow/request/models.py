"""
Stub file to work around django bug: https://code.djangoproject.com/ticket/7198
"""
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

class Request(APIDictWrapper):
    _attrs = ['id', 'requestId', 'state', 'type', 'instanceId']