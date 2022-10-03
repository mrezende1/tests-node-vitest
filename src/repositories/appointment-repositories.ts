import { Appointment } from "../entities/appointment";

export interface AppointementsRepository{
    create(appoitment: Appointment): Promise<void>
    findOvelappingAppointment(startsAt: Date, endsAt: Date): Promise<Appointment | null>
}