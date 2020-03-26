USE employeesDB;

INSERT INTO department
    (department_name)
VALUES
    ("HR"),
    ("Software"),
    ("IT"),
    ("Support");

INSERT INTO role
    (title, salary, department_id)
VALUES
    ("Project Manager", 180000, 2),
    ("Team Lead", 150000, 2),
    ("Manager", 140000, 1),
    ("Engineer", 120000, 2),
    ("Intern", 60000, 3),
    ("Staff", 80000, 4);

INSERT INTO employee
    (first_name, last_name, role_id, manager_id, is_manager)
VALUES
    ("Conrad", "Cool", 6, 3, 0),
    ("Kerm", "Bad", 4, 9, 1),
    ("Daniel", "Sharp", 1, 3, 1),
    ("Roman", "Helpful", 2, 4, 1),
    ("Nico", "TheBest", 4, 9, 0),
    ("Patrick", "Comedian", 2, 5, 1),
    ("Will", "Clever", 4, 5, 0),
    ("Mario", "Smith", 5, 4, 0),
    ("Rafael", "Latin", 3, 2, 1);