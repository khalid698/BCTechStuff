contract Identity {
	
    address owner;
    
    //constructor
    function Identity() { owner = msg.sender; }
    
    function kill() { if (msg.sender == owner) suicide(owner); }
    modifier onlyowner { 
        if (msg.sender != owner) {
            throw;
        }
        _ 
    }
    
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
	
	function updateKey(uint assertionType, string key) onlyowner {
	    assertions[assertionType].key = key;
	}

	function get(uint assertionType) returns (string  key, string value){
	    key = assertions[assertionType].key;
	    value = assertions[assertionType].value;
	}
	
	// Requests, 
// 	struct Request {
// 	    string publicKey;
// 	    uint[] assertions;
// 	    uint[] grantedAssertions;
// 	}
//     mapping(address => Request) requests;
    mapping(address => uint[]) requests;
    mapping(address => uint[]) grants;
    mapping(address => string) keys;
    address[] requestees;
    
	function request(string publicKey, uint[] requestedAssertions){
	   keys[msg.sender] = publicKey;
       requests[msg.sender] = requestedAssertions;
	  // Exit early if requestee is already in requestee list
	   for(var r=0; r< requestees.length; r++){
	       if (requestees[r] == msg.sender){
	           return;
	       }
	   }
	   requestees.push(msg.sender);
	}
	
	// This only moves from assertions -> granted
	// Deduping responsibility lies with request()
	function grant(address requestee, uint[] assertionTypes) {
	    uint a;
	    for(a=0; a < assertionTypes.length; a++){
	        grants[requestee].push(assertionTypes[a]);
 	    }
 	    delete requests[requestee];
        // for(var r=0; r < requests[requestee].length; r++){
    	   // for(a=0; a < assertionTypes.length; a++){
        //         if(requests[requestee][r] == assertionTypes[a]){
        //             delete requests[requestee][r];
        //         }
     	  //  }
        // }
	}
	
	function getRequesteeCount() returns (uint)  {
	    return requestees.length;
	}
	
	function getRequestee(uint index) returns (address){
	    return requestees[index];
	}
	
	function getRequest(address requestee) returns (string publicKey, uint numberOfAssertions){
	    var request = requests[requestee];
        publicKey = keys[requestee];
        numberOfAssertions = requests[requestee].length;
	}
	
	function getRequestAssertion(address requestee, uint index) returns (uint assertionType){
	    assertionType = requests[requestee][index];
	}
	// Grants ( shared model with requests)
	function getGrantedAssertionCount(address requestee) returns (uint count){
	    count = grants[requestee].length;
	}
	function getGrantedAssertion(address requestee, uint index) returns (uint assertionType){
	    assertionType = grants[requestee][index];
	}

	function () {
        throw;
    }
}