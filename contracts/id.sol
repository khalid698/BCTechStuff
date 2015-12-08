contract Identity {

	//the ethereum account who owns the identity
	address owner;
	//a condition struct
	struct Condition {
		bool access;
		uint cost;
	}
	//a register of permissions to access assertions, on what condition
	mapping (address => mapping (string => Condition)) permissionsRegister;
	//a register of publicly visible assertions
	mapping (string => bool) publicRegister;
	//a list of the attributes belonging to the identity
	string[] attributeList;
	//mapping the index string to the ipfs hash
	mapping (string => string) indexRegister;
	//mapping the ipfs hash to the decryption key
	mapping (string => bytes32) keyRegister;
	//mapping the ipfs hash to attestations
	mapping (string => address[]) attestationRegister;
	//access struct
	struct Access {
		string accessType;
		string hash;
		address accessor;
		uint time;
	}
	//list of all the access events (its much cheaper to use events)
	//however, for privacy, on chain event logging is preferrable
	Access[] accessEvents;

	//constructor
	function Identity() { 
		owner = msg.sender;
		logAccess("new identity", "genesis", msg.sender);
		}

	//delete an identity and its contents
	function kill() { if (msg.sender == owner) suicide(owner); }

	//log access event
	function logAccess (string accessType, string hash, address accessor) {
		accessEvents.push(Access(accessType, hash, accessor, now));
	}

	//create new identity attribute data
	function assert (string index, string hash, bytes32 key, bool isPublic) 
	returns (bool success){
		//anyone with access to the contract, can make assertions
		//check if attribute has already been asserted
		//only identity owner can overwrite attributes
		if(bytes(indexRegister[index]).length == 0 || msg.sender == owner){
			indexRegister[index] = hash;
			keyRegister[hash] = key;
			publicRegister[hash] = isPublic;
			permissionsRegister[msg.sender][hash] = Condition(true, 0);
			attributeList.push(index);
			logAccess("new assertion", hash, msg.sender);
			return true;
		}
		return false;
	}
	
	//create new attribute meta-data
	function attest (string hash) returns (bool success) {
		//check if public or attestor has permission to attest
		if(publicRegister[hash] || permissionsRegister[msg.sender][hash].access){
			attestationRegister[hash].push(msg.sender);
			logAccess("new attestation", hash, msg.sender);
			return true;
		}
		return false;
	}

	//get the assertion of a particular index value
	function getAssertion (string index) returns (string _ipfsHash, bytes32 key) {
		//get the relevant ipfsHash
		string ipfsHash = indexRegister[index];
		Condition c = permissionsRegister[msg.sender][ipfsHash];
		//check if the msg.sender is permitted to read
		if(publicRegister[ipfsHash] || (c.access && msg.value > c.cost)){
			logAccess("access assertion", ipfsHash, msg.sender);
			return (ipfsHash, keyRegister[ipfsHash]);
		} else {
			return ("permission denied", 0x0);
		}
	}

	//return the attestations of a particular assertion
	function getAttestations (string hash) returns (address[] attestations){
		//only people who know the hash, can view the attestations
		//or do we want anyone to be able to see this?
		logAccess("access attestations", hash, msg.sender);
		return attestationRegister[hash];
	}

	//set permissions for inbound assertion access
	function setPermission (string index, address permittedUser, uint cost, bool permitted)
	 returns (bool success) {
		//only the owner can add Permissions
		if(msg.sender == owner){
			permissionsRegister[permittedUser][index] = Condition(permitted, cost);
			logAccess("set permission", index, msg.sender);
			return true;
		}
		return false;
	}

	//return the number of attributes of an identity
	function getAttributesLength () returns (uint length){
		if(msg.sender == owner){
			return attributeList.length;
		}
		return 0;
	}

	//return attribute index of an identity (will need to run a loop on the client side)
	function getAttribute (uint index) returns (string attribute){
		if(msg.sender == owner && attributeList.length < index){
			return attributeList[index];
		}
		return "";
	}

	//get length of accessEvents
	function getAccessLength () returns (uint length){
		if(msg.sender == owner){
			return accessEvents.length;
		}
		return 0;
	}

	//return an access event from the access log
	function getAccessEvent (uint index) returns (string a, string h, address o, uint t){
		if(msg.sender == owner && accessEvents.length < index){
			Access e = accessEvents[index];
			return (e.accessType, e.hash, e.accessor, e.time);
		}
	}

	//clear out the balance of the contract
	//this is where the ID service provider would add their conditions
	function sweepFunds() {
		if(msg.sender == owner){
			owner.send(this.balance);
		}
	}

}