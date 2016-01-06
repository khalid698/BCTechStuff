contract Identity {
    
    address owner;

    //constructor
    function Identity() { 
        owner = msg.sender; 
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
        delete attestations[assertionType];
        for(var i=0; i < attestedAssertions.length; i++){
            if(attestedAssertions[i] == assertionType){
                delete attestedAssertions[i];    
            }
        }
    }
    
    function get(uint assertionType) returns (string  key, string value){
        bytes memory b = bytes(assertions[assertionType]);
        if(b.length > 0){
            key = sessionKeys[msg.sender][assertionType];
            value = assertions[assertionType]; 
        } else {
            key = 'undefined';
            value = 'undefined';
        }
    }
    
    mapping(address => string) granteeDescriptions;
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
    
    function grant(address requestee, uint assertionType, string sessionKey, string description) {
        for(var r=0; r < grantedAssertions[requestee].length; r++){
            if(grantedAssertions[requestee][r] == assertionType){
                throw;
            }
        }
        sessionKeys[requestee][assertionType] = sessionKey;
        grantedAssertions[requestee].push(assertionType);
        granteeDescriptions[requestee] = description;
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
    
    function getGrantee(uint index) returns (address grantee, string description){
        grantee = grantees[index];
        description = granteeDescriptions[grantee];
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
    
    // Attestations
    mapping(uint => address[]) attestations;
    uint[] attestedAssertions;
    
    function attest(uint[] assertionTypes){
        for(var r=0; r < assertionTypes.length; r++){
            // process individual assertion
            var assertionType = assertionTypes[r];
            var addToAttestedAssertions = true;
            var addToAttestations = true;
            
            // Check if this is already attested by msg.sender
            for(var s=0; s < attestations[assertionType].length; s++){
              if(attestations[assertionType][s] == msg.sender){
                addToAttestations = false;
              }
            }
            if ( addToAttestations ){
                attestations[assertionType].push(msg.sender);
            }
            // Check if this assertion is already attested          
            for(s=0; s < attestedAssertions.length; s++){
                if(attestedAssertions[s] == assertionType){
                    addToAttestedAssertions = false;
                }
            }
            if ( addToAttestedAssertions ){
                attestedAssertions.push(assertionType);
            }
        }
    }
    
    function getAttestedAssertionCount() returns ( uint count){
        count = attestedAssertions.length;
    }
    
    function getAttestedAssertion(uint index) returns (uint assertionType) {
        assertionType = attestedAssertions[index];
    }
    
    function getAttesteeCount(uint assertionType) returns (uint count){
        count = attestations[assertionType].length;
    }
    
    function getAttestee(uint assertionType, uint index) returns (address attestee) {
        attestee = attestations[assertionType][index];
    }
    
    function () {
        throw;
    }
}