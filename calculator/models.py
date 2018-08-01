from django.db import models


# Create your models here.
class City(models.Model):
    class Meta:
        verbose_name_plural = "cities"
    city_name = models.CharField(max_length=200)
    tech_1 = models.IntegerField(default=10)
    tech_2 = models.IntegerField(default=20)
    tech_3 = models.IntegerField(default=30)
    tech_4 = models.IntegerField(default=40)
    tech_5 = models.IntegerField(default=50)
    tech_6 = models.IntegerField(default=60)

    def __str__(self):
        return self.city_name
