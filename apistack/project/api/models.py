# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey has `on_delete` set to the desired behavior.
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models


class Hospitals(models.Model):
    provider_id = models.IntegerField(primary_key=True)
    name = models.TextField()
    type = models.TextField()
    phone = models.TextField(blank=True, null=True)
    url = models.TextField(blank=True, null=True)
    rating = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'hospitals'


class Address(models.Model):
    address = models.TextField()
    state = models.TextField(blank=True, null=True)
    city = models.TextField(blank=True, null=True)
    zip = models.TextField()
    county = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'address'


class OwnershipType(models.Model):
    ow_type = models.TextField()

    class Meta:
        managed = False
        db_table = 'ownership_type'


class HospitalAddress(models.Model):
    hospital = models.ForeignKey('Hospitals', models.DO_NOTHING, primary_key=True)
    address = models.ForeignKey(Address, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'hospital_address'
        unique_together = (('hospital', 'address'),)


class HospitalOwnership(models.Model):
    hospital = models.ForeignKey('Hospitals', models.DO_NOTHING, primary_key=True)
    ownership = models.ForeignKey('OwnershipType', models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'hospital_ownership'
        unique_together = (('hospital', 'ownership'),)


class HospitalComparison(models.Model):
    hospital = models.ForeignKey('Hospitals', models.DO_NOTHING, primary_key=True)
    emergency_services = models.IntegerField(blank=True, null=True)
    ehr = models.IntegerField(blank=True, null=True)
    mortality = models.IntegerField(blank=True, null=True)
    safety = models.IntegerField(blank=True, null=True)
    readmission = models.IntegerField(blank=True, null=True)
    patient_experience = models.IntegerField(blank=True, null=True)
    effectiveness = models.IntegerField(blank=True, null=True)
    timeliness = models.IntegerField(blank=True, null=True)
    medical_imaging = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'hospital_comparison'


## HCAHPS Measure Info

class HcahpsMeasureInfo(models.Model):
    question = models.TextField()
    response = models.TextField()
    measure_code = models.TextField()
    measure_start_date = models.DateField(blank=True, null=True)
    measure_end_date = models.DateField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'hcahps_measure_info'


class HcahpsMeasureFootnotes(models.Model):
    id = models.IntegerField(primary_key=True)
    footnote = models.TextField()

    class Meta:
        managed = False
        db_table = 'hcahps_measure_footnotes'


class HospitalsHcahpsQsnPercent(models.Model):
    hospital = models.ForeignKey(Hospitals, models.DO_NOTHING, primary_key=True)
    question_measure = models.ForeignKey(HcahpsMeasureInfo, models.DO_NOTHING)
    percent = models.IntegerField(blank=True, null=True)
    star_rating = models.IntegerField(blank=True, null=True)
    linear_mean_score = models.IntegerField(blank=True, null=True)
    completed_surveys = models.TextField(blank=True, null=True)
    survey_footnote = models.ForeignKey(HcahpsMeasureFootnotes, models.DO_NOTHING, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'hospitals_hcahps_qsn_percent'
        unique_together = (('hospital', 'question_measure'),)


## Spending per Benefeciary Measures

class SpendingMeasureInfo(models.Model):
    measure_code = models.TextField()
    national_score = models.FloatField(blank=True, null=True)
    national_median = models.FloatField(blank=True, null=True)
    measure_start_date = models.DateField(blank=True, null=True)
    measure_end_date = models.DateField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'spending_measure_info'


class HospitalSpendingPerBen(models.Model):
    hospital = models.ForeignKey('Hospitals', models.DO_NOTHING, primary_key=True)
    spending_measure = models.ForeignKey('SpendingMeasureInfo', models.DO_NOTHING)
    score = models.FloatField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'hospital_spending_per_ben'
        unique_together = (('hospital', 'spending_measure'),)


## Spending per Claim

class ClaimTypes(models.Model):
    type_name = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'claim_types'


class ClaimTimePeriod(models.Model):
    period_name = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'claim_time_period'


class HospitalSpendingPerClaim(models.Model):
    hospital = models.ForeignKey('Hospitals', models.DO_NOTHING, primary_key=True)
    claim_type = models.ForeignKey(ClaimTypes, models.DO_NOTHING, db_column='claim_type')
    claim_period = models.ForeignKey(ClaimTimePeriod, models.DO_NOTHING)
    avg_spending_hospital = models.IntegerField(blank=True, null=True)
    avg_spending_state = models.IntegerField(blank=True, null=True)
    percent_spending_hospital = models.FloatField(blank=True, null=True)
    percent_spending_state = models.FloatField(blank=True, null=True)
    percent_spending_nation = models.FloatField(blank=True, null=True)
    measure_start_date = models.DateField(blank=True, null=True)
    measure_end_date = models.DateField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'hospital_spending_per_claim'
        unique_together = (('hospital', 'claim_type', 'claim_period'),)

## Structural Measure Info

class StructuralMeasureInfo(models.Model):
    type_name = models.TextField(blank=True, null=True)
    measure_start_date = models.DateField(blank=True, null=True)
    measure_end_date = models.DateField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'structural_measure_info'


class HospitalsStructuralMeasure(models.Model):
    hospital = models.ForeignKey(Hospitals, models.DO_NOTHING, primary_key=True)
    measure_type = models.ForeignKey('StructuralMeasureInfo', models.DO_NOTHING)
    measure_response = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'hospitals_structural_measure'
        unique_together = (('hospital', 'measure_type'),)

## Death and Complications

class MortalityMeasureInfo(models.Model):
    type_name = models.TextField(blank=True, null=True)
    mortality_code = models.TextField(blank=True, null=True)
    national_rate = models.FloatField(blank=True, null=True)
    measure_start_date = models.DateField(blank=True, null=True)
    measure_end_date = models.DateField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'mortality_measure_info'

class MortalityNationalComparisonType(models.Model):
    comparison_name = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'mortality_national_comparison_type'


class HospitalsMortality(models.Model):
    hospital = models.ForeignKey(Hospitals, models.DO_NOTHING, primary_key=True)
    mortality = models.ForeignKey('MortalityMeasureInfo', models.DO_NOTHING)
    national_comparison = models.ForeignKey('MortalityNationalComparisonType', models.DO_NOTHING, db_column='national_comparison', blank=True, null=True)
    denominator = models.IntegerField(blank=True, null=True)
    score = models.FloatField(blank=True, null=True)
    lower_est = models.FloatField(blank=True, null=True)
    higher_est = models.FloatField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'hospitals_mortality'
        unique_together = (('hospital', 'mortality'),)

## Payment and Value care Measure

class PaymentMeasureCategory(models.Model):
    category_name = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'payment_measure_category'


class PaymentMeasureInfo(models.Model):
    type_name = models.TextField(blank=True, null=True)
    measure_code = models.TextField(blank=True, null=True)
    measure_start_date = models.DateField(blank=True, null=True)
    measure_end_date = models.DateField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'payment_measure_info'

class HospitalsPaymentMeasure(models.Model):
    hospital = models.ForeignKey(Hospitals, models.DO_NOTHING, primary_key=True)
    payment_measure = models.ForeignKey('PaymentMeasureInfo', models.DO_NOTHING)
    payment_category = models.ForeignKey('PaymentMeasureCategory', models.DO_NOTHING, blank=True, null=True)
    denominator = models.IntegerField(blank=True, null=True)
    payment = models.IntegerField(blank=True, null=True)
    lower_est = models.IntegerField(blank=True, null=True)
    highesr_est = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'hospitals_payment_measure'
        unique_together = (('hospital', 'payment_measure'),)


class ValueMeasureCategory(models.Model):
    category_name = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'value_measure_category'


class ValueMeasureInfo(models.Model):
    type_name = models.TextField(blank=True, null=True)
    measure_code = models.TextField(blank=True, null=True)
    measure_start_date = models.DateField(blank=True, null=True)
    measure_end_date = models.DateField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'value_measure_info'


class HospitalsValueMeasure(models.Model):
    hospital = models.ForeignKey(Hospitals, models.DO_NOTHING, primary_key=True)
    value_measure = models.ForeignKey('ValueMeasureInfo', models.DO_NOTHING)
    value_category = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'hospitals_value_measure'
        unique_together = (('hospital', 'value_measure'),)

## Yelp Reviews

class YelpHospInfo(models.Model):
    hospital = models.ForeignKey(Hospitals, models.DO_NOTHING, primary_key=True)
    yelp_id = models.TextField(blank=True, null=True)
    yelp_url = models.TextField(blank=True, null=True)
    rating = models.FloatField(blank=True, null=True)
    total_reviews = models.IntegerField(blank=True, null=True)
    accepts_credit_card = models.IntegerField(blank=True, null=True)
    accepts_insurance = models.IntegerField(blank=True, null=True)
    gender_neutral_restrooms = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'yelp_hosp_info'


class YelpReview(models.Model):
    hospital_id = models.IntegerField()
    review_score = models.FloatField(blank=True, null=True)
    review_date = models.DateField(blank=True, null=True)
    reviewed_user_id = models.IntegerField(blank=True, null=True)
    userful_score = models.IntegerField(blank=True, null=True)
    cool_score = models.IntegerField(blank=True, null=True)
    funny_score = models.IntegerField(blank=True, null=True)
    review_desc = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'yelp_review'


class YelpUser(models.Model):
    username = models.TextField(blank=True, null=True)
    user_state = models.TextField(blank=True, null=True)
    user_city = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'yelp_user'


class YelpUserRating(models.Model):
    yelp_review = models.ForeignKey(YelpReview, models.DO_NOTHING, primary_key=True)
    yelp_user = models.ForeignKey(YelpUser, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'yelp_user_rating'
        unique_together = (('yelp_review', 'yelp_user'),)


class YelpTags(models.Model):
    tag_name = models.CharField(unique=True, max_length=250)

    class Meta:
        managed = False
        db_table = 'yelp_tags'


class YelpHospitalTags(models.Model):
    hospital = models.ForeignKey(Hospitals, models.DO_NOTHING, primary_key=True)
    tag = models.ForeignKey('YelpTags', models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'yelp_hospital_tags'
        unique_together = (('hospital', 'tag'),)

