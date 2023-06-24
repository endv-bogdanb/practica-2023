import { rest, setupWorker } from "msw";
import { db } from "./database";
import "./migrations";

const handlers = [
  rest.get("/api/ticketEvents", (req, res, ctx) => {
    const name = req.url.searchParams.get("name") ?? "";
    const description = req.url.searchParams.get("description") ?? "";

    return res(
      ctx.status(200),
      ctx.delay(),
      ctx.json(
        db.event.findMany({
          where: {
            name: {
              contains: name,
            },
            description: {
              contains: description,
            },
          },
        })
      )
    );
  }),
  rest.get("/api/orders", (req, res, ctx) => {
    return res(ctx.status(200), ctx.delay(), ctx.json(db.order.findMany({})));
  }),
  rest.post("/api/purchase", async (req, res, ctx) => {
    try {
      const { eventId, ticketType, quantity } = await req.json();

      const takenTicketIds = db.order
        .findMany({ where: { event: { id: { equals: eventId } } } })
        .map((order) => {
          return order.tickets.map((ticket) => ticket.id);
        })
        .flat();

      const tickets = db.ticket.findMany({
        where: {
          id: { notIn: takenTicketIds },
          event: { id: { equals: eventId } },
          ticketCategory: { id: { equals: ticketType } },
        },
        take: quantity,
      });

      if (tickets.length < quantity) {
        return res(
          ctx.status(400),
          ctx.delay(),
          ctx.json({ message: "Quantity is to large" })
        );
      }

      const order = db.order.create({
        event: db.event.findFirst({
          where: { id: { equals: eventId } },
          strict: true,
        }),
        customer: db.customer.findFirst({}),
        tickets,
        nrTickets: quantity,
        totalPrice: tickets.reduce(
          (acc, ticket) => acc + ticket.ticketCategory.price,
          0
        ),
      });

      return res(ctx.status(200), ctx.delay(), ctx.json(order));
    } catch {
      return res(
        ctx.status(400),
        ctx.delay(),
        ctx.json({
          message: "Event not found",
        })
      );
    }
  }),
  rest.get("*", (req) => {
    return req.passthrough();
  }),
];

const worker = setupWorker(...handlers);

worker.start();
