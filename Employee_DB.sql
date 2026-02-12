CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,

    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,

    age INT,
    gender VARCHAR(10),

    role VARCHAR(20) NOT NULL
        CHECK (role IN ('ADMIN','EMPLOYEE')),

    status VARCHAR(20) NOT NULL
        CHECK (status IN ('PENDING','APPROVED','REJECTED')),

    enabled BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE dept (
    dept_id SERIAL PRIMARY KEY,
    dept_name VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE employee (
    emp_id SERIAL PRIMARY KEY,

    user_id INT UNIQUE NOT NULL,
    dept_id INT NOT NULL,

    joining_date DATE DEFAULT CURRENT_DATE,

    CONSTRAINT fk_employee_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_employee_dept
        FOREIGN KEY (dept_id)
        REFERENCES dept(dept_id)
);


CREATE TABLE images (
    image_id BIGSERIAL PRIMARY KEY,

    file_name VARCHAR(255) NOT NULL,
    file_path TEXT NOT NULL,

    user_id INT,
    emp_id INT,

    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_image_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_image_employee	
        FOREIGN KEY (emp_id)
        REFERENCES employee(emp_id)
        ON DELETE CASCADE,

    CONSTRAINT chk_image_owner
        CHECK (
            (user_id IS NOT NULL AND emp_id IS NULL)
            OR
            (user_id IS NULL AND emp_id IS NOT NULL)
        )
);


CREATE TABLE leave_request (
    leave_id SERIAL PRIMARY KEY,

    emp_id INT NOT NULL,

    leave_type VARCHAR(20) NOT NULL
        CHECK (leave_type IN (
            'SICK',
            'CASUAL',
            'EARNED',
            'OPTIONAL',
            'UNPAID'
        )),

    start_date DATE NOT NULL,
    end_date DATE NOT NULL,

    total_days INT NOT NULL,

    paid_days INT NOT NULL DEFAULT 0,
    unpaid_days INT NOT NULL DEFAULT 0,

    reason TEXT,

    status VARCHAR(20) NOT NULL
        CHECK (status IN ('PENDING','APPROVED','REJECTED','REVOKED')),

    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    approved_at TIMESTAMP,
    approved_by INT,

    year INT NOT NULL,

    CONSTRAINT fk_leave_employee
        FOREIGN KEY (emp_id)
        REFERENCES employee(emp_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_leave_admin
        FOREIGN KEY (approved_by)
        REFERENCES users(user_id)
        ON DELETE SET NULL,

    CONSTRAINT chk_leave_dates
        CHECK (end_date >= start_date),

    CONSTRAINT chk_days_match
        CHECK (paid_days + unpaid_days = total_days)
);

CREATE TABLE holiday (
    holiday_id SERIAL PRIMARY KEY,

    holiday_name VARCHAR(100) NOT NULL,

    holiday_date DATE NOT NULL,

    holiday_type VARCHAR(20) NOT NULL
        CHECK (holiday_type IN ('NATIONAL','FESTIVAL','COMPANY')),

    is_optional BOOLEAN DEFAULT FALSE,

    description TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT uq_holiday_date UNIQUE (holiday_date)
);


CREATE TABLE email_log (
    email_id SERIAL PRIMARY KEY,
    user_id INT,
    email_type VARCHAR(50),
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_email_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE SET NULL
);
