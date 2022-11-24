export default function salonBooking(db) {

    const findAllTreatments = async () => {
        return await db.manyOrNone(`select * from treatment`);
    }

    const findTreatment = async (id) => {
        return await db.oneOrNone(`select * from treatment where id = $1`, [id]);
    }
    
    const createStylist = async (first_name, last_name, phone_number, commission_percentage) => {
        let exist = await db.oneOrNone(`select * from stylist where first_name = $1;`, [first_name])
        if(!exist){
            await db.oneOrNone("insert into stylist (first_name, last_name, phone_number, commission_percentage) values ($1, $2, $3, $4);", [first_name, last_name, phone_number, commission_percentage]);
        }else{
            return {}
        }
    }

    const findStylist = async (id) => {
        return await db.oneOrNone(`select * from stylist where id = $1`, [id]);
    }

    const createClient = async (first_name, last_name, phone_number) => {
        let exist = await db.oneOrNone(`select * from client where first_name = $1;`, [first_name])
        if(!exist){
            await db.oneOrNone("insert into client (first_name, last_name, phone_number) values ($1, $2, $3);", [first_name, last_name, phone_number]);
        }else{
            return exist
        }
    }

    const findClient = async (id) => {
        return await db.oneOrNone(`select * from client where id = $1`, [id]);
    }

    const makeBooking = async (treatment_id, client_id, stylist_id, booking_date, booking_time) => {
        await db.oneOrNone("insert into bookings (treatment_id, client_id, stylist_id, booking_date, booking_time) values ($1, $2, $3, $4, $5);", [treatment_id, client_id, stylist_id, booking_date, booking_time]);
    }
    const findClientBookings = async (id) => {
        return await db.manyOrNone(`select * from bookings as b join treatment as t on b.treatment_id = t.id  join stylist as s on b.stylist_id = stylist_id where client_id = $1`, [id]);
    }
    const findClientBookingsDate = async (date) => {
        return await db.manyOrNone(`select * from bookings as b join treatment as t on b.treatment_id = t.id  join stylist as s on b.stylist_id = stylist_id where booking_date = $1`, [date]);
    }
    const findIncomeDate = async (date) => {
        return await db.manyOrNone(`select sum(price) from bookings as b join treatment as t on b.treatment_id = t.id  join stylist as s on b.stylist_id = stylist_id where booking_date = $1 group by price`, [date]);
    }

    const findCommission = async (id) => {
        return await db.manyOrNone(`select * from bookings as b join stylist as s on b.stylist_id = stylist_id where stylist_id = $1`, [id]);
    } 
    return {
        findTreatment,
        findAllTreatments,
        findStylist,
        findClient,
        createStylist,
        createClient,
        makeBooking,
        findClientBookings,
        findClientBookingsDate,
        findIncomeDate,
        findCommission
    }
}  