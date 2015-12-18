contract Identity {
	
    address owner;
    
    //constructor
    function Identity() { owner = msg.sender; }
    
    function kill() { if (msg.sender == owner) suicide(owner); }
    modifier onlyowner { if (msg.sender == owner) _ }
    
    // Assertions
	mapping(uint => Assertion) assertions;

	struct Assertion {
	    string key;
	    string value;
	}
    
    /**
     * assertionType -> integer mapping of type ( 0: name etc)
     * value -> value of the assertion, encrypted
     * key -> pgp key file, accessible by all granted keys
     */
	function assert(uint assertionType, string key, string  value) onlyowner {
		// Clear out attestations when values changes ?
		assertions[assertionType] = Assertion(key, value);
	}

	function get(uint assertionType) returns (string  key, string value){
	    key = assertions[assertionType].key;
	    value = assertions[assertionType].value;
	}
	
	// Requests, 
	struct Request {
	    string publicKey;
	    uint[] assertions;
	}
    mapping(address => Request) requests;
    address[] requestees;
    
	function request(string publicKey, uint[] requestedAssertions){
	   // for(var i=0; i < requestedAssertions.length; i++){
	   //     requests.push(Request(msg.sender, publicKey, requestedAssertions[i]));
	   // }
	   requests[msg.sender] = Request(publicKey, requestedAssertions);
	   requestees.push(msg.sender);
	}
	
	function grant(address requestee) onlyowner {
	    delete requests[requestee];
	    for(var i=0; i < requestees.length; i++){
	        if ( requestees[i] == requestee) {
	            delete requests[i];
	        }
	    }
	}
	
	function getRequesteeCount() returns (uint)  {
	    return requestees.length;
	}
	
	function getRequestee(uint index) returns (address){
	    return requestees[index];
	}
	
	function getRequest(address requestee) returns (string publicKey, uint numberOfAssertions){
	    var request = requests[requestee];
        publicKey = request.publicKey;
        numberOfAssertions = request.assertions.length;
	}
	
	function getRequestAssertion(address requestee, uint index) returns (uint assertionType){
	    assertionType = requests[requestee].assertions[index];
	}
	

	function () {
        throw;
    }
}