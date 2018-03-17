from django.contrib.auth.models import User
from rest_framework import serializers
from project.api.models import Hospitals, OwnershipType, HospitalOwnership

class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ('url', 'username', 'email', 'groups')

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