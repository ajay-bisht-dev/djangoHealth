from django.contrib.auth.models import User
from rest_framework import serializers
from project.api.models import Hospitals, OwnershipType, HospitalOwnership, Address, HospitalAddress

class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ('url', 'username', 'email', 'groups')

class AddressSerializer(serializers.ModelSerializer):
    #county_count = serializers.SerializerMethodField()
    #county_count = serializers.ReadOnlyField(source='county.count', read_only=True)

    class Meta:
        model = Address
        fields = ('state', 'county')
        #depth = 1
    
    #def get_county_count(self, obj):
    #    return obj.county.count()

class OwnershipSerializer(serializers.ModelSerializer):
    class Meta:
        model = OwnershipType
        fields = [
            'ow_type'
        ]

class HospitalSerializer(serializers.ModelSerializer):
    #h_id = serializers.StringRelatedField(many=True)
    #ow = serializers.StringRelatedField(many=True)
    #ownership = OwnershipSerializer(read_only=True, many=True)

    class Meta:
        model = Hospitals
        fields = [
            'provider_id',
            'name',
            'type',
            'rating'
        ]

class HospitalOwnershipSerializer(serializers.ModelSerializer):
    hospital = HospitalSerializer()
    ownership = OwnershipSerializer()

    class Meta:
        model = HospitalOwnership
        fields = [
            'hospital',
            'ownership'
        ]

class HospitalAddressSerializer(serializers.ModelSerializer):
    hospital = HospitalSerializer()
    address = AddressSerializer()

    class Meta:
        model = HospitalAddress
        fields = [
            'hospital',
            'address'
        ]
    
#class HospitalAddressSerializer(serializers.ModelSerializer):

    #hospital = serializers.ReadOnlyField(source='hospital.provider_id')
    #state = serializers.ReadOnlyField(source='address.state')
    #state = serializers.ReadOnlyField(source='address.state')

    #state_count = serializers.SerializerMethodField()
    #county_count = serializers.ReadOnlyField(source='address.county.count', read_only=True)

    #class Meta:
    #    model = Address
    #    fields = ( 'state', 'state_count')

    #def get_state_count(self, obj):
        #return obj.address.county.count(obj.address.county)
    #    return obj.address.state.count(state)

    #class Meta:
    #    model = HospitalAddress
    #    fields = ('hospital', 'county', 'state', 'address')

    #hospital = HospitalSerializer(read_only=True, many=True)
   # hospital = HospitalSerializer()
   # address  = AddressSerializer()
    #county   = AddressSerializer('county')
    #county   = serializers.StringField(source='address.county',read_only=True)

   # class Meta:
   #     model = HospitalAddress
   #     fields = [
   #         'hospital',
   #         'address'
            #'county'
   #     ]

#class HospitalAddressGroupSerializer(serializers.ModelSerializer):
#    group_county = serializers.SerializerMethodField()

#    def get_group_county(self, instance):
#        return HospitalAddressSerializer(instance.county.filter(group='county'), many=True).data
    
#    class Meta:
#        model   = HospitalAddress
#        fields  = [
#            'group_county'
#        ] 