module.exports = function(app) {
    app.get('/', function (req, res) {
        res.render('myInfo', { title: 'Express' });
    });
    app.get('/msg',function(req, res){
        res.render('index', { title: 'Express' });
    })
};