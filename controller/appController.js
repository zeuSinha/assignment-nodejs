const mongoose = require('mongoose')
const UserModel = mongoose.model('User')

let getAllUser = (req, res) =>{
    UserModel.find()
        .select('-__v -_id')
        .lean()
        .exec((err, result) =>{
            if(err){
                let apiResponse = response.generate(true, 'Error in getting users', 400, null)
                res.send(apiResponse)
            }
            else if(result === undefined || result === null || result === ''){
                let apiResponse = response.generate(true, 'No users found!!!',404, null )
                res.send(apiResponse)
            }
            else{
                let apiResponse = response.generate(false, 'Users Found', 200, result)
                res.send(apiResponse)
            }
        })
}

let login = (req,res) => {

    let findUser = () =>{
        console.log('findUser()')
        return new Promise((resolve, reject)=>{
            if(req.body.email){
                console.log(req.body)
                UserModel.findOne({email : req.body.email})
                    .exec((err, userDetails)=>{
                        if(err){
                            let apiResponse = response.generate(true, 'Failed to find user Details', 500, null)
                            reject(apiResponse)
                        }
                        else if(check.isEmpty(userDetails)){
                            let apiResponse = response.generate(true, 'No User found!!', 404, null)
                            reject(apiResponse)
                        }
                        else {
                            logger.info('User Found!!', 'findUser()', 10)
                            console.log('User found!!!!!!')
                            resolve(userDetails)
                        }

                    })
            }
            else {
                let apiResponse = response.generate(true, 'Email parameter is missing', 400, null)
                reject(apiResponse)
            }
        })
    }

    let validatePassword = (retrivedUserDetails) =>{
        console.log('validatePassword()')
        return new Promise((resolve, reject)=>{
            passwordLib.comparePassword(req.body.password, retrivedUserDetails.password, (err, isMatch)=>{
                if(err){
                    logger.error(err.message, 'validatePassword', 10)
                    let apiResponse = response.generate(true, 'Login Failed', 500, null)
                    reject(apiResponse)
                }
                else if(isMatch){
                    let retrivedUserDetailsObj = retrivedUserDetails.toObject()
                    //delete retrivedUserDetailsObj.password
                    delete retrivedUserDetailsObj.__v
                    delete retrivedUserDetailsObj._id
                    delete retrivedUserDetailsObj.createdOn
                    resolve(retrivedUserDetailsObj)
                }
                else {
                    let apiResponse = response.generate(true, 'Wrong Password, LOgin Failed', 400, null)
                    reject(apiResponse)
                }
            })
        })
    }

    findUser(req, res)
        .then(validatePassword)
        .then((resolve) =>{
            let apiResponse = response.generate(false, 'Login Successful', 200, resolve)
            res.status(200)
            res.send(apiResponse)
        })
        .catch((err) =>{
            console.log(err)
            res.status(err.status)
            res.send(err)
        })

}

let signUp = (req, res) => {

    let validateUserInput = () =>{
        return new Promise((resolve, reject)=>{
            if(req.body.email){
                if(!validateInput.Email(req.body.email)){
                    let apiResponse = response.generate(true, 'Email does not meet the requirement', 400, null)
                    reject(apiResponse)
                }
                else if(check.isEmpty(req.body.password)){
                    let apiResponse = response.generate(true, 'Password is missing', 400, null)
                    reject(apiResponse)
                }
                else {
                    resolve(req)
                }
            }
            else {
                logger.error('Field missing during user creation', 'userController : createUser', 10)
                let apiResponse = response.generate(true, 'One or more parameter(s) missing', 400, null)
                reject(apiResponse)
            }
        })
    }

    let createUser = () =>{
        return new Promise((resolve, reject)=>{
            UserModel.findOne({email : req.body.email})
                .exec((err, retrivedUserDetails) =>{
                    if(err){
                        logger.err(err.message , 'userController : createUser', 10)
                        let apiResponse = response.generate(true, 'Failed to create User', 500, null)
                        reject(apiResponse)
                    }
                    else if(check.isEmpty(retrivedUserDetails)){
                        console.log(req.body)
                        let newUser = new UserModel({
                            userId : shortId.generate(),
                            firstName : req.body.firstName,
                            lastName : req.body.lastName || '',
                            email : req.body.email.toLowerCase(),
                            password : passwordLib.hashPassword(req.body.password),
                            mobileNumber : req.body.mobile,
                            createdOn : Date.now()
                        })

                        newUser.save((err, newuser)=>{
                            if(err){
                                logger.error(err.message, 'userController : createUser', 10)
                                let apiResponse = response.generate(true, 'Failed to create User', 500, null)
                                reject(apiResponse)
                            }
                            else {
                                let newUserObject = newuser.toObject()
                                resolve(newUserObject)
                            }
                        })
                    }
                    else {
                        logger.error('User already exists', 'userController : createUser', 4)
                        let apiResponse = response.generate(true, 'User already exists', 403, null)
                        reject(apiResponse)
                    }
                })
        })
    }

    validateUserInput(req, res)
        .then(createUser)
        .then((resolve) =>{
            //delete resolve.password
            delete resolve.__v
            delete resolve._id        
            let apiResponse = response.generate(false, 'User Created Successfully', 200, resolve)
            res.send(apiResponse)
        })
        .catch((err) =>{
            console.log(err)
            res.send(err)
        })
}



module.exports = {
    getAllUser : getAllUser,
    login : login,
    signup : signUp
}