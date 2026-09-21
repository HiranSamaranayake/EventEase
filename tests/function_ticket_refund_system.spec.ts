import { test, expect } from '@playwright/test';

test.describe('Ticket Refund System & Seat Restoration', () => {

  let testUserId = 9999;

  test.beforeAll(async ({ request }) => {
    const res = await request.get('http://localhost/EventEase/backend/setup_refund_test.php');
    const text = await res.text();
    try {
      const body = JSON.parse(text);
      if (body.user_id) testUserId = body.user_id;
    } catch (e) {
      console.log('setup_refund_test text output:', text);
    }
  });

  test('1. Refund request for upcoming event succeeds, updates status to Refunded, and releases reserved seat A-101', async ({ request }) => {
    // 1. Process Refund for Booking 887 (Upcoming Event 997)
    const refundRes = await request.post('http://localhost/EventEase/backend/api/cancel_booking.php', {
      data: {
        booking_id: 887,
        user_id: testUserId,
        reason: 'Change of plans'
      }
    });

    expect(refundRes.ok()).toBeTruthy();
    const refundData = await refundRes.json();
    expect(refundData.success).toBeTruthy();
    expect(refundData.booking_status).toBe('Cancelled');
    expect(refundData.payment_status).toBe('Refunded');
    expect(refundData.message).toContain('released');

    // 2. Verify Seat A-101 is released and no longer in event_booked_seats map for Event 997
    const seatMapRes = await request.get('http://localhost/EventEase/backend/api/get_event_seat_map.php?event_id=997');
    expect(seatMapRes.ok()).toBeTruthy();
    const seatMapData = await seatMapRes.json();
    const bookedSeats = seatMapData.booked_seats || [];
    expect(bookedSeats).not.toContain('A-101');
  });

  test('2. Another user can immediately purchase the freed seat A-101 after ticket refund', async ({ request }) => {
    const bookRes = await request.post('http://localhost/EventEase/backend/api/create_booking.php', {
      data: {
        user_id: testUserId,
        event_id: 997,
        ticket_quantity: 1,
        selected_seats: [{ seat_code: 'A-101', tier_name: 'Standard', price: 1500 }]
      }
    });

    expect(bookRes.ok()).toBeTruthy();
    const bookData = await bookRes.json();
    expect(bookData.success).toBeTruthy();
    expect(bookData.booking_id).toBeDefined();
    expect(bookData.seats).toContain('A-101');
  });

  test('3. Ticket refund request for past event is strictly rejected by backend API', async ({ request }) => {
    const refundRes = await request.post('http://localhost/EventEase/backend/api/cancel_booking.php', {
      data: {
        booking_id: 886, // Past event 996
        user_id: testUserId,
        reason: 'Event ended'
      }
    });

    expect(refundRes.ok()).toBeTruthy();
    const refundData = await refundRes.json();
    expect(refundData.success).toBeFalsy();
    expect(refundData.message).toContain('Refund Closed');
    expect(refundData.message).toContain('BEFORE the event date');
  });

});
