import { beforeEach, describe, expect, it } from 'vitest';

import { TrackedEventsComponent } from './tracked-events.component';
import { TrackedEventService } from '../../services/tracked-event.service';

describe('TrackedEventsComponent', () => {
  let component: TrackedEventsComponent;
  let service: TrackedEventService;

  beforeEach(() => {
    service = new TrackedEventService();
    component = new TrackedEventsComponent(service);
  });

  it('should create a tracked event and reset the shared form state', () => {
    const initialCount = service.getAll().length;

    component.updateEventForm({
      level: component.levelOptions[0] ?? 'Licence',
      semester: component.semesterOptions[0] ?? 'Semestre 1',
      name: ' Forum entreprise ',
    });

    component.submitTrackedEvent();

    const [createdEvent] = service.getAll();
    expect(service.getAll()).toHaveLength(initialCount + 1);
    expect(createdEvent.name).toBe('Forum entreprise');
    expect(component.eventForm).toEqual({ level: '', semester: '', name: '' });
    expect(component.isEditingTrackedEvent).toBe(false);
  });

  it('should populate the form when editing and persist the update', () => {
    const event = service.getAll()[0];

    component.editTrackedEvent(event);
    expect(component.eventForm.name).toBe(event.name);

    component.updateEventForm({ name: 'Nouvelle version' });
    component.submitTrackedEvent();

    expect(service.getById(event.id)?.name).toBe('Nouvelle version');
    expect(component.isEditingTrackedEvent).toBe(false);
  });

  it('should clamp the current page after deleting the last item on the last page', () => {
    component.setTrackedEventPageSize('1');
    component.eventState.setPage(component.totalTrackedEventPages);

    const lastVisibleEvent = component.pagedTrackedEvents[0];
    component.deleteTrackedEvent(lastVisibleEvent.id);

    expect(component.currentTrackedEventPage).toBe(component.totalTrackedEventPages);
  });
});
