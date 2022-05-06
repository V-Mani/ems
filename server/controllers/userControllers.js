const mysql = require('mysql');

//connection pool
const pool= mysql.createPool({
    connectionLimit : 100,
    host : process.env.DB_HOST,
    user : process.env.DB_USER,
    password : process.env.DB_PASS,
    database : process.env.DB_NAME,
    port : process.env.DB_PORT
});

//view user
exports.view = (req, res) => {
    pool.getConnection((err,Connection) =>{
        if(err) throw err; //not connected!
        console.log('connected as ID' + Connection.threadId);
        //user the connection
        Connection.query('SELECT * FROM g_user WHERE u_status = "active"',(err,rows)=>{
            //when done with connecion, release it
            Connection.release();
            if(!err){
                let removeduser = req.query.removed;
                res.render('home',{rows, removeduser});
            }else{
                console.log(err);
            }
            console.log('the data from the user table : \n', rows);
        });
    });
}

//find user by search bar
exports.find = (req, res) => {
    pool.getConnection((err,Connection) =>{
        if(err) throw err; //not connected!
        console.log('connected as ID' + Connection.threadId);
        let searchTerm = req.body.search; 
        //user the connection
        Connection.query('SELECT * FROM user WHERE fname LIKE ? OR lname LIKE ? OR email LIKE ? OR contact LIKE ?',['%' + searchTerm + '%','%' + searchTerm + '%','%' + searchTerm + '%','%' + searchTerm + '%'],(err,rows)=>{
            //when done with connecion, release it
            Connection.release();
            if(!err){
                res.render('home',{rows});
            }else{
                console.log(err);
            }
            console.log('the data from the user table : \n', rows);
        });
    });
}

exports.form = (req, res) => {
    res.render('adduser');
}

//add new user
exports.create = (req, res) => {
    const{u_name,u_age,u_gender,u_phno,u_altphno,u_mail,u_altmail,u_address}=req.body;
    pool.getConnection((err,Connection) =>{
        if(err) throw err; //not connected!
        console.log('connected as ID' + Connection.threadId);
        let searchTerm = req.body.search; 
        //user the connection
        Connection.query('INSERT INTO g_user SET u_name=?, u_age=?, u_gender=?, u_phno=?, u_altphno=?, u_mail=?, u_altmail=?, u_address=?',[u_name,u_age,u_gender,u_phno,u_altphno,u_mail,u_altmail,u_address],(err,rows)=>{
            //when done with connecion, release it
            Connection.release();
            if(!err){
                res.render('adduser',{ alert: 'User added successfully!'});
            }else{
                console.log(err);
            }
            console.log('the data from the user table : \n', rows);
        });
    });
}

//Edit user
exports.edit = (req, res) => {
    pool.getConnection((err,Connection) =>{
        if(err) throw err; //not connected!
        console.log('connected as ID' + Connection.threadId);
        //user the connection
        Connection.query('SELECT * FROM g_user WHERE u_id=?',[req.params.id],(err,rows)=>{
            //when done with connecion, release it
            Connection.release();
            if(!err){
                res.render('edituser',{rows});
            }else{
                console.log(err);
            }
            console.log('the data from the user table : \n', rows);
        });
    });
}

//Update user
exports.update = (req, res) => {
    const{u_name,u_age,u_gender,u_phno,u_altphno,u_mail,u_altmail,u_address}=req.body;
    pool.getConnection((err,Connection) =>{
        if(err) throw err; //not connected!
        console.log('connected as ID' + Connection.threadId);
        //user the connection
        Connection.query('UPDATE g_user SET u_name=?, u_age=?, u_gender=?, u_phno=?, u_altphno=?, u_mail=?, u_altmail=?, u_address=? WHERE u_id=?',[u_name,u_age,u_gender,u_phno,u_altphno,u_mail,u_altmail,u_address,req.params.id],(err,rows)=>{
            //when done with connecion, release it
            Connection.release();
            if(!err){
                pool.getConnection((err,Connection) =>{
                    if(err) throw err; //not connected!
                    console.log('connected as ID' + Connection.threadId);
                    //user the connection
                    Connection.query('SELECT * FROM g_user WHERE u_id=?',[req.params.id],(err,rows)=>{
                        //when done with connecion, release it
                        Connection.release();
                        if(!err){
                            res.render('edituser',{rows, alert:`${u_name} has been updated!`});
                        }else{
                            console.log(err);
                        }
                        console.log('the data from the user table : \n', rows);
                    });
                }); 
            }else{
                console.log(err);
            }
            console.log('the data from the user table : \n', rows);
        });
    });
}

//Delete user
exports.delete = (req, res) => {
    // pool.getConnection((err,Connection) =>{
    //     if(err) throw err; //not connected!
    //     console.log('connected as ID' + Connection.threadId);
    //     //user the connection
    //     Connection.query('DELETE FROM user WHERE id=?',[req.params.id],(err,rows)=>{
    //         //when done with connecion, release it
    //         Connection.release();
    //         if(!err){
    //             res.redirect('/');
    //         }else{
    //             console.log(err);
    //         }
    //         console.log('the data from the user table : \n', rows);
    //     });
    // });

    pool.getConnection((err,Connection) =>{
        if(err) throw err; //not connected!
        console.log('connected as ID' + Connection.threadId);
        //user the connection
        Connection.query('UPDATE g_user SET u_status =? WHERE u_id=?',['removed',req.params.id],(err,rows)=>{
            //when done with connecion, release it
            Connection.release();
            if(!err){
                let removeduser= encodeURIComponent('User successfully removed. ');
                res.redirect('/?removed='+removeduser);
            }else{
                console.log(err);
            }
            console.log('the data from the user table : \n', rows);
        });
    });
}

//view user all
exports.viewall = (req, res) => {
    pool.getConnection((err,Connection) =>{
        if(err) throw err; //not connected!
        console.log('connected as ID' + Connection.threadId);
        //user the connection
        Connection.query('SELECT * FROM g_user WHERE u_id=?',[req.params.id],(err,rows)=>{
            //when done with connecion, release it
            Connection.release();
            if(!err){
                res.render('viewuser',{rows});
            }else{
                console.log(err);
            }
            console.log('the data from the user table : \n', rows);
        });
    });
}

//user
exports.view_user = (req, res) => {
    res.render('user');
}

//collobarator
exports.view_collab = (req, res) => {
    res.render('collaborator');
}

//sponsor
exports.view_sponsor = (req, res) => {
    res.render('sponsor');
}

//employee
exports.view_emp = (req, res) => {
    res.render('employee');
}

//service
exports.view_service = (req, res) => {
    res.render('service');
}

//event
exports.view_event = (req, res) => {
    res.render('event');
}


