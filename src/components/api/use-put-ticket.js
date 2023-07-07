export function usePutTicket(orderId, newType, newQuantity) {
    return fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            orderId: orderId,
            ticketCategoryId: newType,
            quantity: +newQuantity,
        }),
    }).then((res) => {
        if (res.status === 200) {
            toastr.success('Success!');
        } else {
            // Error message
            toastr.error('Error!');
        }
        return res;
    });
}
