const mysql = require("mysql");
const inquirer = require("inquirer");

const connection = mysql.createConnection({
    host: "localhost",

    port: 3306,

    user: "root",

    password: "root",
    database: "employeesDB"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    startPrompt();
});

async function startPrompt() {
    const userInput = await inquirer.prompt([
        {
            type: "list",
            name: "viewNext",
            message: "What would you like to do?",
            choices: ["View All Employees", "View All Employees by Department", "View All Employees by Manager", "View All Employees by Role", "End"]
        }
    ]);

    switch (userInput.viewNext) {
        case ("View All Employees"):
            getJoinedTables()
            break;
        case ("View All Employees by Department"):
            getDepartment();
            break;
        case ("View All Employees by Manager"):
            getManager();
            break;
        case ("View All Employees by Role"):
            getRole();
            break;
        case ("End"):
            connection.end();
            break;
    }
};

function getDepartment() {
    connection.query("SELECT department_name FROM department",
        async function (err, res) {
            if (err) throw err;
            console.table(res);
            const departmentArr = [];
            res.forEach((element) => departmentArr.push(element.department_name));
            const whichDepart = await inquirer.prompt([
                {
                    type: "list",
                    name: "department_name",
                    message: "Which Department would you like to see?",
                    choices: departmentArr
                }
            ]);
            getEmployeesByDepartment(whichDepart.department_name);
        });
}

async function getManager() {
    connection.query("SELECT first_name, last_name FROM employee WHERE is_manager",
        async function (err, res) {
            if (err) throw err;
            console.table(res);
            const managerArr = [];
            res.forEach((element) => managerArr.push(element.first_name + " " + element.last_name));
            const whichManager = await inquirer.prompt([
                {
                    type: "list",
                    name: "manager_name",
                    message: "Which Manager's Team would you like to see?",
                    choices: managerArr
                }
            ]);
            const manager = whichManager.manager_name.split(" ");
            connection.query("SELECT id FROM employee WHERE ? AND ?",
                [{ last_name: manager[1] },
                { first_name: manager[0] }],
                function (err, res) {
                    if (err) throw err;
                    getEmployeesByManager(res[0].id);
                });
        });
};

function getRole() {
    connection.query("SELECT title FROM role",
        async function (err, res) {
            if (err) throw err;
            console.table(res);
            const roleArr = [];
            res.forEach((element) => roleArr.push(element.title));
            const whichRole = await inquirer.prompt([
                {
                    type: "list",
                    name: "title",
                    message: "Which Role would you like to see?",
                    choices: roleArr
                }
            ]);
            getEmployeesByRole(whichRole.title);
        });
}

function getJoinedTables() {
    connection.query("SELECT first_name, last_name, title, salary, department_name, employee.id FROM employee INNER JOIN role ON employee.role_id = role.id INNER JOIN department ON role.department_id = department.id",
        function (err, res) {
            if (err) throw err;
            console.table(res);
            updateEmployees(res);
        });
};

function getEmployeesByDepartment(sel) {
    connection.query("SELECT first_name, last_name, title, salary, department_name, employee.id FROM employee INNER JOIN role ON employee.role_id = role.id INNER JOIN department ON role.department_id = department.id WHERE ?", { department_name: sel },
        function (err, res) {
            if (err) throw err;
            console.table(res);
            updateEmployees(res);
        });
};

async function getEmployeesByManager(sel) {
    connection.query("SELECT first_name, last_name, title, department_name, is_manager, employee.id FROM employee INNER JOIN role ON employee.role_id = role.id INNER JOIN department ON role.department_id = department.id WHERE ?", { manager_id: sel },
        function (err, res) {
            if (err) throw err;
            console.table(res);
            updateEmployees(res);
        });
};

function getEmployeesByRole(sel) {
    connection.query("SELECT first_name, last_name, title, department_name, employee.id FROM employee INNER JOIN role ON employee.role_id = role.id INNER JOIN department ON role.department_id = department.id WHERE ?", { title: sel },
        function (err, res) {
            if (err) throw err;
            console.table(res);
            updateEmployees(res);
        });
};

async function updateEmployees(dataRes) {
    const employeeListArr = [];
    const updateEmployee = await inquirer.prompt([
        {
            type: "confirm",
            name: "update",
            message: "Would you like to update an Employee's Role?"
        }
    ]);
    if (updateEmployee.update) {
        dataRes.forEach(element => employeeListArr.push(element.first_name + " " + element.last_name + " id# " + element.id));
        const whichEmployee = await inquirer.prompt([
            {
                type: "list",
                name: "thisEmployee",
                message: "Which Employee's role would you like to update?",
                choices: employeeListArr
            }
        ]);

        const updateID = parseInt(whichEmployee.thisEmployee.split(" ").pop());
        updateEmployeeRole(updateID);
    } else {
        startPrompt();
    }
}

async function updateEmployeeRole(employeeID) {
    connection.query("SELECT title, id FROM role",
        async function (err, res) {
            if (err) throw err;
            console.table(res);
            const roleArr = [];
            res.forEach((element) => roleArr.push(element.title + " role_ID: " + element.id));
            const whichRole = await inquirer.prompt([
                {
                    type: "list",
                    name: "thisRole",
                    message: "Which Role would you like to change it to?",
                    choices: roleArr
                }
            ]);
            const updateRoleID = parseInt(whichRole.thisRole.split(" ").pop());
            connection.query("UPDATE employee SET ? WHERE ?", 
            [{role_id: updateRoleID},
            {id: employeeID}],
            function (err, res) {
                if (err) throw err;
                console.log("Role Updated to: ", whichRole.thisRole);
                startPrompt();
            })
        });
}