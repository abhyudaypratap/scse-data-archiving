from django.conf.urls import patterns, url
from django.contrib import admin
from .views import FacultyDetail, home, StudentDetail, OtherStaffDetail,new_student,all_faculty
from django.conf.urls.static import static

admin.autodiscover()
urlpatterns = patterns('',

                       url(r'^faculty-details/(?P<slug>\w+)/$',
                           FacultyDetail.as_view(), name='faculty_details'),
                       url(r'^student-details/(?P<slug>\w+)/$',
                           StudentDetail.as_view(), name='student-details'),
                       url(r'^otherstaff-details/(?P<slug>\w+)/$',
                           OtherStaffDetail.as_view(
                           ), name='otherstaff-details'),
                       url(r'^registration/$', new_student, name='registration'),
                       url(r'^home/$', home, name='home'),
                       url(r'^all-faculty/$', all_faculty, name='all_faculty'),

                       )
#urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
