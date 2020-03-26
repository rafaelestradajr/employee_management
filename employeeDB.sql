DROP DATABASE IF EXISTS employeesDB;
CREATE database employeesDB;

USE employeesDB;

CREATE TABLE department
(
      id INT NOT NULL
      AUTO_INCREMENT,
  department_name VARCHAR
      (50) NOT NULL,
  PRIMARY KEY
      (id)
);

      CREATE TABLE role
      (
            id INT NOT NULL
            AUTO_INCREMENT,
  title VARCHAR
            (50) NOT NULL,
  salary DECIMAL
            (10,2) NOT NULL,
  department_id INT NOT NULL,
  PRIMARY KEY
            (id)
);

            CREATE TABLE employee
            (
                  id INT NOT NULL
                  AUTO_INCREMENT,
  first_name VARCHAR
                  (60) NULL,
  last_name VARCHAR
                  (60) NULL,
  manager_id INT NULL,
  role_id INT NOT NULL,
  is_manager BOOLEAN DEFAULT FALSE,
  PRIMARY KEY
                  (id)
);