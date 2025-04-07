CREATE TABLE users (
    user_id UUID PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
CREATE TABLE posts (
                        post_id UUID PRIMARY KEY,
                       author VARCHAR(255) NOT NULL,
                       date_time_modified TIMESTAMP DEFAULT NOW(),
                       description TEXT,
                       likes INTEGER,
                       shares INTEGER
);

ALTER TABLE posts
    ADD COLUMN comments TEXT;
ALTER TABLE posts
    ADD COLUMN maps_coordinates varchar(255),
ADD COLUMN media varchar(255),
ADD COLUMN ending_date timestamp ;
ALTER TABLE posts
    ADD COLUMN post_type varchar(255);
    create table polls(
poll_id uuid,
option_id uuid,
"option" text
);

create table "options"(
option_id uuid,
votes integer
);