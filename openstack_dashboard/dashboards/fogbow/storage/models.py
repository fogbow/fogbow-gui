"""
Stub file to work around django bug: https://code.djangoproject.com/ticket/7198
"""

class APIDictWrapper(object):
    """ Simple wrapper for api dictionaries

        Some api calls return dictionaries.  This class provides identical
        behavior as APIResourceWrapper, except that it will also behave as a
        dictionary, in addition to attribute accesses.

        Attribute access is the preferred method of access, to be
        consistent with api resource objects from novaclient.
    """
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
            # caller is expecting a KeyError
            raise KeyError(e)

    def get(self, item, default=None):
        try:
            return self.__getattr__(item)
        except AttributeError:
            return default

    def __repr__(self):
        return "<%s: %s>" % (self.__class__.__name__, self._apidict)

class Instance(APIDictWrapper):
    _attrs = ['id', 'instanceId', 'details']