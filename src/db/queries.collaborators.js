const Authorizer = require("../policies/application");

const User = require('./models').User;
const Wiki = require('./models').Wiki;
const Collaborator = require('./models').Collaborator;

module.exports = {

    add(req, callback){
        if(req.user.userName == req.body.collaborator){
            return callback("You cannot add yourself as a collaborator");
        }
        User.findAll({
            where: {
                userName: req.body.collaborator
            }
        })
        .then((users) => {
            if(!users[0]){
                return callback("User not found");
            }
            Collaborator.findAll({
                where: {
                    userId: users[0].id,
                    wikiId: req.params.wikiId,
                }
            })
            .then((collabortors) => {
                if(collabortors.length != 0){
                    return callback(`${req.body.collaborator} is already collaborating on this wiki.`);
                }
                let newCollaborator = {
                    userId: users[0].id,
                    wikiId: req.params.wikiId
                };
                return Collaborator.create(newCollaborator)
                .then((collaborator) => {
                    callback(null, collaborator);
                })
                .catch((err) => {
                    callback(err, null);
                })
            })
            .catch((err) => {
                callback(err, null);
            })
        })
        .catch((err) => {
            callback(err, null);
        })
    },

    remove(req, callback){
        let collaboratorId = req.body.collaborator;
        let wikiId = req.params.wikiId;
        const authorized = new Authorizer(req.user, wiki, collaboratorId).destroy();

        if(authorized){
            Collaborator.destroy({
                where: {
                    userId: collaboratorId,
                    wikiId: wikiId
                }
            })
            .then((deletedRecordsCount) => {
                callback(null, deletedRecordsCount);
            })
            .catch((err) => {
                callback(err);
            });
        } else {
            req.flash("notice", "You are not authorized to do that.")
            callback(401);
        }
    }

}