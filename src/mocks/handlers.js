import { rest, setupWorker } from "msw";
import { db } from "./database";
import "./migrations";

const handlers = [
  rest.get("/api/ticketCategory", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.delay(),
      ctx.json(db.ticketCategory.findMany({}))
    );
  }),
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

  rest.delete("/api/orders/:id", (req, res, ctx) => {
    const { id } = req.params;
    const deletedOrder = db.order.delete({
      where: {
        id: {
          equals: Number(id),
        },
      },
    });
    return res(
      deletedOrder ? ctx.json(deletedOrder.id) : ctx.status(500),
      ctx.delay()
    );
  }),

  rest.put("/api/orders/:id", async (req, res, ctx) => {
    try {
      const { orderId, ticketCategoryId, quantity } = await req.json();

      const ticketCategory = db.ticketCategory.findFirst({
        where: { id: { equals: +ticketCategoryId } },
      });

      const orderTicketIds = db.order
        .findFirst({ where: { id: { equals: +orderId } }, strict: true })
        .tickets.map(({ id }) => id);

      // NOTE: update order tickets to new category
      db.ticket.updateMany({
        where: { id: { in: orderTicketIds } },
        data: { ticketCategory },
      });

      const order = db.order.update({
        where: {
          id: {
            equals: +orderId,
          },
        },
        data: {
          tickets: (tickets, order) => {
            if (tickets.length > quantity) {
              return tickets.splice(0, quantity);
            }
            return tickets.concat(
              Array.from({ length: quantity - tickets.length }).map(() =>
                db.ticket.create({
                  event: order.event,
                  ticketCategory,
                  // NOTE: ???
                  seat: 10,
                })
              )
            );
          },
        },
        strict: true,
      });

      console.log(order);

      return res(ctx.status(200), ctx.json({}));
    } catch (e) {
      console.log("FAIL ", e);
      return res(ctx.status(500), ctx.json({}));
    }
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
