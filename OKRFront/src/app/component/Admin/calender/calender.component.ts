import { Component, OnInit, ViewChild } from '@angular/core';
import { CalendarOptions, Calendar, EventInput } from '@fullcalendar/core';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin, { DateClickArg, EventDragStopArg } from '@fullcalendar/interaction';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { CalendarService } from '../../../services/calendar.service';
import { Calender } from 'src/app/models/calender';
import { Objectif } from 'src/app/models/objectif';
import { ObjectifService } from 'src/app/services/objectif.service';
import { UserService } from 'src/app/services/user.service';
@Component({
  selector: 'app-calender',
  templateUrl: './calender.component.html',
  styleUrls: ['./calender.component.css'],
})
export class CalenderComponent implements OnInit {
  calendarOptions?: CalendarOptions;
  @ViewChild('fullcalendar') fullcalendar?: FullCalendarComponent;
  events: EventInput[] = [];
  objectifs: Objectif[] = [];
  selectedGoal?: Objectif;
  constructor(private calendarService: CalendarService,
    private ObjectifService : ObjectifService,
    private userService: UserService
   ) {}
   isADmin(): boolean {
    return this.userService.isAdmin();
  }
  ngOnInit(): void {
    this.calendarOptions = {
      plugins: [timeGridPlugin, interactionPlugin],
      editable: true,
      customButtons: {
        myCustomButton: {
          text: 'Custom!',
          click: () => {
            alert('Clicked the custom button!');
          },
        },
      },
      headerToolbar: {
        left: 'prev,next today myCustomButton',
        center: 'title',
        right: 'timeGridWeek,timeGridDay',
      },
      initialView: 'timeGridDay',
      slotDuration: '00:30:00',
      slotMinTime: '08:00:00',
      slotMaxTime: '17:00:00',
      businessHours: {
        startTime: '08:00',
        endTime: '17:00',
      },
      dateClick: this.handleDateClick.bind(this),
      eventClick: this.handleEventClick.bind(this),
      eventDragStop: this.handleEventDragStop.bind(this),
    };

    this.fetchAllEvents();
    this.fetchAllGoals();
  }

  fetchAllEvents() {
    this.calendarService.getEvents().subscribe(
      (response) => {
        this.events = response.map((event) => ({
          id: event._id,
          title: event.title,
          start: event.start,
          end: event.end,
        }));
        this.calendarOptions!.events = this.events;
      },
      (error) => {
        console.error('Error fetching events:', error);
      }
    );
  }

  fetchAllGoals() {
    this.ObjectifService.getAllObjectifs().subscribe(
      (response) => {
        this.objectifs = response;
      },
      (error) => {
        console.error('Error fetching goals:', error);
      }
    );
  }

  selectGoal(goal: Objectif) {
    this.selectedGoal = goal;
  }

  handleDateClick(arg: any) {
    // Vérifier si un objectif est sélectionné
    if (this.selectedGoal) {
      // Si un objectif est sélectionné, créer un événement à partir de cet objectif
      const eventData: Calender = {
        title: this.selectedGoal.description,
        start: arg.dateStr,
        end: arg.dateStr,
      };
      this.calendarService.createEvent(eventData).subscribe(
        (response) => {
          console.log('Event created:', response);
          this.fullcalendar?.getApi().addEvent({
            id: response._id,
            title: response.title,
            start: response.start,
            end: response.end,
          });
        },
        (error) => {
          console.error('Error creating event:', error);
        }
      );
    } else {
      // Si aucun objectif n'est sélectionné, demander à l'utilisateur de saisir un titre pour l'événement personnalisé
      const title = prompt('Enter the event title:');
      if (title) {
        const eventData: Calender = {
          title: title,
          start: arg.dateStr,
          end: arg.dateStr,
        };
        this.calendarService.createEvent(eventData).subscribe(
          (response) => {
            console.log('Event created:', response);
            this.fullcalendar?.getApi().addEvent({
              id: response._id,
              title: response.title,
              start: response.start,
              end: response.end,
            });
          },
          (error) => {
            console.error('Error creating event:', error);
          }
        );
      }
    }
  }
  
  handleEventClick(arg: any) {
    const eventId = arg?.event?.id as string; // Utilisation de l'opérateur de navigation sécurisé (?.) pour éviter les erreurs si arg ou event est null
    if (eventId) {
      const confirmation = confirm(`Do you want to confirm the deletion of event "${arg.event.title}"?`);
      if (confirmation) {
        // Suppression locale de l'événement
        this.events = this.events.filter((event) => event.id !== eventId);
        this.calendarOptions!.events = this.events;
  
        // Suppression de l'événement côté serveur
        this.calendarService.deleteEvent(eventId).subscribe(
          () => {
            console.log('Event deleted successfully on server');
          },
          (error) => {
            console.error('Error deleting event on server:', error);
            // En cas d'erreur, réafficher l'événement localement pour éviter toute désynchronisation
            this.fetchAllEvents();
          }
        );
      }
    } else {
      console.error('Event ID is null or undefined');
    }
  }  
  updateEvent(eventId: string, eventData: Calender) {
    this.calendarService.updateEvent(eventId, eventData).subscribe(
      (updatedEvent) => {
        const index = this.events.findIndex((event) => event.id === eventId);
        if (index !== -1) {
          this.events[index] = {
            id: updatedEvent._id,
            title: updatedEvent.title,
            start: updatedEvent.start,
            end: updatedEvent.end,
          };
        }
        this.calendarOptions!.events = this.events;
      },
      (error) => {
        console.error('Error updating event:', error);
      }
    );
  }

  handleEventDragStop(arg: any) {
    const eventId = arg.event.id as string;
    const eventData: Calender = {
      title: arg.event.title,
      start: arg.event.start?.toISOString() || '',
      end: arg.event.end?.toISOString() || '',
    };
    this.updateEvent(eventId, eventData);
  }
}