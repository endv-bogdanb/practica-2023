import { kebabCase } from "../utils";

/**
 *
 * @param {import("../mocks/database").Order} order
 * @returns
 */
export const createPurchasedItem = (order) => {
  const purchase = document.createElement("div");

  const title = kebabCase(order.event.name);

  purchase.classList.add(
    "bg-white",
    "px-4",
    "py-3",
    "sm:grid",
    "sm:grid-cols-3",
    "sm:gap-4",
    "sm:items-start",
    "sm:border-b",
    "sm:border-gray-200"
  );

  const purchaseTitle = document.createElement("p");
  purchaseTitle.classList.add(
    "text-lg",
    "font-medium",
    "text-gray-900",
    "sm:col-span-2"
  );
  purchaseTitle.innerText = title;

  purchase.appendChild(purchaseTitle);

  const purchaseQuantity = document.createElement("div");
  purchaseQuantity.classList.add(
    "mt-1",
    "text-sm",
    "text-gray-500",
    "sm:mt-0",
    "sm:col-start-3",
    "sm:text-right"
  );
  purchaseQuantity.innerText = `${order.tickets.length} x`;

  purchase.appendChild(purchaseQuantity);

  const purchaseType = document.createElement("div");
  purchaseType.classList.add(
    "mt-1",
    "text-sm",
    "text-gray-500",
    "sm:col-span-2"
  );
  purchaseType.innerText = `${order.tickets[0].ticketCategory.description}`;

  purchase.appendChild(purchaseType);

  const actions = document.createElement("div");
  actions.classList.add("mt-4", "sm:mt-0", "sm:col-start-3", "sm:text-right");

  const edit = document.createElement("button");
  edit.classList.add(
    "text-sm",
    "font-medium",
    "text-blue-600",
    "underline",
    "hover:text-blue-500"
  );
  edit.innerText = "Edit";
  // Add event listener and functionality for the edit button

  const save = document.createElement("button");
  save.classList.add(
    "ml-2",
    "text-sm",
    "font-medium",
    "text-gray-500",
    "underline",
    "hover:text-gray-400"
  );
  save.innerText = "Save";
  // Add event listener and functionality for the save button

  const deleteEvent = document.createElement("button");
  deleteEvent.classList.add(
    "ml-2",
    "text-sm",
    "font-medium",
    "text-red-600",
    "underline",
    "hover:text-red-500"
  );
  deleteEvent.innerText = "Delete";

  // Add event listener and functionality for the delete button
  deleteEvent.addEventListener("click", () => {
    fetch(`/api/orders/${order.id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => {
      if (res.status === 200) {
        // update UI
      } else {
        // Error message
      }
    });
  });

  actions.appendChild(edit);
  actions.appendChild(save);
  actions.appendChild(deleteEvent);
  purchase.appendChild(actions);

  return purchase;
};
