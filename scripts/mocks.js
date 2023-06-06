import { factory, primaryKey } from "https://cdn.skypack.dev/@mswjs/data";
import { faker } from "https://cdn.skypack.dev/@faker-js/faker";

/**
 * @typedef {Object} TicketEvent
 * @property {string} id
 * @property {string} title
 * @property {string} description
 * @property {string} img
 */

const db = factory({
  ticketEvent: {
    id: primaryKey(faker.string.uuid),
    title: String,
    description: String,
    img: () =>
      faker.image.urlPlaceholder({
        backgroundColor: "000000",
        text: faker.lorem.word(),
        height: 128,
        width: 128,
      }),
  },
});

db.ticketEvent.create({
  title: "Event-1",
  description: faker.lorem.sentence(),
});

db.ticketEvent.create({
  title: "Event-2",
  description: faker.lorem.sentence(),
});

const handlers = [
  MockServiceWorker.rest.get("/api/ticketEvents", (req, res, ctx) => {
    const title = req.url.searchParams.get("title") ?? "";
    const description = req.url.searchParams.get("description") ?? "";

    return res(
      ctx.status(200),
      ctx.json(
        db.ticketEvent.findMany({
          where: {
            title: {
              contains: title,
            },
            description: {
              contains: description,
            },
          },
        })
      )
    );
  }),
  MockServiceWorker.rest.get("*", (req) => {
    return req.passthrough();
  }),
];

const worker = MockServiceWorker.setupWorker(...handlers);

worker.start();
