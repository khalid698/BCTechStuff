
if (Meteor.isClient) {
  
  var web3 = new Web3();
  web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545'));
  var account =web3.eth.coinbase

  Template.account.helpers({
    "address": function() {
      return account;
    },
    "balance": function(){
      return web3.eth.getBalance(account).toString(10);
    }
  })

  Template.assert.events({
    "click #assert-name": function(event, template){
      var name = template.find("#name").value;
      console.log("Asserting name "+name+" on account "+account);
      var encryptedAssertion = Identity.assert(0, name, "supersecretkey");
    },
    "click #get-name": function(event, template){
      console.log("Reading name on account "+account);
      template.find("#name").value = Identity.get(0, "supersecretkey");
    }
  })

}
