const mysql = require('mysql');
const cTable = require('console.table');
const inquirer = require('inquirer');
const Employee = require('./employee.js');

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'myPassword123',
    database: 'company_db'
});

connection.connect(function(err){
    if(err) throw err;
    console.log(`connected to id ${connection.threadId}`);
    // testConnection();
    startProgram();
});

//This function starts the program
function startProgram(){
    inquirer.prompt({
        name: 'actionSelected',
        type: 'list',
        message: 'What would you like to do?',
        choices: ['View all employees info', 'View all employees by department', 'View employees by Id', 'Add employee', 'Remove employee', 'Finish Program']
    }).then(function(answer){
        switch(answer.actionSelected){
            case 'View all employees info':
                viewAllEmployees();
            break;
            case 'View all employees by department':
                viewByDept();
            break;
            case 'View employees by Id':
                viewById();
            break;
            case 'Add employee':
                addEmployee();
            break;
            case 'Remove employee':
                removeEmployee();
            break;
            default:
                connection.end();
        };
    })
};

//This function shows all employes, their role, salary and dept.
function viewAllEmployees(){
    const queryStatement = "SELECT first_name, last_name, title, salary, department_name FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id";
    connection.query(queryStatement, function(err, res){
        if(err) throw err;
        console.table(res);
        startProgram();
    })
} 

// const viewByDept = () =>{
//     const queryStatement = "SELECT first_name, last_name, department_name FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id";
//     connection.query(queryStatement, function(err, res){
//         if(err) throw err;
//         console.table(res);
//         startProgram();
//     })
// };

const viewByDept = () =>{
    connection.query("SELECT department_name FROM department", function(err, result){
        if(err) throw err;
        const departments = [];
        for(let i =0; i < result.length; i++){
            departments.push(result[i].department_name);
        };
    inquirer.prompt({
        name: 'deptSelected',
        type: 'list',
        message: 'Which department do you want?',
        choices: departments
    }).then(function(answer){
        const queryStatement = "SELECT first_name, last_name, title, salary, department_name FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id WHERE department_name = ? ";           
        connection.query(queryStatement, answer.deptSelected, function(err, res){
            if(err) throw err;
            console.table(res);
            startProgram();
        })
    })
    })
};

const viewById = () =>{
    connection.query("SELECT id, first_name, last_name FROM employee", function(err, res){
        if(err) throw err;
        console.table(res);
        startProgram();
    });
};

const addEmployee = () => {
    inquirer.prompt([
        {
            name: 'firstName',
            type: 'input',
            message: "What's the first name of the employee"
        },
        {
            name: 'lastName',
            type: 'input',
            message: "What's the last name of the employee"
        },
        {
            name: 'employeeRole',
            type: 'number',
            message: "What's the role ID of the employee?"
        },
        {
            name: 'employeeManager',
            type: 'number',
            message: "What's the manager ID of the employee?"
        }
    ]).then(function(answer){
        const newEmployee = new Employee(answer.firstName, answer.lastName, answer.employeeRole, answer.employeeManager);
        const queryStatement = "INSERT INTO employee SET ?";
        connection.query(queryStatement, newEmployee, function(err){
            if(err) throw err;
            console.log(`New employee added: ${newEmployee.first_name} ${newEmployee.last_name}`);
            startProgram();
        });  
    });
};

const removeEmployee = () =>{
    inquirer.prompt([{
        name: 'employeeId',
        type: 'number',
        message: "What's the id of the employee you want to remove?"
    }]).then(function(answer){
        const queryStatement = "DELETE FROM employee WHERE id = ?";
        connection.query(queryStatement, answer.employeeId, function(err){
            if(err) throw err;
            console.log(`Employee with id = ${answer.employeeId} deleted!`);
            startProgram();
        })
    })

}
