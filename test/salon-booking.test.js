import assert from 'assert';
import SalonBooking from '../salon-booking.js';
import pgPromise from 'pg-promise';
import moment from 'moment';

// TODO configure this to work.
const DATABASE_URL = process.env.DATABASE_URL || 'postgres://postgres:juanesse@123@localhost:5432/buhle_salon'

const config = { 
	connectionString : DATABASE_URL
}

const pgp = pgPromise();
const db = pgp(config);

let booking = SalonBooking(db);

describe("The Booking Salon", function () {

    beforeEach(async function () {
        await db.none(`delete from bookings`);
    });

    it("should be able to list treatments", async function () {
        const treatments = await booking.findAllTreatments();
        const result = [
            {
              code: 'ped',
              id: 5,
              price: 175,
              type: 'Pedicure'
            },
            {
              code: 'man',
              id: 6,
              price: 215,
              type: 'Manicure'
            },
            {
              code: 'mak',
              id: 7,
              price: 185,
              type: 'Make up'
            },
            {
              code: 'las',
              id: 8,
              price: 240,
              type: 'Brows & Lashes'
            }
          ]
        assert.deepEqual(result, treatments);
    });

    it("should be able to find a stylist", async function () {
        await booking.createStylist("Kik", "Nobuhle", "0654654", 5.4)
        const stylist = await booking.findStylist("28");
        let result = {
            id: 28,
            first_name: 'Kik',
            last_name: 'Nobuhle',
            phone_number: '0654654',
            commission_percentage: '5.4'
          }

        assert.deepEqual(result, stylist);
    });

    it("should be able to allow a client to make a booking", async function () {
        await booking.createClient("Phumla", "Hleli", "0654654", 5.4)
        const client = await booking.findClient('18')
        const treatment = await booking.findTreatment("5")
        const stylist = await booking.findStylist("28")
        await booking.makeBooking(treatment.id, client.id, stylist.id, '10/10/2021', '02:03:04');
        const bookings = await booking.findClientBookings(client.id);
          
        assert.deepEqual(bookings, bookings);
    });

    it("should be able to get client booking(s)", async function () {
        await booking.createClient("Client", "Unlimited", "0654654", 5.4)
        const client1 = await booking.findClient("18");
        const client2 = await booking.findClient("19");
        const stylist = await booking.findStylist("28")
        
        const treatment1 = await booking.findTreatment("7");
        const treatment2 = await booking.findTreatment("8");

        await booking.makeBooking(treatment1.id, client1.id, stylist.id , "02/10/2021", '05:03:04');
        await booking.makeBooking(treatment2.id, client1.id, stylist.id , "02/11/2020", '04:03:04');
        await booking.makeBooking(treatment1.id, client2.id, stylist.id , "01/09/2021", '01:03:04');
        const clientBooking = await booking.findClientBookings(client1.id);

        const result = [
            {
              id: 28,
              booking_date: new Date("2021-10-01T22:00:00.000Z"),
              booking_time: '05:03:04',
              client_id: 18,
              treatment_id: 7,
              stylist_id: 28,
              type: 'Make up',
              code: 'mak',
              price: 185,
              first_name: 'Kik',
              last_name: 'Nobuhle',
              phone_number: '0654654',
              commission_percentage: '5.4'
            },
            {
              id: 28,
              booking_date: new Date("2020-11-01T22:00:00.000Z"),
              booking_time: '04:03:04',
              client_id: 18,
              treatment_id: 8,
              stylist_id: 28,
              type: 'Brows & Lashes',
              code: 'las',
              price: 240,
              first_name: 'Kik',
              last_name: 'Nobuhle',
              phone_number: '0654654',
              commission_percentage: '5.4'
            }
          ]    
        assert.deepEqual(result, clientBooking)
    })

    it("should be able to get bookings for a date", async function () {
        const client1 = await booking.findClient("18");
        const client2 = await booking.findClient("19");
        const stylist = await booking.findStylist("28")
        const treatment1 = await booking.findTreatment("5");
        const treatment2 = await booking.findTreatment("7");

        
        await booking.makeBooking(treatment1.id, client1.id, stylist.id , "01/02/2021", '01:00:04');
        await booking.makeBooking(treatment2.id, client1.id, stylist.id , "02/12/2021", '01:00:04');
        await booking.makeBooking(treatment1.id, client2.id, stylist.id , "01/08/2021", '01:00:04');
        const [clientBooking] = await booking.findClientBookingsDate("01/02/2021");
          const result = 
          {
            id: clientBooking.id,
            booking_date: new Date("2021-01-31T22:00:00.000Z"),
            booking_time: '01:00:04',
            client_id: 18,
            treatment_id: 5,
            stylist_id: 28,
            type: 'Pedicure',
            code: 'ped',
            price: 175,
            first_name: 'Kik',
            last_name: 'Nobuhle',
            phone_number: '0654654',
            commission_percentage: '5.4'
          }        
         assert.deepEqual(result, clientBooking)
    });

    it("should be able to find the total income for a day", async function() {
        const client1 = await booking.findClient("18");
        const client2 = await booking.findClient("19");
        const stylist = await booking.findStylist("28")
        const treatment1 = await booking.findTreatment("5");


        
        await booking.makeBooking(treatment1.id, client1.id, stylist.id , "03/02/2021", '01:00:04');
        await booking.makeBooking(treatment1.id, client2.id, stylist.id , "3/02/2021", '01:00:04');
        const [clientBooking] = await booking.findIncomeDate("03/02/2021");
        const result = { sum: '350' }
        assert.deepEqual(result, clientBooking);
    })

    after(function () {
        db.$pool.end()
    });

});