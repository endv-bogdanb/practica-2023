import { setupWorker, rest } from "msw";
import { factory, primaryKey } from "@mswjs/data";
import { faker } from "@faker-js/faker";
import "./database"

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
db.ticketEvent.create({
  title: "Event-3",
  description: faker.lorem.sentence(),
});
let purchasedEvents = [];

const handlers = [
  rest.get("/api/ticketEvents", (req, res, ctx) => {
    const title = req.url.searchParams.get("title") ?? "";
    const description = req.url.searchParams.get("description") ?? "";

    return res(
      ctx.status(200),
      ctx.delay(),
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
  rest.post("/api/purchasedEvents", async (req, res, ctx) => {
    const { ticketType, title, quantity } = await req.json();
    const purchasedEvent = {
      ticketType,
      title,
      quantity,
    };

    purchasedEvents.push(purchasedEvent);

    return res(ctx.status(200), ctx.delay(), ctx.json(purchasedEvent));
  }),
  rest.get("*", (req) => {
    return req.passthrough();
  }),
];

const worker = setupWorker(...handlers);

worker.start();
