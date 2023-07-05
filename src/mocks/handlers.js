import { rest, setupWorker } from 'msw';
import { db } from './database';
import './migrations';

const handlers = [
    rest.get('/api/ticketCategory', (req, res, ctx) => {
        return res(
            ctx.status(200),
            ctx.delay(),
            ctx.json(db.ticketCategory.findMany({}))
        );
    }),
    rest.get('/api/ticketEvents', (req, res, ctx) => {
        const name = req.url.searchParams.get('name') ?? '';
        const description = req.url.searchParams.get('description') ?? '';

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
    rest.get('/api/orders', (req, res, ctx) => {
        return res(
            ctx.status(200),
            ctx.delay(),
            ctx.json(db.order.findMany({}))
        );
    }),

    rest.delete('/api/orders/:id', (req, res, ctx) => {
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

    rest.put('/api/orders/:id', async (req, res, ctx) => {
        const { orderId, ticketCategoryId, quantity } = await req.json();

        let order = db.order.findFirst({
            where: {
                id: {
                    equals: +orderId,
                },
            },
        });

        let ticketCategory = db.ticketCategory.findFirst({
            where: {
                id: {
                    equals: +ticketCategoryId,
                },
            },
        });

        let event = db.event.findFirst({
            where: {
                id: {
                    equals: +order.event.id,
                },
            },
        });

        let newObject = { ...order };

        if (order.nrTickets > quantity) {
            newObject.tickets.splice(0, order.nrTickets - quantity);
            newObject.nrTickets = quantity;
        } else {
            for (let index = 0; index < quantity - order.nrTickets; index++) {
                const ticket = db.ticket.create({
                    ticketCategory: ticketCategory,
                    event: event,
                    seat: 10,
                });

                newObject.tickets.push(ticket);
            }
            newObject.nrTickets = quantity;
        }

        const updatedTickets = newObject.tickets.map((el) => {
            let newElement = { ...el };
            newElement.ticketCategory = ticketCategory;
            return newElement;
        });

        newObject.tickets = [...updatedTickets];

        console.log('newObject', newObject);

        const updateOrder = db.order.update({
            where: {
                id: {
                    equals: +orderId,
                },
            },
            data: { ...newObject },
        });
        console.log('updateOrder', updateOrder);
        return updateOrder ? res(ctx.status(200)) : res(ctx.status(500));
    }),

    rest.post('/api/purchase', async (req, res, ctx) => {
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
                    ctx.json({ message: 'Quantity is to large' })
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
                    message: 'Event not found',
                })
            );
        }
    }),
    rest.get('*', (req) => {
        return req.passthrough();
    }),
];

const worker = setupWorker(...handlers);

worker.start();
