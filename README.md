# objectchain
Working repo for a new distributed identity system.

ObjectChain aims to create a new, open, and interoperable standard for digital identity informed by the Windhover Principles.

# Terminology

### DID
A distributed identity. An object, stored on the blockchain, with identity attributes relating to the owner of the object. The owner of the object is an Ethereum account. We assume that this public/private key-pair can be bound to a person, or an organisation. A DID audits, encaptulates and controls access to its owner's identity data.

### Assertion
The creation of new attribute data belonging to a DID.

### Attestation
The creation of metadata relating to an assertion, signed by a DID. An attestation comments on the veracity of an assertion.

### Naked Assertion
Attribute data of a DID that has not been attested to.

### Certificate Authority
A trusted entity that attests to assertions of DIDs. Under this system, anyone with access rights to attributes of a given DID is able to make attestations about those attributes. Thus, a certificate authority is subjectively recognised as such by the party relying on the veracity of those attributes. Anyone is able to become a certificate authority to any party they can convince.