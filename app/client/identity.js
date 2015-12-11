/**
var c = Identity.assertionCrypto.encryptAssertion("test","12345")
var res = Identity.assertionCrypto.decryptAssertion(c.encryptedAssertion, c.encryptedAssertionKey, "12345")
res == "test"
*/

class AssertionCrypto {
	encryptValue(value, key){
		return CryptoJS.AES.encrypt(value,key);
	}

	encryptAssertion(value, privateKey) {
		// Generate new random encryption key for this assertion
		var assertionKey = CryptoJS.lib.WordArray.random(128/8).toString(); // example "883bdecfed2846dafcaa2d1a4e4a47a2"
		// Use our newly generated key to encrypt the assertion value
		var encryptedAssertionValue = this.encryptValue(value, assertionKey); //CryptoJS.AES.encrypt(value,assertionKey);
		// Use our private key to encrypt the assertionKey so we're the only one able to decrypt the actual key and thus the value
		var encryptedAssertionKey = this.encryptValue(assertionKey, privateKey); // CryptoJS.AES.encrypt(assertionKey, privateKey);
		return {
			encryptedAssertion: encryptedAssertionValue.toString(),
			encryptedAssertionKey: encryptedAssertionKey.toString()
		}
	}
	
	/**
	both encrypted value should be passed in as string formatted : U2FsdGVkX18JytpnqYeh4tx4ZEjHTowbl....
	*/
	decryptAssertion(encryptedAssertionKey, encryptedAssertion, privateKey) {
	  var decryptedAssertionKey = CryptoJS.AES.decrypt(encryptedAssertionKey, privateKey).toString(CryptoJS.enc.Utf8); // ;
	  // decryptedAssertionKey should now be back to the same form as it was after generate , example "883bdecfed2846dafcaa2d1a4e4a47a2"
	  // CryptoJS.AES.decrypt("U2FsdGVkX1/JizQazjQ0i56ddWxrAMSsF4endTbuEF4=", "883bdecfed2846dafcaa2d1a4e4a47a2").toString(CryptoJS.enc.Utf8);
      return CryptoJS.AES.decrypt(encryptedAssertion, decryptedAssertionKey).toString(CryptoJS.enc.Utf8);
	}
};

class IdentityImpl {
	constructor(){
		var web3 = new Web3();
		web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545'));

		//
		var identityContract = web3.eth.contract([{"constant":false,"inputs":[],"name":"kill","outputs":[],"type":"function"},{"constant":false,"inputs":[{"name":"assertionType","type":"uint256"},{"name":"key","type":"string"},{"name":"value","type":"string"}],"name":"assert","outputs":[],"type":"function"},{"constant":false,"inputs":[{"name":"assertionType","type":"uint256"}],"name":"attest","outputs":[],"type":"function"},{"constant":false,"inputs":[{"name":"assertionType","type":"uint256"}],"name":"get","outputs":[{"name":"key","type":"string"},{"name":"value","type":"string"}],"type":"function"},{"constant":false,"inputs":[{"name":"assertionType","type":"uint256"},{"name":"grantee","type":"address"},{"name":"key","type":"string"}],"name":"grant","outputs":[],"type":"function"}]);
		//

		this.identity = identityContract.at("0x51ddf623a7bde61c1a60d69434e0aa9abd947aa0");

		this.assertionCrypto = new AssertionCrypto();
	}
	
	assert(index, value, privateKey){
		var encryptedAssertion = this.assertionCrypto.encryptAssertion(value, privateKey);
		console.log(encryptedAssertion);
		this.identity.assert(index, encryptedAssertion.encryptedAssertionKey, encryptedAssertion.encryptedAssertion, {gas: 1732560});
	}
	get(index, privateKey){
		var encryptedAssertion = this.identity.get.call(index);
		console.log(encryptedAssertion);
		return this.assertionCrypto.decryptAssertion(encryptedAssertion[1], encryptedAssertion[0], privateKey);
	}
};

Identity = new IdentityImpl();