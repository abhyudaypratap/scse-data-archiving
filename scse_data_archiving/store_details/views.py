from django.core.urlresolvers import reverse
from django.http import HttpResponseRedirect, HttpResponse
from django.shortcuts import render, get_object_or_404, render_to_response
from django.views.generic.detail import DetailView

from .models import Faculty, Student, OtherStaff
from .forms import StudentForm

class FacultyDetail(DetailView):
    model = Faculty
    slug_field = 'faculty_code'


class StudentDetail(DetailView):
    model = Student
    slug_field = 'entry_number'


def home(request):
    return render(request, 'index.html', {})


class OtherStaffDetail(DetailView):
    model = OtherStaff
    slug_field = 'code'

def new_student(request):
    template_name = 'store_details/new_student1.html'
    
        
    if request.method == 'POST':
        EntryNumber=request.POST.get('EntryNumber')
        Name=request.POST.get('Name')
        BirthdateDay=request.POST.get('BirthdateDay')
        semester=request.POST.get('semester')
        JoiningYear=request.POST.get('JoiningYear')
        Email=request.POST.get('Email')
        Number=request.POST.get('Number')
        Address=request.POST.get('Address')
              
        student=Student(entry_number=EntryNumber,image="",name=Name,date_of_birth=BirthdateDay,age=20,current_semester=semester,joining_year=JoiningYear,projects="projects",email=Email,address=Address,mobile_number=Number,land_line="")  
        student.save()
        return HttpResponseRedirect(reverse('home', args=()))
    else:
        form = StudentForm()
        return render(request, template_name, {'form': form, })