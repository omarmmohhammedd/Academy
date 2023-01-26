create table parents (
    parent_id bigserial NOT NULL primary key,
    username varchar(255) NOT NULL,
    password varchar(255) NOT NULL,
    phone varchar(20) NOT NULL,
    gender varchar(255) NOT NULL,
    email varchar(255)  NOT NULL,
    role integer
);


 create table students (
    student_id  bigserial NOT NULL primary key,
    username varchar(255) NOT NULL,
    password varchar(255) NOT NULL,
    phone varchar(20) NOT NULL,
    gender varchar(255) NOT NULL,
    email varchar(255)  NOT NULL,
    academic_year integer ,
    academic_department varchar(255),
    role integer,
    courses JSON ARRAY,
    parent_id BIGINT REFERENCES parents (parent_id) ON DELETE CASCADE
);


create table courses(
    course_id bigserial NOT NULL primary key ,
    course_name varchar(255) NOT NULL ,
    course_department varchar(255) NOT NULL,
    course_price integer NOT NULL,
    course_time integer NOT NULL,
    course_visible BOOLEAN TRUE,
    course_start_Date DATE DEFAULT CURRENT_DATE,
    course_end_Date DATE,
    course_img BYTEA,
    course_description varchar(255),
    course_content integer ARRAY,
    course_rate float,
    course_seat integer,
    teachers_id  BIGINT REFERENCES teachers (teacher_id) ON DELETE CASCADE 
);





create table attendances (
    student_id BIGINT REFERENCES students (student_id) ON DELETE CASCADE,
    course_id BIGINT REFERENCES courses (course_id) ON DELETE CASCADE,
    present BOOLEAN,
    date DATE  DEFAULT CURRENT_DATE,
    time TIME  DEFAULT CURRENT_TIMESTAMP
);


create table Admin (
    admin_id bigserial NOT NULL primary key ,
    username varchar(255) NOT NULL,
    password varchar(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email varchar(255)  NOT NULL,
    role integer DEFAULT 4000
);


