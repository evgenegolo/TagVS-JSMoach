require("dotenv").config();

const chai = require("chai");
const chaiHttp = require("chai-http")


chai.use(chaiHttp);
const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();


const apiRoutes = [
    {route :"/user" ,  expected:{status: 200 , length : 10} },
    {route :"/posts",  expected:{status: 200 , length : 10} },
    {route :"/comments",  expected:{status: 200 , length : 10} },
    {route :"/todos",  expected:{status: 200 , length : 10} },
    {route :"/user" ,  expected:{status: 404 , length : null} },
    ];


describe("Base API Tests", function() {
    describe("#TestAllApis()" ,function() {
    
        apiRoutes.forEach(({route, expected}) => {
            it(`Checking ${route.slice(1)} API. \n Expecting status: ${expected.status}. \n Expecting response data legth: ${expected.length}`,
            
            function(done){  
                chai
                .request(process.env.URL)
                .get(route)
                .set('Authorization',`Bearer ${process.env.API_KEY}`)
                .end((error, response)=>{
                    response.status.should.equal(expected.status , `expcted status :${expected.status} | actual status : ${response.status}`);
                    if(response.status == 200)
                        response.body.should.have.lengthOf(expected.length);
                    done();
                })
            });
        })
              
       

    })
});