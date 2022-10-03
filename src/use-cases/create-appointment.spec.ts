import { describe, expect, it } from "vitest";
import { Appointment } from "../entities/appointment";
import { InMemoryAppointmentsRepository } from "../repositories/in-memory/in-memory-appointments-repository";
import { getFutureDate } from "../tests/utils/get-future-date";
import { CreateAppointment } from "./create-appointment";

describe('Create Appointment', () => {
    it('should be able to create an appointement', () => {
        const appointmentsRepository = new InMemoryAppointmentsRepository
        const createAppointement = new CreateAppointment(appointmentsRepository)
        const startsAt = getFutureDate("2022-08-10")
        const endsAt = getFutureDate("2022-08-11")

        expect(createAppointement.execute({
            customer: 'John Doe',
            startsAt,
            endsAt
        })).resolves.toBeInstanceOf(Appointment)
    });

    it('should not be able to create an appointement with overlapping dates', async () => {
        const appointmentsRepository = new InMemoryAppointmentsRepository
        const createAppointement = new CreateAppointment(appointmentsRepository)
        const startsAt = getFutureDate("2022-08-10")
        const endsAt = getFutureDate("2022-08-15")

        await createAppointement.execute({
            customer: 'John Doe',
            startsAt,
            endsAt
        })

        expect(createAppointement.execute({
            customer: 'John Doe',
            startsAt: getFutureDate("2022-08-10"),
            endsAt: getFutureDate("2022-08-15")
        })).rejects.toBeInstanceOf(Error)

        expect(createAppointement.execute({
            customer: 'John Doe',
            startsAt: getFutureDate("2022-08-08"),
            endsAt: getFutureDate("2022-08-12")
        })).rejects.toBeInstanceOf(Error)

        expect(createAppointement.execute({
            customer: 'John Doe',
            startsAt: getFutureDate("2022-08-08"),
            endsAt: getFutureDate("2022-08-17")
        })).rejects.toBeInstanceOf(Error)

        expect(createAppointement.execute({
            customer: 'John Doe',
            startsAt: getFutureDate("2022-08-11"),
            endsAt: getFutureDate("2022-08-12")
        })).rejects.toBeInstanceOf(Error)
    });
});