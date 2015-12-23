contract Identity {
	
    address owner;
    string public name; // Human readable identifier, can be 'John Smith' or 'BitBank Inc' depending on the usage.
    
    //constructor
    function Identity(string n) { 
        owner = msg.sender; 
        name = n;
    }
    
    function kill() { if (msg.sender == owner) suicide(owner); }
    modifier onlyowner { 
        if (msg.sender != owner) {
            throw;
        }
        _ 
    }
    
    // Assertions
	mapping(uint => string) assertions;

	function assert(uint assertionType, string key, string  value) onlyowner {
		// Clear out attestations when values changes ?
		assertions[assertionType] = value;
	    sessionKeys[owner][assertionType] = key;
	}
	
	function get(uint assertionType) returns (string  key, string value){
	    key = sessionKeys[msg.sender][assertionType];
	    value = assertions[assertionType];
	}
	
    mapping(address => mapping(uint => string)) sessionKeys;
    mapping(address => uint[]) grantedAssertions;
    address[] grantees;
    
    function revoke(address requestee) onlyowner {
        for(var i=0; i < grantedAssertions[requestee].length; i++){
            delete sessionKeys[requestee][grantedAssertions[requestee][i]];
        }
        delete grantedAssertions[requestee];
        for(i=0; i < grantees.length; i++){
            if(grantees[i] == requestee){
                delete grantees[i];
                grantees.length -= 1;
                break;
            }
        }
    }
    
	function grant(address requestee, uint assertionType, string sessionKey) {
	    for(var r=0; r < grantedAssertions[requestee].length; r++){
	        if(grantedAssertions[requestee][r] == assertionType){
	            throw;
	        }
	    }
	    sessionKeys[requestee][assertionType] = sessionKey;
	    grantedAssertions[requestee].push(assertionType);
        for(r=0; r< grantees.length; r++){
	       if (grantees[r] == requestee){
	           return;
	       }
	    }
	    grantees.push(requestee);
	}
	
	function getGranteeCount() returns (uint count){
	    count = grantees.length;
	}
	
	function getGrantee(uint index) returns (address grantee){
	    grantee = grantees[index];
	}
	
	function getGrantedAssertionCount(address requestee) returns (uint count){
	    count = grantedAssertions[requestee].length;
	}
	
	function getGrantedAssertion(address requestee, uint index) returns (uint assertionType){
	    assertionType = grantedAssertions[requestee][index];
	}
	
    function getSessionKey(address requestee, uint assertionType) returns (string encryptedSessionKey){
        encryptedSessionKey = sessionKeys[requestee][assertionType];
    }
    
	function () {
        throw;
    }
}