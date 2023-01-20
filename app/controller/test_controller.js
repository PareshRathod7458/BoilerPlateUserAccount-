const testModel = require('../models/testominia_model');
const {logger} = require('../logger/logger');
const {addForm, editForm} = require('../validation/testValidation');

exports.testimonial =async(req,res)=>{
    const result = await testModel.find();
    res.render('testimonial',{
        users:result
    })
}


exports.addTest = (req,res)=>{
    return res.render('addTest',{
        values: req.body
    });

}
exports.addData = (req,res)=>{
    try{
        const { error } = editForm(req.body);
        console.log(error);
        if (error) {
            if (error.details[0].context.key == 'name') {
                var err1 = error.details[0].message;
                return res.render('addData', {
                    error1: err1,
                    values: req.body
                });
            }
            if (error.details[0].context.key == 'designation') {
                var err1 = error.details[0].message;
                return res.render('addData', {
                    error2: err1,
                    values: req.body
                });
            }
            if (error.details[0].context.key == 'description') {
                var err1 = error.details[0].message;
                return res.render('addData', {
                    error3: err1,
                    values: req.body
                });
            }

        }else{
            const data = {
                name: req.body.name,
                designation: req.body.designation,
                description: req.body.description,
                uploadImage: req.file.filename     
    }
    const testData = new testModel(data)
    testData.save()
        .then(data => {
            res.redirect('/testimonial')
        })
}
} catch(err){
        logger.error(err);
    }

}
exports.editTest = (req,res)=>{
    testModel.findById(req.params.id, function (err, result) {
        res.render('editTest', {
            users: result
        })
    })
}
exports.editData = async(req,res)=>{
    try{
        const { error } = editForm(req.body);
        console.log(error);
        if (error) {
            if (error.details[0].context.key == 'name') {
                var err1 = error.details[0].message;
                return res.render('editTest', {
                    error1: err1,
                    values: req.body
                });
            }
            if (error.details[0].context.key == 'designation') {
                var err1 = error.details[0].message;
                return res.render('editTest', {
                    error2: err1,
                    values: req.body
                });
            }
            if (error.details[0].context.key == 'description') {
                var err1 = error.details[0].message;
                return res.render('editTest', {
                    error3: err1,
                    values: req.body
                });
            }
        

        } const data = {
            name: req.body.name,
            designation: req.body.designation,
            description:req.body.description
        }
        if(req.file){
            data.uploadImage = req.file.filename
        }
        const result = await testModel.findByIdAndUpdate(req.params.id, data)
        res.redirect('/testimonial')
    
    }catch(err){
        logger.error(err);
    }
}

exports.deleteData = (req, res)=>{
    const id = req.params.id;
    testModel.findByIdAndDelete(id)
    .then(data =>{
        if(!data){
            res.status(404).send({message:`cannot Delete user with${id}.may be is wrong`})
        }else{
            res.redirect('/testimonial')
        }
    })
}


exports.deleteAll = (req,res)=>{
    const id = req.query;
    var countId = Object.keys(id).length;
    for(let i=0; i < countId; i++){
        testModel.findByIdAndDelete(Object.keys(id)[i], function(err){
            if(err){
                   logger.error("error",err)
            }
        })
    }
    return res.redirect('/testimonial')
}