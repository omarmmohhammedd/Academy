create table IF NOT EXISTS courses(
course_id bigserial NOT NULL primary key ,
course_name varchar(255) NOT NULL,
course_teachers_id  integer ARRAY,
course_content integer ARRAY,
course_time integer NOT NULL,
course_department varchar(255) NOT NULL,
price integer NOT NULL
); 

create table users (
user_id bigserial NOT NULL primary key ,
username varchar(255) NOT NULL,
password varchar(255) NOT NULL,
phone integer NOT NULL,
gender varchar(255) NOT NULL,
role integer,
email varchar(255)  NOT NULL
);

create table teachers (
    teacher_id BIGINT REFERENCES users (user_id),
    department varchar(255) NOT NULL,
    courses integer ARRAY,
    rate float 
);


create table students (
    student_id BIGINT REFERENCES users (user_id),
    academic_year integer NOT NULL,
    academic_department varchar(255) NOT NULL,
    payment float,
   courses integer ARRAY
);

create table parents (
    parent_id BIGINT REFERENCES users (user_id),
)