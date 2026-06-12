<?php

require_once __DIR__ . '/../models/Event.php';

class EventController
{
    private $event;

    public function __construct($db)
    {
        $this->event = new Event($db);
    }

    public function createEvent(
        $organizer_id,
        $title,
        $description,
        $event_date,
        $location,
        $capacity
    )
    {
        return $this->event->createEvent(
            $organizer_id,
            $title,
            $description,
            $event_date,
            $location,
            $capacity
        );
    }
}