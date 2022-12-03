exports.getAllTours=(req,res)=>{
     res.send("get tours  ");
}
exports.addTours=(req,res)=>{
          res.send("add tour  ");     
}
exports.getTour=(req,res)=>{
     res.send(`get tours ${req.params.id} `);
};
exports.deleteTour=(req,res)=>{
     console.log(req.body);
     res.send(`delete  tours ${req.params.id} `);
};
exports.updateTour=(req,res)=>{
     console.log(req.body);
     res.send(`update  tours ${req.params.id} `);
};