contract identity {

	address owner;
	mapping (address => mapping (string => bool)) permissionsRegister;
	mapping (string => bool) publicRegister;
	string[] attributeList;
	mapping (string => string) indexRegister;
	mapping (string => bytes32) keyRegister;
	mapping (string => address[]) attestationRegister;

	//constructor
	function identity() { owner = msg.sender }

	//delete an identity and its contents
	function delete() { if (msg.sender == owner) suicide(owner); }

	//create new identity attribute data
	function assert (string index, string hash, bytes32 key, bool isPublic) 
	returns (bool success){
		//check if attribute has already been asserted
		//only identity owner can overwrite attributes
		if(indexRegister[index] == 0x0 || msg.sender == owner){
			indexRegister[index] = hash;
			keyRegister[hash] = key;
			publicRegister[hash] = isPublic;
			permissionsRegister[msg.sender][hash] = true;
			attributeList.push(index);
			return true;
		}
		return false;
	}
	
	//create new attribute meta-data
	function attest (string hash) returns (bool success) {
		//check if public or attestor has permission to attest
		if(publicRegister[hash] || permissionsRegister[msg.sender][hash]){
			attestationRegister[hash].push(msg.sender);
			return true;
		}
		return false;
	}

	//return the attestations of a particular assertion
	function getAttestations (string hash) returns (address[] attestations){
		//only people who know the hash, can view the attestations
		//or do we want anyone to be able to see this?
		return attestationRegister[hash];
	}

	//return the known attributes of an identity
	function getAttributes() returns (string[] attributes){
		if(msg.sender == owner){
			return attributeList;
		}
		return string[];
	}

	//get the assertion of a particular index value
	function getAssertion (string index) returns (string ipfsHash, bytes32 key) {
		//get the relevant ipfsHash
		string ipfsHash = indexRegister[index];

		//check if the msg.sender is permitted to read
		if(publicRegister[hash] || permissionsRegister[msg.sender][ipfsHash]){
			return (ipfsHash, keyRegister[ipfsHash]);
		} else {
			return ("permission denied", 0x0);
		}
	}

	//set permissions for inbound assertion access
	function setPermission (string index, address permittedUser, bool permitted)
	 returns (bool success) {
		//only the owner can add Permissions
		if(msg.sender == owner){
			permissionsRegister[permittedUser][index] = permitted;
			return true;
		}
		return false;
	}

}