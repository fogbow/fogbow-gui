from django.utils.translation import ugettext_lazy as _

from horizon import tables

class UsageTable(tables.DataTable):
    idMember = tables.Column("idMember", verbose_name=_("Member ID")) 
    consumed = tables.Column("usage", verbose_name=_("Usage compute"))
    consumedStorage = tables.Column("usageStorage", verbose_name=_("Usage storage"))
    status = tables.Column("timestamp", verbose_name=_("Timestamp"))    

    class Meta:
        name = "usage"
        verbose_name = _("Usage")