<?php

return [
    /*
    |--------------------------------------------------------------------------
    | SMTP Mailer Configuration
    |--------------------------------------------------------------------------
    | Safe configuration settings for PHPMailer / SMTP automated email delivery.
    | Can be overridden dynamically by system_settings in the database.
    */
    'smtp_host'       => 'smtp.gmail.com',
    'smtp_port'       => 587,
    'smtp_user'       => 'tickets@eventease.com',
    'smtp_pass'       => 'secret_app_password',
    'smtp_from_email' => 'noreply@eventease.com',
    'smtp_from_name'  => 'EventEase Ticketing System'
];
