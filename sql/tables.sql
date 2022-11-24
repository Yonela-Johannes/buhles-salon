-- Table create scripts here

CREATE TABLE IF NOT EXISTS client(
    ID SERIAL PRIMARY KEY,
    first_name VARCHAR(45) NOT NULL,
    last_name VARCHAR(45) NOT NULL,
    phone_number VARCHAR(45) NOT NULL
);

CREATE TABLE IF NOT EXISTS treatment(
    ID SERIAL PRIMARY KEY,
    type VARCHAR(45) NOT NULL,
    code VARCHAR(3) NOT NULL,
    price INT NOT NULL
);

CREATE TABLE IF NOT EXISTS stylist(
    ID SERIAL PRIMARY KEY,
    first_name VARCHAR(45) NOT NULL,
    last_name VARCHAR(45) NOT NULL,
    phone_number VARCHAR(45) NOT NULL,
    commission_percentage VARCHAR(5) NOT NULL
);

CREATE TABLE IF NOT EXISTS bookings(
    ID SERIAL PRIMARY KEY,
    booking_date DATE NOT NULL,
    booking_time TIME NOT NULL,
    client_id INT,
    treatment_id INT,
    stylist_id INT,
    FOREIGN KEY (client_id) REFERENCES client(ID) ON DELETE CASCADE,
    FOREIGN KEY (treatment_id) REFERENCES treatment(ID) ON DELETE CASCADE,
    FOREIGN KEY (stylist_id) REFERENCES stylist(ID) ON DELETE CASCADE
);