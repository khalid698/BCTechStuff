contract owned {
	address owner;
	function owned(){ owner = msg.sender;}
}

contract mortal is owned {
	//enable owner to delete the object and its contents
    function kill() { if (msg.sender == owner) suicide(owner); }
}

contract identity is owned, mortal {
	mapping (address => mapping (string => bool)) permissionsRegister;
	mapping (string => bool) publicRegister;
	string[] attributeList;
	mapping (string => string) indexRegister;
	mapping (string => bytes32) keyRegister;
	mapping (string => address[]) attestationRegister;

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

	function attest (string hash) returns (bool success) {
		//check if public or attestor has permission to attest
		if(publicRegister[hash] || permissionsRegister[msg.sender][hash]){
			attestationRegister[hash].push(msg.sender);
			return true;
		}
		return false;
	}

	function getAttestations (string hash) returns (address[] attestations){
		//only people who know the hash, can view the attestations
		//or do we want anyone to be able to see this?
		return attestationRegister[hash];
	}

	function getAttributes() returns (string[] attributes){
		if(msg.sender == owner){
			return attributeList;
		}
		return string[];
	}

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