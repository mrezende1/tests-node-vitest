import { Appointment } from "../entities/appointment";
import { AppointementsRepository } from "../repositories/appointment-repositories";

interface CreateAppointmentRequest {
    customer: string;
    startsAt: Date;
    endsAt: Date;
}

type CreateAppointmentResponse = Appointment

export class CreateAppointment {

    constructor(
        private appointmentsRepository: AppointementsRepository
    ) { }

    async execute({
        customer,
        startsAt,
        endsAt
    }: CreateAppointmentRequest): Promise<CreateAppointmentResponse> {
        const overlappingAppointment = await this.appointmentsRepository.findOvelappingAppointment(
            startsAt,
            endsAt
        )

        if (overlappingAppointment){
            throw new Error("Another appointment overlaps this appointment dates")
        }
        
        const appointment = new Appointment({
            customer,
            startsAt,
            endsAt
        })

        await this.appointmentsRepository.create(appointment)

        return appointment
    }
}