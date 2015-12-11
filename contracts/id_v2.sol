contract Identity {
	
    address owner;
    function mortal() { owner = msg.sender; }
    function kill() { if (msg.sender == owner) suicide(owner); }
    modifier onlyowner { if (msg.sender == owner) _ }
    
	mapping(uint => Assertion) assertions;
	mapping(uint => address[]) attestations;
	struct Assertion {
	    string key;
	    string value;
	}
    /**
     * this represents : encrypt(key=grantee.publicKey, value=)
     * the grantee can use this in combination with his private key to unlock the key to unlock the actual value.
     */
	mapping(uint => mapping(address => string)) grants;
    
    /**
     * assertionType -> integer mapping of type ( 0: name etc)
     * value -> value of the assertion, encrypted
     * key -> unique key for this assertion, symatrically encrypted with the owners private key.
     */
	function assert(uint assertionType, string key, string  value) onlyowner {
		// Clear out attestations when values changes ?
		assertions[assertionType] = Assertion(value, key);
	}

	function attest(uint assertionType) {
		attestations[assertionType].push(msg.sender);
	}
	/**
	 * key here is the key of the assertions, encrypted by the grantees public key.
	 */
	function grant(uint assertionType, address grantee, string key) onlyowner {
        grants[assertionType][grantee] = key;
	}
	function get(uint assertionType) returns (string  key, string value){
	    key = assertions[assertionType].key;
	    value = assertions[assertionType].value;
	}
}