import { over } from 'cypress/types/lodash';
import  { areIntervalsOverlapping } from 'date-fns'

import { Appointment } from "../../entities/appointment";
import { AppointementsRepository } from "../appointment-repositories";

export class InMemoryAppointmentsRepository implements AppointementsRepository{
    public items: Appointment[] = []
    
    async create(appoitment: Appointment): Promise<void> {
        this.items.push(appoitment)
    }

    async findOvelappingAppointment(startsAt: Date, endsAt: Date): Promise<Appointment | null> {
        const overLappingAppointment = this.items.find(appointment => {
            return areIntervalsOverlapping(
                { start: startsAt, end: endsAt },
                { start: appointment.startsAt, end: appointment.endsAt },
                { inclusive: true}
            )
        })

        if (!overLappingAppointment){
            return null
        }

        return overLappingAppointment
    }
}