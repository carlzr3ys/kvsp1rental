import React, { useState } from 'react';
import { db } from '../firebase'; // Import firebase configuration

const CancelReservationPage = () => {
    const [reservationId, setReservationId] = useState('');
    const [cancelMessage, setCancelMessage] = useState('');

    const handleCancelReservation = async () => {
        try {
            // 1. Query your database to find the reservation with this ID
            const reservationRef = db.collection('reservations').doc(reservationId);
            const reservationSnapshot = await reservationRef.get();

            // 2. Check if reservation exists
            if (!reservationSnapshot.exists) {
                throw new Error('Reservation not found.');
            }

            // 3. Update the reservation status to "cancelled"
            await reservationRef.update({
                status: 'cancelled'
            });

            // 4. Optionally, you can send a confirmation message to the user
            // For example, you can set the cancelMessage state accordingly
            setCancelMessage('Reservation has been cancelled successfully.');

        } catch (error) {
            // Handle errors
            console.error('Error cancelling reservation:', error.message);
            setCancelMessage('Failed to cancel reservation. Please try again.');
        }
    };

    return (
        <div>
            <h1>Cancel Reservation</h1>
            <input
                type="text"
                placeholder="Enter Reservation ID"
                value={reservationId}
                onChange={(e) => setReservationId(e.target.value)}
            />
            <button onClick={handleCancelReservation}>Cancel Reservation</button>
            {cancelMessage && <p>{cancelMessage}</p>}
        </div>
    );
};

export default CancelReservationPage;
