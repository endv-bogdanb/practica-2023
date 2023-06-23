import { factory, manyOf, oneOf, primaryKey } from "@mswjs/data";
import {faker} from '@faker-js/faker'

/**
 * @typedef {Object} TicketEvent
 * @property {number} id
 * @property {TicketEventType} eventType
 * @property {Venue} venue
 * @property {TicketCategory} ticketCategory
 * @property {string} description
 * @property {string} name
 * @property {Date} startDate
 * @property {Date} endDate
 * @property {string} img
 */

/**
 * @typedef {Object} TicketEventType
 * @property {number} id
 * @property {string} name
 */

/**
 * @typedef {Object} Venue
 * @property {number} id
 * @property {string} location
 * @property {string} type
 * @property {number} capacity
 */

/**
 * @typedef {Object} Order
 * @property {number} id
 * @property {TicketEvent} event
 * @property {Customer} customer
 * @property {Ticket[]} tickets
 * @property {number} nrTickets
 * @property {number} totalPrice
 */

/**
 * @typedef {Object} Ticket
 * @property {number} id
 * @property {TicketCategory} ticketCategory
 * @property {TicketEvent} event
 * @property {string} serialNr
 * @property {number} seat
 */

/**
 * @typedef {Object} TicketCategory
 * @property {number} id
 * @property {string} description
 * @property {number} price
 */

/**
 * @typedef {Object} Customer
 * @property {number} id
 * @property {string} name
 * @property {string} email
 * @property {string} password
 */

function makeAutoIcrement() {
  let id = 0;
  return () => ++id;
}

export const db = factory({
  event: {
    id: primaryKey(makeAutoIcrement()),
    eventType: oneOf("eventType", { nullable: false, unique: false }),
    venue: oneOf("venue", { nullable: false, unique: false }),
    ticketCategory: manyOf("ticketCategory", {
      nullable: false,
      unique: false,
    }),
    description: String,
    name: String,
    img: () =>
      faker.image.urlPlaceholder({
        backgroundColor: "000000",
        text: faker.lorem.word(),
        height: 128,
        width: 128,
      }),
    startDate: () => new Date(),
    endDate: () => new Date(),
  },
  eventType: {
    id: primaryKey(makeAutoIcrement()),
    name: String,
  },
  venue: {
    id: primaryKey(makeAutoIcrement()),
    location: String,
    type: String,
    capacity: Number,
  },
  order: {
    id: primaryKey(makeAutoIcrement()),
    event: oneOf("event", { nullable: false, unique: false }),
    customer: oneOf("customer", { nullable: false, unique: false }),
    tickets: manyOf("ticket", { nullable: false, unique: true }),
    orderDate: () => new Date(),
    nrTickets: Number,
    totalPrice: Number,
  },
  customer: {
    id: primaryKey(makeAutoIcrement()),
    name: () => "Dummy user",
    email: () => "example@example.com",
    password: () => "seCur3 P@assW!@#",
  },
  ticket: {
    id: primaryKey(makeAutoIcrement()),
    ticketCategory: oneOf("ticketCategory", { nullable: false, unique: false }),
    event: oneOf("event", { nullable: false, unique: false }),
    serialNr: () => window.crypto.randomUUID(),
    seat: Number,
  },
  ticketCategory: {
    id: primaryKey(makeAutoIcrement()),
    description: String,
    price: Number,
  },
});

function migrations() {
  const sportsEventType = db.eventType.create({ name: "Sports" });
  const jsEventType = db.eventType.create({ name: "Javascript" });

  const sportsVenue = db.venue.create({
    location: "Cluj Arena",
    type: "Arena",
    capacity: 30_200,
  });
  const jsVenue = db.venue.create({
    location: "Grand Hotel italia",
    type: "Hotel",
    capacity: 220,
  });

  const standardCategory = db.ticketCategory.create({
    description: "Standard",
    price: 100,
  });

  const vipCategory = db.ticketCategory.create({
    description: "Vip",
    price: 200,
  });

  const dummyCustomer = db.customer.create();

  /**
   * js event
   */
  const jsEvent = db.event.create({
    eventType: jsEventType,
    venue: jsVenue,
    ticketCategory: [standardCategory, vipCategory],
    description: "Lorem ipsum dolore",
    name: "Js heroes",
    startDate: new Date(),
    endDate: new Date(Date.now() + 432_000 * 1000) /* 5 days */,
  });

  /**
   * sports event
   */
  db.event.create({
    eventType: sportsEventType,
    venue: sportsVenue,
    ticketCategory: [standardCategory, vipCategory],
    description: "Lorem ipsum dolore",
    name: "Athletism",
    startDate: new Date(),
    endDate: new Date(Date.now() + 432_000 * 1000) /* 5 days */,
  });

  const ticket = db.ticket.create({
    ticketCategory: standardCategory,
    event: jsEvent,
    seat: 1,
  });

  db.order.create({
    event: jsEvent,
    customer: dummyCustomer,
    tickets: [ticket],
    nrTickets: 1,
    totalPrice: ticket.ticketCategory?.price ?? 0,
  });
}

migrations();

// console.log(
//   JSON.stringify(
//     {
//       events: db.event.findMany({}),
//     //   orders: db.order.findMany({}),
//     //   tickets: db.ticket.findMany({}),
//     },
//     null,
//     2
//   )
// );
