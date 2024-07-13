export async function fetchUsers() {
    const res = await fetch(`http://localhost/api/users`, {
        method: 'GET',
    });

    if (!res.ok) {
        throw new Error('Failed to fetch users');
    }
    return res.json();
}

export async function fetchTickets() {
    const res = await fetch(`http://localhost/api/tickets`, {
        method: 'GET',
    });

    if (!res.ok) {
        throw new Error('Failed to fetch tickets');
    }

    return res.json();
}