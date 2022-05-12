const mongoClient = require('mongodb').MongoClient ;

const state={
    db:null
}


module.exports.connect = function(){
    const url = 'mongodb://localhost:27017';
    const dbName = "userInfo";
  

    mongoClient.connect(url,(err,client)=>{
        if(err){
            console.log("Error Connection"+err);
        }else{
            console.log("Database Connected Successfully");
          state.db = client.db(dbName)
        }
    })

}
module.exports.get = function(){
    return state.db
}