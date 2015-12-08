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

	//constructor -- cost 4.08341567825 USD
	function Identity() { 
		owner = msg.sender;
		logAccess("new identity", "genesis", msg.sender);
		}

	//onlyowner function modifier
	modifier onlyowner { if (msg.sender == owner) _ }

	//delete an identity and its contents -- cost 0.0007134115 USD
	function kill() onlyowner { suicide(owner); }

	//log access event -- cost 0.11263427475 USD
	function logAccess (string accessType, string hash, address accessor) {
		accessEvents.push(Access(accessType, hash, accessor, now));
	}

	//create new identity attribute data -- cost 0.56110996925 USD
	function assert(string index, string hash, bytes32 key, bool isPublic) onlyowner {
		//only the identity owner can make assertions about their identity
		indexRegister[index] = hash;
		keyRegister[hash] = key;
		publicRegister[hash] = isPublic;
		permissionsRegister[msg.sender][hash] = Condition(true, 0);
		attributeList.push(index);
		logAccess("new assertion", hash, msg.sender);
	}
	
	//create new attribute meta-data -- cost 0.100721091 USD
	function attest (string hash) {
		//check if public or attestor has permission to attest
		if(publicRegister[hash] || permissionsRegister[msg.sender][hash].access){
			attestationRegister[hash].push(msg.sender);
			logAccess("new attestation", hash, msg.sender);
		}
	}

	//get the assertion of a particular index value -- cost 0.1026169525 USD
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

	//return the attestations of a particular assertion -- cost 0.241708546 USD
	function getAttestations (string hash) returns (address[] attestations){
		//only people who know the hash, can view the attestations
		//or do we want anyone to be able to see this?
		logAccess("access attestations", hash, msg.sender);
		return attestationRegister[hash];
	}

	//set permissions for inbound assertion access -- 0.241558769 USD
	function setPermission (string index, address permittedUser, uint cost, bool permitted) onlyowner{
		//only the owner can add Permissions
		permissionsRegister[permittedUser][index] = Condition(permitted, cost);
		logAccess("set permission", index, msg.sender);
	}

	//return the number of attributes of an identity
	// cost 0.00108194175 USD
	function getAttributesLength () onlyowner returns (uint length) {
		return attributeList.length;
	}

	//return attribute index of an identity (will need to run a loop on the client side)
	// cost 0.050703456 USD
	function getAttribute (uint index) returns (string attribute){
		if(msg.sender == owner && attributeList.length < index){
			return attributeList[index];
		}
	}

	//get length of accessEvents
	// cost 0.00103858525 USD
	function getAccessLength () onlyowner returns (uint length) {
		return accessEvents.length;
	}

	//return an access event from the access log -- cost 0.10075853525 USD
	function getAccessEvent (uint index) returns (string a, string h, address o, uint t){
		if(msg.sender == owner && accessEvents.length < index){
			Access e = accessEvents[index];
			return (e.accessType, e.hash, e.accessor, e.time);
		}
	}

	//clear out the balance of the contract
	//this is where the ID service provider would add their conditions
	//cost 0.00133419775 USD
	function sweepFunds() onlyowner{
		owner.send(this.balance);
	}

}