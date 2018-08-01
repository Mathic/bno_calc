from django.http import HttpResponse
from django.template import loader

from .models import City


def index(request):
    city_list = City.objects.order_by('city_name')
    template = loader.get_template('calculator/index.html')
    context = {
        'city_list': city_list,
    }
    return HttpResponse(template.render(context, request))
