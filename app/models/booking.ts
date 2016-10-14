import {Domain} from  './domain';

export interface Booking {
    id: string,
    date: number,
    taskName: string,
    tenant: string,
    duration: number,
    durationType: number,
    category: Domain
    actvity: string,
    booked: boolean,
    task: string,
    number: number
}

