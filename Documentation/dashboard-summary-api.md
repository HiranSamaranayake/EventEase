# Dashboard Summary API

Method:
GET

URL:
/backend/api/dashboard_summary.php?organizer_id={id}

Required Parameter:
- organizer_id

Purpose:
Returns all organizer dashboard statistics in a single response.

Example Response:

{
    "total_events": 5,
    "total_bookings": 42,
    "upcoming_events": 3
}