import { faker } from '@faker-js/faker';
import { db } from './database';

const dummyCustomer = db.customer.create();

const standardCategory = db.ticketCategory.create({
  description: 'Standard',
  price: 100,
});

const vipCategory = db.ticketCategory.create({
  description: 'Vip',
  price: 200,
});

const makeJsEvent = () => {
  const jsEventType = db.eventType.create({ name: 'Javascript' });

  const jsVenue = db.venue.create({
    location: 'Grand Hotel italia',
    type: 'Hotel',
    capacity: 220,
  });

  const jsEvent = db.event.create({
    eventType: jsEventType,
    venue: jsVenue,
    ticketCategories: [standardCategory, vipCategory],
    name: 'Js heroes',
    startDate: new Date(),
    endDate: new Date(Date.now() + 432_000 * 1000) /* 5 days */,
    img: faker.image.urlPlaceholder({
      backgroundColor: '000000',
      text: 'Js heroes',
      height: 128,
      width: 128,
    }),
  });

  Array.from({ length: 20 }).forEach((_, index) => {
    const ticket = db.ticket.create({
      ticketCategory: faker.helpers.arrayElement([
        standardCategory,
        vipCategory,
      ]),
      event: jsEvent,
      seat: ++index,
    });

    if (index === 1 || index === 2) {
      db.order.create({
        event: jsEvent,
        customer: dummyCustomer,
        tickets: [ticket],
        nrTickets: 1,
        totalPrice: ticket.ticketCategory?.price ?? 0,
      });
    }
  });
};

makeJsEvent();

const makeSportsEvent = () => {
  const sportsEventType = db.eventType.create({ name: 'Sports' });

  const sportsVenue = db.venue.create({
    location: 'Cluj Arena',
    type: 'Arena',
    capacity: 30_200,
  });

  db.event.create({
    eventType: sportsEventType,
    venue: sportsVenue,
    ticketCategories: [standardCategory, vipCategory],
    name: 'Athletism',
    startDate: new Date(),
    endDate: new Date(Date.now() + 432_000 * 1000) /* 5 days */,
    img: faker.image.urlPlaceholder({
      backgroundColor: '000000',
      text: 'Athletism',
      height: 128,
      width: 128,
    }),
  });
};

makeSportsEvent();

const makeRandomEvent = () => {
  const randomEventType = db.eventType.create({ name: faker.lorem.words() });

  const randomVenue = db.venue.create({
    location: faker.company.name(),
    type: faker.helpers.arrayElement(['Arena', 'Hotel', 'Office']),
    capacity: faker.number.int({ min: 20, max: 1_000 }),
  });

  const name = faker.lorem.word();

  db.event.create({
    eventType: randomEventType,
    venue: randomVenue,
    ticketCategories: [standardCategory, vipCategory],
    name,
    startDate: new Date(),
    endDate: new Date(Date.now() + 432_000 * 1000) /* 5 days */,
    img: faker.image.urlPlaceholder({
      backgroundColor: '000000',
      text: name,
      height: 128,
      width: 128,
    }),
  });
};

makeRandomEvent();
