#from django.shortcuts import render
from django.views.generic import TemplateView
from django.shortcuts import render, redirect
from rest_framework.response import Response
from rest_framework.renderers import JSONRenderer
from django.db import connection

# Create your views here.
from django.contrib.auth.models import User
from rest_framework import viewsets
from project.api.serializers import UserSerializer
from django.db.models import Count

from rest_framework import generics
from project.api.models import Hospitals, HospitalOwnership, HospitalAddress, Address
from .serializers import HospitalSerializer, HospitalOwnershipSerializer, AddressSerializer

def query_db(query, args=(), one=False):
    cursor = connection.cursor()
    cursor.execute(query, args)
    r = [dict((cursor.description[i][0], value) \
               for i, value in enumerate(row)) for row in cursor.fetchall()]
    #cursor.connection.close()
    
    return (r[0] if r else None) if one else r

class HomeView(TemplateView):
    template_name = 'api/home.html'

    def get(self, request):
        return render(request, self.template_name)


class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer


class HospitalsView(generics.RetrieveAPIView):
    lookup_field        = 'pk'  #slug, id
    serializer_class    = HospitalSerializer
    #queryset            = Hospitals.objects.all()

    #def get_qeryset(self):
    #    return Hospitals.objects.all()
    
    def get_object(self):
        pk = self.kwargs.get("pk")
        return Hospitals.objects.get(provider_id=pk)

class HospitalOwnershipView(generics.ListAPIView):
    #lookup_field        = 'hospital'
    queryset            = HospitalOwnership.objects.all()
    serializer_class    = HospitalOwnershipSerializer

    #def get(self, request): ## Customized response
    #    return Response({'some': 'data'})

    #def get_object(self): ## One way of returning a response based on pk
        #pk = self.kwargs.get("pk")
        #return HospitalOwnership.objects.get(hospital_id=pk)
    
    #def get_object(self): ## Third way of returning all objects
    #    return HospitalOwnership.objects.all()

    #renderer_classes = (JSONRenderer, )

    def get(self, request): ## Fourth way
        hp_count = HospitalOwnership.objects.all().count()
        content = {'hp_count': hp_count}
        return Response(content)

class AddressCountView(generics.ListAPIView):
    
    serializer_class    = AddressSerializer

    def get(self, request):
        add = Address.objects.all().values('county', 'state').annotate(total=Count('county'))
        content = {}
        for item in add:
            content[item['county']] = {
                'num_county': item['total']}
        return Response(add)
        #return queryset
    
class YelpHospitalRatingView(generics.ListAPIView):
    queryset = ''
    def get(self, request):
        query = """SELECT a.`state` as state, a.`county` as county, ROUND(AVG(hy.`rating`), 1) as rating, COUNT(*) as count
        FROM `yelp_hosp_info` hy
        JOIN `hospital_address` ha ON ha.`hospital_id` = hy.`hospital_id`
        JOIN `address` a ON a.`id` = ha.`address_id`
        WHERE a.`county` != ''
        GROUP BY a.`county`, a.`state`"""
        #cursor = connection.cursor()
        #cursor.execute("""SELECT a.`state` as state, a.`county` as county, ROUND(AVG(hy.`rating`), 2) as rating, COUNT(*) as count
        #FROM `yelp_hosp_info` hy
        #JOIN `hospital_address` ha ON ha.`hospital_id` = hy.`hospital_id`
        #JOIN `address` a ON a.`id` = ha.`address_id`
        #WHERE a.`county` != ''
        #GROUP BY a.`county`, a.`state`""")
        #row = cursor.fetchall()

        #res = {}
        #for item in row:
        #    res[]
        res = query_db(query)

        return Response(res)

